import React, { useState, useMemo } from 'react';
import { useTravel } from '../context/TravelContext';
import { MOCK_ATTRACTIONS, POPULAR_DESTINATIONS } from '../data/mockData';
import { Attraction, AttractionCategory } from '../types/travel';
import { 
  Compass, 
  Search, 
  MapPin, 
  Filter, 
  Sparkles, 
  Landmark, 
  Palmtree, 
  Footprints, 
  Utensils, 
  Film, 
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { PlaceCard } from '../components/explore/PlaceCard';
import { PlaceDetailsModal } from '../components/explore/PlaceDetailsModal';

export const ExplorePage: React.FC = () => {
  const { selectedAttraction, setSelectedAttraction } = useTravel();

  const [scopeFilter, setScopeFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const [activeCategory, setActiveCategory] = useState<'all' | AttractionCategory>('all');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'rating' | 'reviews'>('rating');

  const categories: { id: 'all' | AttractionCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Categories', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'must-visit', label: 'Must-Visit Places', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'historical', label: 'Historical Places', icon: <Landmark className="w-3.5 h-3.5" /> },
    { id: 'nature', label: 'Nature & Scenic', icon: <Palmtree className="w-3.5 h-3.5" /> },
    { id: 'adventure', label: 'Adventure', icon: <Footprints className="w-3.5 h-3.5" /> },
    { id: 'food', label: 'Food & Local Experiences', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'entertainment', label: 'Entertainment', icon: <Film className="w-3.5 h-3.5" /> },
    { id: 'shopping', label: 'Shopping & Bazaars', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
  ];

  const filteredAttractions = useMemo(() => {
    let result = MOCK_ATTRACTIONS.filter(attr => {
      // Scope filter (international / domestic)
      if (scopeFilter === 'international' && !attr.isInternational) {
        return false;
      }
      if (scopeFilter === 'domestic' && attr.isInternational) {
        return false;
      }
      // Category
      if (activeCategory !== 'all' && attr.category !== activeCategory) {
        return false;
      }
      // Destination
      if (selectedDestination !== 'all' && attr.destinationId !== selectedDestination) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = attr.name.toLowerCase().includes(q);
        const matchesDesc = attr.shortDescription.toLowerCase().includes(q);
        const matchesLoc = attr.destinationName.toLowerCase().includes(q);
        const matchesCountry = (attr.country || '').toLowerCase().includes(q);
        const matchesTag = attr.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesLoc && !matchesCountry && !matchesTag) return false;
      }
      return true;
    });

    if (sortOrder === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [scopeFilter, activeCategory, selectedDestination, searchQuery, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Curated Sights & Experiences
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 font-display mt-1">
          Explore Must-Visit Places
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Discover world-renowned icons and hidden gems — from Paris's Eiffel Tower, Tokyo's Shibuya crossing, and Swiss Alpine summits to Bali water temples, Kerala backwaters, and Jaipur palaces.
        </p>
      </div>

      {/* Scope Selector: All vs Domestic vs International */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit text-xs">
        <button
          onClick={() => setScopeFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
            scopeFilter === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Sights ({MOCK_ATTRACTIONS.length})
        </button>
        <button
          onClick={() => setScopeFilter('international')}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
            scopeFilter === 'international'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🌐 International</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${scopeFilter === 'international' ? 'bg-blue-500' : 'bg-slate-200'}`}>
            {MOCK_ATTRACTIONS.filter(a => a.isInternational).length}
          </span>
        </button>
        <button
          onClick={() => setScopeFilter('domestic')}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
            scopeFilter === 'domestic'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🇮🇳 Domestic</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${scopeFilter === 'domestic' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
            {MOCK_ATTRACTIONS.filter(a => !a.isInternational).length}
          </span>
        </button>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Destination Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search attractions, Eiffel, temples, sushi, fondue..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="w-56">
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
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
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none bg-white font-medium text-slate-700"
          >
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
          </select>
        </div>
      </div>

      {/* Attractions Grid */}
      {filteredAttractions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 font-display">
            No attractions found in this category
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try switching to "All Categories" or searching a different destination city.
          </p>
          <button
            onClick={() => { setActiveCategory('all'); setSelectedDestination('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map(attr => (
            <PlaceCard
              key={attr.id}
              attraction={attr}
              onViewDetails={() => setSelectedAttraction(attr)}
            />
          ))}
        </div>
      )}

      {/* Place Details Modal */}
      <PlaceDetailsModal
        attraction={selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
      />

    </div>
  );
};
