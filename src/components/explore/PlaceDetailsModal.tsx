import React, { useState } from 'react';
import { Attraction } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { 
  X, 
  Star, 
  MapPin, 
  Heart, 
  Clock, 
  Ticket, 
  Calendar, 
  Check, 
  Plus, 
  Compass, 
  Hotel,
  Sparkles,
  Info,
  ArrowRight
} from 'lucide-react';
import { MOCK_STAYS } from '../../data/mockData';

interface PlaceDetailsModalProps {
  attraction: Attraction | null;
  onClose: () => void;
}

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({ attraction, onClose }) => {
  const { savedPlaceIds, toggleSavePlace, addAttractionToTrip, setSelectedStay, setActiveTab, reviews } = useTravel();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!attraction) return null;

  const isSaved = savedPlaceIds.includes(attraction.id);
  const attractionReviews = reviews.filter(r => r.entityId === attraction.id);

  // Match nearby stays in the same destination
  const nearbyStays = MOCK_STAYS.filter(s => 
    s.destinationId === attraction.destinationId ||
    attraction.nearbyAccommodations.some(name => s.name.toLowerCase().includes(name.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-6 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => toggleSavePlace(attraction.id)}
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

        {/* Large Media Gallery Header */}
        <div className="bg-slate-900">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <img
              src={attraction.images[activeImageIdx] || attraction.images[0]}
              alt={attraction.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-end justify-between gap-4 text-white">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-600/90 text-white text-[11px] font-bold uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
                  {attraction.isInternational && <span>🌐 International</span>}
                  <span>{attraction.category}</span>
                  {attraction.country && <span>• {attraction.country}</span>}
                </span>
                <h2 className="text-xl sm:text-3xl font-bold font-display drop-shadow-md">
                  {attraction.name}
                </h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{attraction.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-base font-bold text-white">{attraction.rating}</span>
                <span className="text-xs text-slate-300">({attraction.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Thumbnails row */}
          {attraction.images.length > 1 && (
            <div className="p-3 bg-slate-950 flex gap-2 overflow-x-auto">
              {attraction.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-18 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIdx === idx ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3" /> Visit Duration
              </span>
              <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                {attraction.approximateDuration}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Ticket className="w-3 h-3" /> Entry Ticket
              </span>
              <span className="font-semibold text-emerald-700 mt-0.5 block truncate">
                {attraction.entryFee}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Opening Hours
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                {attraction.openingHours}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Best Time
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                {attraction.bestTimeToVisit}
              </span>
            </div>
          </div>

          {/* Detailed Narrative Description */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
              About This Experience
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {attraction.fullDescription}
            </p>
          </div>

          {/* Things to Do List */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 font-display">
              Key Highlights & Things to Do
            </h3>
            <div className="space-y-2.5">
              {attraction.thingsToDo.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                    {i + 1}
                  </div>
                  <span className="leading-relaxed font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Attractions */}
          {attraction.nearbyAttractions.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 font-display">
                Nearby Attractions in {attraction.destinationName}
              </h3>
              <div className="flex flex-wrap gap-2">
                {attraction.nearbyAttractions.map((spot, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                    {spot}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Accommodations Nearby */}
          {nearbyStays.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 font-display">
                Recommended Stays Nearby
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbyStays.slice(0, 2).map((st) => (
                  <div 
                    key={st.id}
                    onClick={() => {
                      setSelectedStay(st);
                      setActiveTab('stays');
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 cursor-pointer transition-all group"
                  >
                    <img src={st.images[0]} alt={st.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                        {st.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{st.type.toUpperCase()}</p>
                      <p className="text-xs font-bold text-emerald-700 mt-0.5">
                        ₹{st.pricePerNight.toLocaleString()} <span className="font-normal text-[10px] text-slate-400">/ night</span>
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Reviews */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Community Reviews ({attractionReviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{attraction.rating} / 5</span>
              </div>
            </div>

            {attractionReviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No reviews yet for this attraction. Experience it and share your tips!
              </p>
            ) : (
              <div className="space-y-3">
                {attractionReviews.map(r => (
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

          {/* Bottom Action */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Ready to explore {attraction.name}?
              </p>
              <p className="text-xs text-slate-500">
                Seamlessly add to your TripNest day-by-day itinerary.
              </p>
            </div>

            <button
              onClick={() => {
                addAttractionToTrip(attraction);
                onClose();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              Add to My Trip
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
