import React, { useState, useMemo } from 'react';
import { useTravel } from '../context/TravelContext';
import { MOCK_STAYS, POPULAR_DESTINATIONS } from '../data/mockData';
import { Stay, StayType } from '../types/travel';
import { 
  Hotel, 
  Search, 
  Filter, 
  Star, 
  SlidersHorizontal, 
  MapPin, 
  Check, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { StayCard } from '../components/stays/StayCard';
import { StayDetailsModal } from '../components/stays/StayDetailsModal';

export const StaysPage: React.FC = () => {
  const { selectedStay, setSelectedStay } = useTravel();

  // Filters
  const [scopeFilter, setScopeFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | StayType>('all');
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');

  const allFacilities = ['Pool', 'Wi-Fi', 'Breakfast', 'Spa', 'Beach Access', 'Air Conditioning'];

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility) 
        : [...prev, facility]
    );
  };

  const handleResetFilters = () => {
    setScopeFilter('all');
    setDestinationFilter('all');
    setTypeFilter('all');
    setMaxPrice(50000);
    setMinRating(0);
    setSelectedFacilities([]);
    setSearchQuery('');
    setSortOrder('recommended');
  };

  // Filtered & sorted stays
  const filteredStays = useMemo(() => {
    let result = MOCK_STAYS.filter(stay => {
      // Scope filter (international / domestic)
      if (scopeFilter === 'international' && !stay.isInternational) {
        return false;
      }
      if (scopeFilter === 'domestic' && stay.isInternational) {
        return false;
      }
      // Destination
      if (destinationFilter !== 'all' && stay.destinationId !== destinationFilter) {
        return false;
      }
      // Type
      if (typeFilter !== 'all' && stay.type !== typeFilter) {
        return false;
      }
      // Max Price
      if (stay.pricePerNight > maxPrice) {
        return false;
      }
      // Rating
      if (stay.rating < minRating) {
        return false;
      }
      // Facilities
      if (selectedFacilities.length > 0) {
        const matchesAll = selectedFacilities.every(facility => 
          stay.facilities.some(f => f.toLowerCase().includes(facility.toLowerCase()))
        );
        if (!matchesAll) return false;
      }
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = stay.name.toLowerCase().includes(q);
        const matchesDesc = stay.shortDescription.toLowerCase().includes(q);
        const matchesLoc = stay.destinationName.toLowerCase().includes(q);
        const matchesCountry = (stay.country || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesLoc && !matchesCountry) return false;
      }

      return true;
    });

    // Sort
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortOrder === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [scopeFilter, destinationFilter, typeFilter, maxPrice, minRating, selectedFacilities, searchQuery, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Accommodations & Verified Stays
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 font-display mt-1">
          Discover Places to Stay
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          From tranquil backwater Ayurvedic resorts and royal Jaipur havelis to lively Indiranagar co-working hostels and coastal beach cottages.
        </p>
      </div>

      {/* Main Grid: Sidebar Filters + Stays Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Filters Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Filter Stays
              </h3>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-slate-400 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search by Name / Keyword */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Search Property
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Lagoon, Haussmann, Chalet..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Scope Selector: Domestic vs International */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Region / Scope
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'domestic', label: '🇮🇳 India' },
                { id: 'international', label: '🌐 Global' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setScopeFilter(item.id as any)}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-colors text-center truncate ${
                    scopeFilter === item.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Destination City
            </label>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
            >
              <option value="all">All Destinations</option>
              {POPULAR_DESTINATIONS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.flag ? `${d.flag} ` : ''}{d.name} ({d.isInternational ? d.country : d.state})
                </option>
              ))}
            </select>
          </div>

          {/* Accommodation Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Property Type
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'hotel', label: 'Hotels' },
                { id: 'resort', label: 'Resorts' },
                { id: 'hostel', label: 'Hostels' },
                { id: 'guesthouse', label: 'Guest Houses' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setTypeFilter(item.id as any)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors text-left truncate ${
                    typeFilter === item.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Max Price / Night</span>
              <span className="font-mono text-emerald-700">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={800}
              max={60000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>₹800</span>
              <span>₹60,000+</span>
            </div>
          </div>

          {/* Guest Rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Minimum Rating
            </label>
            <div className="flex items-center gap-1">
              {[0, 4, 4.5, 4.8].map(r => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors border ${
                    minRating === r
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r === 0 ? 'Any' : `${r}+★`}
                </button>
              ))}
            </div>
          </div>

          {/* Facilities Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Key Facilities
            </label>
            <div className="space-y-1.5">
              {allFacilities.map(f => {
                const checked = selectedFacilities.includes(f);
                return (
                  <label key={f} className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFacility(f)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span>{f}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* Stays Grid Section */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Results Summary Bar & Sort Order */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Showing {filteredStays.length} Stays
              </p>
              <p className="text-[11px] text-slate-400">
                Taxes included · Transparent verified amenities
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white font-medium"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Stay Cards Grid */}
          {filteredStays.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Hotel className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 font-display">
                No accommodations match your filters
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try widening your price range, clearing facility checkboxes, or picking all destinations.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStays.map(stay => (
                <StayCard
                  key={stay.id}
                  stay={stay}
                  onViewDetails={() => setSelectedStay(stay)}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Stay Details Modal */}
      <StayDetailsModal
        stay={selectedStay}
        onClose={() => setSelectedStay(null)}
      />

    </div>
  );
};
