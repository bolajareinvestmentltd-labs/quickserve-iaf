import Header from '@/components/Header';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc } from 'drizzle-orm';
import AddRideForm from './AddRideForm';
import { Users, Clock, MapPin, MessageCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RidesPage() {
  const allRides = await db.query.rides.findMany({
    orderBy: [desc(schema.rides.createdAt)],
  });

  return (
    <main className="min-h-screen bg-[#0A0C10] text-gray-100 pb-24">
      <Header />
      <div className="container mx-auto px-4 md:px-8 pt-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">
            Festival <span className="text-orange-500">Carpool.</span>
          </h1>
          <p className="text-gray-400 text-lg">Find a ride home or share your empty seats.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1"><AddRideForm /></div>
          
          <div className="lg:col-span-2 space-y-4">
            {allRides.map((ride) => (
              <div key={ride.id} className="bg-[#14171F] p-5 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30 uppercase tracking-widest">
                      {ride.seats} Seats Left
                    </span>
                    <span className="text-gray-500 text-sm font-bold">{ride.vehicleInfo}</span>
                  </div>
                  <h3 className="font-black text-2xl text-white mt-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" /> {ride.destination}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400 font-medium">
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {ride.driverName}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Leaving: {ride.departureTime}</span>
                  </div>
                </div>
                
                <a 
                  href={`https://wa.me/${ride.whatsappNumber.replace(/\s/g, '')}?text=Hi%20${ride.driverName}!%20I'm%20at%20the%20festival.%20Do%20you%20still%20have%20a%20seat%20going%20to%20${ride.destination}?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1DA851] transition-all active:scale-95 shadow-lg shadow-green-500/20 whitespace-nowrap"
                >
                  <MessageCircle className="w-5 h-5" /> Book Seat
                </a>
              </div>
            ))}
            {allRides.length === 0 && (
              <div className="text-center py-16 bg-[#14171F] rounded-3xl border border-white/5">
                <Car className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 font-bold">No rides listed yet. Be the first to offer a seat!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
