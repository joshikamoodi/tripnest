import React, { useState, useMemo } from 'react';
import { useTravel } from '../../context/TravelContext';
import { 
  POPULAR_DESTINATIONS, 
  MOCK_STAYS, 
  MOCK_ATTRACTIONS 
} from '../../data/mockData';
import { 
  Search, 
  X, 
  MapPin, 
  Hotel, 
  Compass, 
  ArrowRight, 
  Star,
  Tag
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isGlobalSearchOpen, 
    setIsGlobalSearchOpen, 
    handlePlanTripSubmit, 
    setSelectedStay, 
    setSelectedAttraction,
    setActiveTab 
  } = useTravel();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'destinations' | 'stays' | 'attractions'>('all');

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        destinations: POPULAR_DESTINATIONS.slice(0, 3),
        stays: MOCK_STAYS.slice(0, 3),
        attractions: MOCK_ATTRACTIONS.slice(0, 3)
      };
    }

    const destinations = POPULAR_DESTINATIONS.filter(d => 
      d.name.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q)) ||
      d.tagline.toLowerCase().includes(q)
    );

    const stays = MOCK_STAYS.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.destinationName.toLowerCase().includes(q) ||
      (s.country && s.country.toLowerCase().includes(q)) ||
      s.type.toLowerCase().includes(q) ||
      s.facilities.some(f => f.toLowerCase().includes(q))
    );

    const attractions = MOCK_ATTRACTIONS.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.destinationName.toLowerCase().includes(q) ||
      (a.country && a.country.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );

    return { destinations, stays, attractions };
  }, [query]);

  if (!isGlobalSearchOpen) return null;

  const handleSelectDestination = (destName: string) => {
    handlePlanTripSubmit({ destination: destName });
    setIsGlobalSearchOpen(false);
  };

  const handleSelectStay = (stay: typeof MOCK_STAYS[0]) => {
    setSelectedStay(stay);
    setActiveTab('stays');
    setIsGlobalSearchOpen(false);
  };

  const handleSelectAttraction = (attr: typeof MOCK_ATTRACTIONS[0]) => {
    setSelectedAttraction(attr);
    setActiveTab('explore');
    setIsGlobalSearchOpen(false);
  };

  const totalResults = 
    (filterType === 'all' || filterType === 'destinations' ? filteredResults.destinations.length : 0) +
    (filterType === 'all' || filterType === 'stays' ? filteredResults.stays.length : 0) +
    (filterType === 'all' || filterType === 'attractions' ? filteredResults.attractions.length : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, resorts, temples, beaches, food walks..."
            className="w-full text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="text-xs px-2.5 py-1 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Filter Segment Tabs */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Filter:</span>
          {(['all', 'destinations', 'stays', 'attractions'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-md capitalize transition-colors font-medium ${
                filterType === type 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {totalResults === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">No results found for “{query}”</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for Paris, Tokyo, Bali, Swiss Alps, Kerala, Goa, Jaipur, resort, or Eiffel Tower.</p>
            </div>
          ) : (
            <>
              {/* Destinations */}
              {(filterType === 'all' || filterType === 'destinations') && filteredResults.destinations.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Destinations ({filteredResults.destinations.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredResults.destinations.map(dest => (
                      <button
                        key={dest.id}
                        onClick={() => handleSelectDestination(dest.name)}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-all group"
                      >
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                            {dest.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">{dest.tagline}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                            <span>★ {dest.popularRating}</span>
                            <span>·</span>
                            <span>{dest.state}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stays */}
              {(filterType === 'all' || filterType === 'stays') && filteredResults.stays.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Accommodations ({filteredResults.stays.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {filteredResults.stays.map(stay => (
                      <button
                        key={stay.id}
                        onClick={() => handleSelectStay(stay)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={stay.images[0]}
                            alt={stay.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                              {stay.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">
                              {stay.type.toUpperCase()} in {stay.destinationName}
                            </p>
                            <span className="text-[11px] font-semibold text-emerald-700">
                              ₹{stay.pricePerNight.toLocaleString()} / night
                            </span>
                          </div>
                        </div>
                        <div className="text-right pl-2">
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{stay.rating}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">View</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Attractions */}
              {(filterType === 'all' || filterType === 'attractions') && filteredResults.attractions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Attractions & Highlights ({filteredResults.attractions.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {filteredResults.attractions.map(attr => (
                      <button
                        key={attr.id}
                        onClick={() => handleSelectAttraction(attr)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={attr.images[0]}
                            alt={attr.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                              {attr.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">
                              {attr.category.toUpperCase()} · {attr.destinationName}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              Duration: {attr.approximateDuration}
                            </span>
                          </div>
                        </div>
                        <div className="text-right pl-2">
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{attr.rating}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Details</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
