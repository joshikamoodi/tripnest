import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { Trip } from '../types/travel';
import { 
  Luggage, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Hotel, 
  Navigation,
  Compass,
  FileText
} from 'lucide-react';
import { ItineraryBuilder } from '../components/itinerary/ItineraryBuilder';
import { TripModal } from '../components/itinerary/TripModal';

export const MyTripsPage: React.FC = () => {
  const { 
    trips, 
    activeTripId, 
    setActiveTripId, 
    deleteTrip, 
    currentUser, 
    openAuthModal,
    setActiveTab 
  } = useTravel();

  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'saved'>('all');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);

  const filteredTrips = trips.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (scopeFilter === 'international' && !t.isInternational) return false;
    if (scopeFilter === 'domestic' && t.isInternational) return false;
    return true;
  });

  const intlCount = trips.filter(t => t.isInternational).length;
  const domesticCount = trips.filter(t => !t.isInternational).length;

  const selectedTrip = trips.find(t => t.id === activeTripId) || (trips.length > 0 ? trips[0] : null);

  const handleEdit = (trip: Trip) => {
    setTripToEdit(trip);
    setIsTripModalOpen(true);
  };

  const handleDelete = (tripId: string) => {
    if (confirm('Are you sure you want to remove this trip from your dashboard?')) {
      deleteTrip(tripId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header & New Trip Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Trip Management Dashboard
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 font-display mt-1">
            My Trips & Day-by-Day Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Keep track of upcoming getaways, synchronize booked transport with verified stays, and fine-tune your scheduled activities.
          </p>
        </div>

        <button
          onClick={() => {
            setTripToEdit(null);
            setIsTripModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm shadow-emerald-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Trip
        </button>
      </div>

      {/* Trip Status & Region Scope Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit text-xs">
          {(['all', 'upcoming', 'completed', 'saved'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-colors ${
                filterStatus === status
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'all' ? 'All Status' : status} ({
                status === 'all' 
                  ? trips.length 
                  : trips.filter(t => t.status === status).length
              })
            </button>
          ))}
        </div>

        {/* Domestic / International Scope Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit text-xs">
          <button
            onClick={() => setScopeFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              scopeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Destinations ({trips.length})
          </button>
          <button
            onClick={() => setScopeFilter('international')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              scopeFilter === 'international'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🌐 International</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${scopeFilter === 'international' ? 'bg-blue-500' : 'bg-slate-200'}`}>
              {intlCount}
            </span>
          </button>
          <button
            onClick={() => setScopeFilter('domestic')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              scopeFilter === 'domestic'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇮🇳 Domestic</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${scopeFilter === 'domestic' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
              {domesticCount}
            </span>
          </button>
        </div>
      </div>

      {/* Trips Cards Overview Grid */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Luggage className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 font-display">
            No trips found in this category
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Plan a journey using the trip search, or manually create your custom itinerary.
          </p>
          <button
            onClick={() => {
              setTripToEdit(null);
              setIsTripModalOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
          >
            Create a Trip Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => {
            const isSelected = selectedTrip?.id === trip.id;

            return (
              <div
                key={trip.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Trip Cover Image if available */}
                {trip.coverImage && (
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={trip.coverImage} 
                      alt={trip.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {trip.isInternational ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                          <span>🌐 International</span>
                          {trip.destinationCountry && <span>• {trip.destinationCountry}</span>}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/90 text-white backdrop-blur-xs shadow-xs">
                          🇮🇳 Domestic
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <span className="text-xs font-bold drop-shadow-sm line-clamp-1">
                        {trip.startLocation} → {trip.destination}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      trip.status === 'upcoming' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      trip.status === 'completed' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {trip.status}
                    </span>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display leading-snug">
                    {trip.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{trip.startDate} to {trip.endDate}</span>
                  </p>

                  {/* Attached Transit & Stay Summaries */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Navigation className="w-3 h-3" /> Transit:
                      </span>
                      <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[150px]">
                        {trip.selectedTransit ? trip.selectedTransit.provider : 'Not selected'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Hotel className="w-3 h-3" /> Stay:
                      </span>
                      <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[150px]">
                        {trip.selectedStay ? trip.selectedStay.name : 'Not selected'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Compass className="w-3 h-3" /> Scheduled:
                      </span>
                      <span className="font-mono text-emerald-700 font-bold text-[11px]">
                        {trip.itinerary.length} items
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(trip)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Trip Settings"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveTripId(trip.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <span>{isSelected ? 'Viewing Timeline' : 'View Itinerary'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SELECTED TRIP TIMELINE ITINERARY BUILDER */}
      {selectedTrip && (
        <section className="pt-4 border-t border-slate-200">
          <ItineraryBuilder trip={selectedTrip} />
        </section>
      )}

      {/* Create / Edit Trip Modal */}
      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => {
          setIsTripModalOpen(false);
          setTripToEdit(null);
        }}
        tripToEdit={tripToEdit}
      />

    </div>
  );
};
