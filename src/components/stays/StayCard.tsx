import React from 'react';
import { 
  Star, 
  MapPin, 
  Heart, 
  Wifi, 
  Coffee, 
  Waves, 
  Sparkles, 
  Check, 
  Plus,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Stay } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface StayCardProps {
  stay: Stay;
  onViewDetails: () => void;
}

export const StayCard: React.FC<StayCardProps> = ({ stay, onViewDetails }) => {
  const { savedStayIds, toggleSaveStay, addStayToTrip } = useTravel();
  const isSaved = savedStayIds.includes(stay.id);

  const getFacilityIcon = (facility: string) => {
    const f = facility.toLowerCase();
    if (f.includes('pool')) return <Waves className="w-3.5 h-3.5" />;
    if (f.includes('wi-fi') || f.includes('wifi')) return <Wifi className="w-3.5 h-3.5" />;
    if (f.includes('breakfast')) return <Coffee className="w-3.5 h-3.5" />;
    return <Sparkles className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col group">
      
      {/* Image Container with Save Bookmark & Type */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={stay.images[0]}
          alt={stay.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Accommodation Type Pill */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-800 shadow-sm flex items-center gap-1">
          {stay.isInternational && <span className="text-blue-600">🌐</span>}
          <span>{stay.type}</span>
        </div>

        {/* Save Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveStay(stay.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
            isSaved 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* Bottom Image Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-semibold drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{stay.destinationName}{stay.country ? `, ${stay.country}` : ''}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-xs font-bold text-amber-300">
            <Star className="w-3 h-3 fill-amber-300" />
            <span>{stay.rating}</span>
            <span className="text-slate-300 font-normal text-[10px]">({stay.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={onViewDetails}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer leading-snug"
          >
            {stay.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {stay.shortDescription}
          </p>

          {/* Distance from Key Attractions */}
          {stay.distanceToAttractions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
              <span className="text-slate-400">Nearby:</span>
              {stay.distanceToAttractions.slice(0, 2).map((dist, idx) => (
                <span key={idx} className="font-medium text-slate-700">
                  {dist.name} ({dist.distance})
                </span>
              ))}
            </div>
          )}

          {/* Facilities Preview */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {stay.facilities.slice(0, 3).map((facility, i) => (
              <span 
                key={i} 
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10px] font-medium text-slate-600"
              >
                {getFacilityIcon(facility)}
                {facility}
              </span>
            ))}
            {stay.facilities.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center pl-1">
                +{stay.facilities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900">
                ₹{stay.pricePerNight.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 font-normal">/ night</span>
            </div>
            <span className="text-[10px] text-emerald-700 block">Taxes & fees included</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onViewDetails}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Details
            </button>

            <button
              onClick={() => addStayToTrip(stay)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              title="Add this stay to your trip itinerary"
            >
              <Plus className="w-3.5 h-3.5" />
              Add to Trip
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
