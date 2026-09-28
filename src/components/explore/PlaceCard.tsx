import React from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Ticket, 
  Heart, 
  Plus, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Attraction } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface PlaceCardProps {
  attraction: Attraction;
  onViewDetails: () => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ attraction, onViewDetails }) => {
  const { savedPlaceIds, toggleSavePlace, addAttractionToTrip } = useTravel();
  const isSaved = savedPlaceIds.includes(attraction.id);

  const getCategoryLabel = () => {
    switch (attraction.category) {
      case 'must-visit': return 'Must Visit';
      case 'historical': return 'Historical';
      case 'nature': return 'Nature & Scenic';
      case 'adventure': return 'Adventure';
      case 'food': return 'Food & Culinary';
      case 'entertainment': return 'Entertainment';
      case 'shopping': return 'Shopping';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col group">
      
      {/* Visual Asset with Category & Save */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={attraction.images[0]}
          alt={attraction.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-800 shadow-sm flex items-center gap-1">
          {attraction.isInternational && <span className="text-blue-600">🌐</span>}
          <span>{getCategoryLabel()}</span>
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSavePlace(attraction.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
            isSaved 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save attraction'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* Bottom Destination & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-semibold drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{attraction.destinationName}{attraction.country ? `, ${attraction.country}` : ''}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-xs font-bold text-amber-300">
            <Star className="w-3 h-3 fill-amber-300" />
            <span>{attraction.rating}</span>
            <span className="text-slate-300 font-normal text-[10px]">({attraction.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={onViewDetails}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer leading-snug"
          >
            {attraction.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {attraction.shortDescription}
          </p>

          {/* Quick Metrics (Duration, Timings, Entry Fee) */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Duration
              </span>
              <span className="font-semibold text-slate-800 text-[11px] font-mono">
                {attraction.approximateDuration}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Ticket className="w-3.5 h-3.5 text-slate-400" />
                Entry Fee
              </span>
              <span className="font-semibold text-emerald-700 text-[11px] truncate max-w-[170px] text-right">
                {attraction.entryFee}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Hours
              </span>
              <span className="text-slate-700 text-[11px] truncate max-w-[170px] text-right">
                {attraction.openingHours}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={onViewDetails}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            View Details
          </button>

          <button
            onClick={() => addAttractionToTrip(attraction)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            title="Add to Itinerary"
          >
            <Plus className="w-3.5 h-3.5" />
            Add to Trip
          </button>
        </div>

      </div>
    </div>
  );
};
