import React, { useState, useMemo } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  MOCK_TRANSIT_OPTIONS, 
  POPULAR_DESTINATIONS 
} from '../data/mockData';
import { TransitOption, TransportType } from '../types/travel';
import { 
  Search, 
  MapPin, 
  Compass, 
  Calendar, 
  Users, 
  ArrowUpDown, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Navigation
} from 'lucide-react';
import { InteractiveRouteMap } from '../components/map/InteractiveRouteMap';
import { TransitCard } from '../components/transit/TransitCard';
import { TransitModal } from '../components/transit/TransitModal';

export const PlanTripPage: React.FC = () => {
  const { 
    searchParams, 
    setSearchParams, 
    handlePlanTripSubmit, 
    currentActiveTrip 
  } = useTravel();

  // Local inputs
  const [startLoc, setStartLoc] = useState(searchParams.startLocation || 'Bengaluru');
  const [dest, setDest] = useState(searchParams.destination || 'Kerala');
  const [departDate, setDepartDate] = useState(searchParams.startDate || '2026-10-15');
  const [returnDate, setReturnDate] = useState(searchParams.endDate || '2026-10-20');
  const [travelersCount, setTravelersCount] = useState(searchParams.travelers || 2);

  // Sorting & Filtering
  const [sortBy, setSortBy] = useState<'recommended' | 'cheapest' | 'fastest'>('recommended');
  const [transportFilter, setTransportFilter] = useState<'all' | TransportType>('all');
  const [activeMapTransport, setActiveMapTransport] = useState<TransportType>('train');

  // Modal
  const [activeTransitDetails, setActiveTransitDetails] = useState<TransitOption | null>(null);

  const handleUpdateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({
      startLocation: startLoc.trim(),
      destination: dest.trim(),
      startDate: departDate,
      endDate: returnDate,
      travelers: travelersCount
    });
  };

  // Transit options list
  const transitList: TransitOption[] = useMemo(() => {
    const destLower = (searchParams.destination || '').toLowerCase();
    const destKey = Object.keys(MOCK_TRANSIT_OPTIONS).find(k => 
      destLower.includes(k) || k.includes(destLower)
    );
    const raw = (destKey && MOCK_TRANSIT_OPTIONS[destKey]) 
      ? MOCK_TRANSIT_OPTIONS[destKey] 
      : (MOCK_TRANSIT_OPTIONS.default || []);
    
    // Filter by type
    let filtered = transportFilter === 'all' 
      ? raw 
      : raw.filter(item => item.type === transportFilter);

    // Sorting
    if (sortBy === 'cheapest') {
      return [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'fastest') {
      return [...filtered].sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else {
      // Recommended: high rating, reasonable price/duration
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }
  }, [transportFilter, sortBy, searchParams.destination]);

  const selectedTransitId = currentActiveTrip?.selectedTransit?.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Page Title & Breadcrumb */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Trip Planner & Multi-Modal Transit Engine
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 font-display mt-1">
          Plan Your Route to {searchParams.destination || 'Destination'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Compare flights, express trains, intercity luxury coaches, and private chauffeurs. Select your preferred transit to link directly to your itinerary.
        </p>
      </div>

      {/* Editable Trip Search Widget */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <form onSubmit={handleUpdateSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
          
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Starting From
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={startLoc}
                onChange={(e) => setStartLoc(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Destination
            </label>
            <div className="relative">
              <Compass className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
              <select
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium bg-white"
              >
                {POPULAR_DESTINATIONS.map(d => (
                  <option key={d.id} value={d.name}>
                    {d.flag ? `${d.flag} ` : ''}{d.name} ({d.isInternational ? d.country : d.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Departure
            </label>
            <input
              type="date"
              required
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Return & Travelers
            </label>
            <div className="flex gap-1.5">
              <input
                type="date"
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-2/3 px-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
              />
              <select
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-1/3 px-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono bg-white"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n}p</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm shadow-emerald-600/20"
            >
              Update Search
            </button>
          </div>

        </form>
      </div>

      {/* SECTION 5: INTERACTIVE ROUTE MAP */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Interactive Route Map & Highway Telemetry
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Interactive Vector Projection · Maps Platform Ready
          </span>
        </div>

        <InteractiveRouteMap
          startLocation={searchParams.startLocation}
          destination={searchParams.destination}
          selectedTransport={activeMapTransport}
          onTransportChange={(type) => {
            setActiveMapTransport(type);
            setTransportFilter(type);
          }}
        />
      </section>

      {/* SECTION 4: TRANSPORTATION OPTIONS & SORTING */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Available Transportation Options ({transitList.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              From {searchParams.startLocation} to {searchParams.destination} on {searchParams.startDate}
            </p>
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Filter by Transport Mode */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              {(['all', 'flight', 'train', 'bus', 'car'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setTransportFilter(type)}
                  className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                    transportFilter === type
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Sort by Tabs: Cheapest, Fastest, Recommended */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              {(['recommended', 'cheapest', 'fastest'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setSortBy(mode)}
                  className={`px-3 py-1 rounded-md capitalize font-semibold transition-colors ${
                    sortBy === mode
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Transit Cards List */}
        <div className="space-y-4">
          {transitList.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm font-semibold text-slate-700">No transit routes found for this filter.</p>
              <button
                onClick={() => setTransportFilter('all')}
                className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            transitList.map(item => (
              <TransitCard
                key={item.id}
                transit={item}
                isSelected={selectedTransitId === item.id}
                onSelect={() => setActiveMapTransport(item.type)}
                onViewDetails={() => setActiveTransitDetails(item)}
              />
            ))
          )}
        </div>
      </section>

      {/* Transit Details Modal */}
      <TransitModal
        transit={activeTransitDetails}
        onClose={() => setActiveTransitDetails(null)}
      />

    </div>
  );
};
