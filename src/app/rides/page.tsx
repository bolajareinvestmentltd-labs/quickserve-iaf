import { db } from "@/db";
import { rides } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, Car, MessageCircle, Users, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function RidesBoard() {
  // Fetch only rides that are not full
  const activeRides = await db.query.rides.findMany({
    where: eq(rides.isFull, false),
    orderBy: [desc(rides.createdAt)],
  });

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 pb-20">
      <div className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md p-4 flex items-center border-b border-neutral-800">
        <Link href="/" className="p-2 bg-neutral-900 rounded-full text-white active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="ml-4">
          <span className="font-bold text-white block leading-tight">Festival Carpool</span>
          <span className="text-xs text-neutral-400">Find a ride to/from the event</span>
        </div>
      </div>

      <main className="p-5 flex-1">
        {activeRides.length === 0 ? (
          <div className="text-center p-10 bg-neutral-900 border border-neutral-800 border-dashed rounded-3xl mt-4">
            <Car className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">No active rides posted right now. Check back soon!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activeRides.map((ride) => {
              // Format the WhatsApp message dynamically
              const waMessage = encodeURIComponent(`Hi ${ride.driverName}, I saw your ride on Quickserve for the festival. Do you still have a seat available?`);
              const waLink = `https://wa.me/${ride.whatsappNumber.replace(/[^0-9]/g, '')}?text=${waMessage}`;

              return (
                <div key={ride.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl">
                  <div className="flex justify-between items-start border-b border-neutral-800 pb-4 mb-4">
                    <div>
                      <h3 className="font-black text-white text-xl">{ride.carModel}</h3>
                      <p className="text-neutral-400 text-sm mt-1 flex items-center gap-1">
                        Driver: <span className="text-white font-semibold">{ride.driverName}</span>
                      </p>
                    </div>
                    <div className="bg-purple-500/10 text-purple-400 px-3 py-2 rounded-xl flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="font-black">{ride.availableSeats} / {ride.totalSeats}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Ready to leave</span>
                    </div>

                    <a 
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-transform shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" /> DM Driver
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
