import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { Resend } from 'resend';

// Initialize Resend with your environment key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, deliveryZone, ticketId, totalAmount, items, reference } = body;

    // 1. Insert the order into the database
    const [newOrder] = await db.insert(schema.orders).values({
      customerName,
      customerPhone,
      deliveryZone,
      ticketId: ticketId || null,
      totalAmount: totalAmount.toString(),
      status: 'pending',
    }).returning();

    // 2. Insert the individual items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemsToInsert = items.map((item: any) => ({
      orderId: newOrder.id,
      productId: item.id,
      quantity: item.quantity,
      subtotal: (item.price * item.quantity).toString(),
    }));

    await db.insert(schema.orderItems).values(itemsToInsert);

    // 3. Format the email content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemsListHtml = items.map((item: any) => 
      `<li><b>${item.quantity}x ${item.name}</b> (₦${(item.price * item.quantity).toLocaleString()}) - <i>from ${item.vendorName}</i></li>`
    ).join('');

    // 4. Fire off the Admin Email Alert via Resend
    try {
      await resend.emails.send({
        from: 'Quickserve Dispatch <onboarding@resend.dev>', // Resend's default testing address
        to: 'YOUR_EMAIL@gmail.com', // ⚠️ CHANGE THIS TO YOUR ACTUAL ADMIN EMAIL!
        subject: `🚨 NEW ORDER #${newOrder.id} - ${deliveryZone}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #f97316; margin-bottom: 0;">New Quickserve Order!</h2>
            <p style="color: #666; margin-top: 5px;">Order ID: #${newOrder.id}</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            
            <h3 style="margin-bottom: 10px;">Customer Details:</h3>
            <p style="margin: 5px 0;"><b>Name:</b> ${customerName}</p>
            <p style="margin: 5px 0;"><b>Phone:</b> ${customerPhone}</p>
            <p style="margin: 5px 0;"><b>Zone:</b> ${deliveryZone}</p>
            ${ticketId ? `<p style="margin: 5px 0;"><b>Ticket ID:</b> ${ticketId}</p>` : ''}
            
            <h3 style="margin-top: 20px; margin-bottom: 10px;">Order Summary:</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${itemsListHtml}
            </ul>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <h3 style="margin: 0;">Total Paid: ₦${Number(totalAmount).toLocaleString()}</h3>
            </div>
            
            <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
              Payment Reference: ${reference}
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email failed to send, but order was saved:', emailError);
      // We don't throw an error here because we still want the user's checkout to succeed even if the email fails!
    }

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
