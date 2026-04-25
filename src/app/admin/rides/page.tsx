import { db } from "@/db";
import { rides } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Car, CheckCircle2, User, Phone, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminRidesManager() {
  const allRides = await db.query.rides.findMany({
    orderBy: [desc(rides.createdAt)],
  });

  // 🚀 SERVER ACTION: Add a new ride
  async function addRide(formData: FormData) {
    "use server";
    await db.insert(rides).values({
      driverName: String(formData.get("driverName")),
      whatsappNumber: String(formData.get("whatsappNumber")),
      carModel: String(formData.get("carModel")),
      totalSeats: Number(formData.get("totalSeats")),
      availableSeats: Number(formData.get("totalSeats")), // Default to full capacity
      isFull: false,
    });
    revalidatePath("/admin/rides");
    revalidatePath("/rides"); // Sync public board
  }

  // 🚀 SERVER ACTION: The Driver Kill Switch
  async function markRideFull(formData: FormData) {
    "use server";
    const rideId = String(formData.get("rideId"));
    await db.update(rides).set({ isFull: true, availableSeats: 0 }).where(eq(rides.id, rideId));
    revalidatePath("/admin/rides");
    revalidatePath("/rides");
  }

  return (
    <div className="p-5 flex flex-col min-h-screen bg-neutral-950 pb-24">
      <header className="mb-6 mt-4">
        <h1 className="text-3xl font-black text-white">Ride Logistics</h1>
        <p className="text-neutral-400 text-sm mt-1">Manage festival carpool fleet</p>
      </header>

      {/* Add New Driver Form */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 mb-8">
        <h2 className="text-lg font-black text-white mb-4">Register Driver</h2>
        <form action={addRide} className="flex flex-col gap-4">
          <div className="bg-neutral-800 rounded-2xl p-4 flex items-center gap-3">
            <User className="text-neutral-400 w-5 h-5 shrink-0" />
            <input required name="driverName" type="text" placeholder="Driver Name" className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
          </div>
          <div className="bg-neutral-800 rounded-2xl p-4 flex items-center gap-3">
            <Car className="text-neutral-400 w-5 h-5 shrink-0" />
            <input required name="carModel" type="text" placeholder="Car Model (e.g. Toyota Camry)" className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
          </div>
          <div className="bg-neutral-800 rounded-2xl p-4 flex items-center gap-3">
            <Phone className="text-neutral-400 w-5 h-5 shrink-0" />
            <input required name="whatsappNumber" type="tel" placeholder="WhatsApp No. (e.g. 234...)" className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
          </div>
          <div className="bg-neutral-800 rounded-2xl p-4 flex items-center gap-3">
            <Users className="text-neutral-400 w-5 h-5 shrink-0" />
            <input required name="totalSeats" type="number" placeholder="Total Available Seats" className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-2xl font-bold mt-2 active:scale-95 transition-transform shadow-lg">
            Add to Fleet
          </button>
        </form>
      </div>

      {/* Active Fleet List */}
      <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
        Fleet Roster ({allRides.length})
      </h2>
      <div className="flex flex-col gap-4">
        {allRides.map((ride) => (
          <div key={ride.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-3xl flex justify-between items-center opacity-100 transition-opacity">
            <div>
              <h3 className={`font-bold text-lg ${ride.isFull ? 'text-neutral-500 line-through' : 'text-white'}`}>{ride.carModel}</h3>
              <p className="text-neutral-400 text-sm">{ride.driverName}</p>
            </div>
            
            {ride.isFull ? (
              <span className="bg-neutral-800 text-neutral-500 px-3 py-1 rounded-lg text-xs font-bold uppercase">Full</span>
            ) : (
              <form action={markRideFull}>
                <input type="hidden" name="rideId" value={ride.id} />
                <button type="submit" className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-transform">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Mark Full
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
