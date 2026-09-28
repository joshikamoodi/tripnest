import React, { useState } from 'react';
import { Stay } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { 
  X, 
  Star, 
  MapPin, 
  Heart, 
  Check, 
  Phone, 
  Clock, 
  Plus, 
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  BedDouble,
  Users
} from 'lucide-react';

interface StayDetailsModalProps {
  stay: Stay | null;
  onClose: () => void;
}

export const StayDetailsModal: React.FC<StayDetailsModalProps> = ({ stay, onClose }) => {
  const { savedStayIds, toggleSaveStay, addStayToTrip, reviews } = useTravel();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!stay) return null;

  const isSaved = savedStayIds.includes(stay.id);
  const stayReviews = reviews.filter(r => r.entityId === stay.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-6 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Sticky Close & Save Bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => toggleSaveStay(stay.id)}
            className={`p-2.5 rounded-full backdrop-blur-md transition-colors shadow-md ${
              isSaved 
                ? 'bg-rose-500 text-white' 
                : 'bg-white/90 text-slate-700 hover:text-rose-500'
            }`}
            aria-label={isSaved ? 'Saved' : 'Save'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-slate-900 hover:bg-white transition-colors shadow-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Photo Gallery */}
        <div className="bg-slate-900">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <img
              src={stay.images[activeImageIndex] || stay.images[0]}
              alt={stay.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-end justify-between gap-4 text-white">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-600/90 text-white text-[11px] font-bold uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
                  {stay.isInternational && <span>🌐 International</span>}
                  <span>{stay.type}</span>
                  {stay.country && <span>• {stay.country}</span>}
                </span>
                <h2 className="text-xl sm:text-3xl font-bold font-display drop-shadow-md">
                  {stay.name}
                </h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{stay.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-base font-bold text-white">{stay.rating}</span>
                <span className="text-xs text-slate-300">({stay.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery Row */}
          {stay.images.length > 1 && (
            <div className="p-3 bg-slate-950 flex gap-2 overflow-x-auto">
              {stay.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-18 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Tabs & Details */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Overview */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
              About the Property
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {stay.fullDescription}
            </p>
          </div>

          {/* Property Logistics & Key Times */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Check-in</span>
              <span className="font-semibold text-slate-800">{stay.checkInTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Check-out</span>
              <span className="font-semibold text-slate-800">{stay.checkOutTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contact Desk</span>
              <span className="font-semibold text-slate-800 truncate block">{stay.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Verified Stay</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Quality
              </span>
            </div>
          </div>

          {/* Facilities Grid */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 font-display">
              Facilities & Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {stay.facilities.map((facility, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Distance from Major Tourist Attractions */}
          {stay.distanceToAttractions.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 font-display">
                Location & Distance to Attractions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {stay.distanceToAttractions.map((dist, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <p className="font-semibold text-slate-800">{dist.name}</p>
                    <p className="text-emerald-700 font-bold mt-1 font-mono">{dist.distance}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Room Options & Configurations */}
          {stay.rooms && stay.rooms.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 font-display">
                Available Rooms & Suites
              </h3>
              <div className="space-y-3">
                {stay.rooms.map((room) => (
                  <div 
                    key={room.id}
                    className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{room.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                          {room.bedType}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          Up to {room.maxGuests} guests
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {room.perks.map((perk, pi) => (
                          <span key={pi} className="text-[10px] bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded">
                            ✓ {perk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg font-bold text-slate-900 block">
                        ₹{room.pricePerNight.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400 block">/ night</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guest Reviews Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Traveler Reviews ({stayReviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{stay.rating} out of 5</span>
              </div>
            </div>

            {stayReviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No individual reviews logged yet. Be the first to share your experience!
              </p>
            ) : (
              <div className="space-y-3">
                {stayReviews.map(r => (
                  <div key={r.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <img src={r.userAvatar} alt={r.userName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-bold text-slate-800">{r.userName}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: r.rating }).map((_, si) => (
                          <Star key={si} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{r.reviewText}</p>
                    {r.travelTip && (
                      <p className="mt-1.5 text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded-lg">
                        💡 <strong>Traveler Tip:</strong> {r.travelTip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Booking Action Strip */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900 font-display">
                  ₹{stay.pricePerNight.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500">/ night</span>
              </div>
              <span className="text-xs text-emerald-700">Free cancellation available</span>
            </div>

            <button
              onClick={() => {
                addStayToTrip(stay);
                onClose();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              Add This Stay to My Trip
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
