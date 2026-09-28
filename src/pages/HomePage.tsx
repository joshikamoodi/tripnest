import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  POPULAR_DESTINATIONS, 
  MOCK_STAYS, 
  MOCK_ATTRACTIONS, 
  heroImage 
} from '../data/mockData';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  Compass, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles,
  Plane,
  Train,
  Hotel,
  Clock,
  ChevronRight
} from 'lucide-react';
import { StayCard } from '../components/stays/StayCard';
import { PlaceCard } from '../components/explore/PlaceCard';

export const HomePage: React.FC = () => {
  const { 
    handlePlanTripSubmit, 
    setSelectedStay, 
    setSelectedAttraction, 
    setActiveTab,
    reviews
  } = useTravel();

  // Search box state
  const [startLocation, setStartLocation] = useState('Bengaluru');
  const [destination, setDestination] = useState('Kerala');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-20');
  const [travelers, setTravelers] = useState(2);
  const [validationError, setValidationError] = useState('');
  const [destScope, setDestScope] = useState<'all' | 'international' | 'domestic'>('all');

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setValidationError('Please select or enter your destination.');
      return;
    }
    setValidationError('');
    handlePlanTripSubmit({
      startLocation: startLocation.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      travelers
    });
  };

  const displayedDestinations = React.useMemo(() => {
    if (destScope === 'international') {
      return POPULAR_DESTINATIONS.filter(d => d.isInternational);
    }
    if (destScope === 'domestic') {
      return POPULAR_DESTINATIONS.filter(d => !d.isInternational);
    }
    return POPULAR_DESTINATIONS.slice(0, 9);
  }, [destScope]);

  const featuredStays = React.useMemo(() => {
    return [
      MOCK_STAYS.find(s => s.id === 'stay-paris-1'),
      MOCK_STAYS.find(s => s.id === 'stay-resort-1'),
      MOCK_STAYS.find(s => s.id === 'stay-swiss-1'),
      MOCK_STAYS.find(s => s.id === 'stay-tokyo-1'),
      MOCK_STAYS.find(s => s.id === 'stay-palace-1'),
      MOCK_STAYS.find(s => s.id === 'stay-bali-1'),
    ].filter(Boolean) as typeof MOCK_STAYS;
  }, []);

  const mustVisitPlaces = React.useMemo(() => {
    return [
      MOCK_ATTRACTIONS.find(a => a.id === 'attr-paris-eiffel'),
      MOCK_ATTRACTIONS.find(a => a.id === 'attr-alleppey-houseboat'),
      MOCK_ATTRACTIONS.find(a => a.id === 'attr-tokyo-shibuya'),
      MOCK_ATTRACTIONS.find(a => a.id === 'attr-amber-fort'),
      MOCK_ATTRACTIONS.find(a => a.id === 'attr-swiss-matterhorn'),
      MOCK_ATTRACTIONS.find(a => a.id === 'attr-bali-ulundanu'),
    ].filter(Boolean) as typeof MOCK_ATTRACTIONS;
  }, []);

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center rounded-3xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl border border-slate-200">
        
        {/* Background Visual Asset with Contrast Scrim */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Scenic mountain valley and azure lake"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white py-12">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Uncharted Journeys & Seamless Routes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white text-balance max-w-4xl mx-auto leading-tight drop-shadow-md">
            Plan Your Journey, Explore the World.
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto mt-4 font-normal text-balance drop-shadow-sm leading-relaxed">
            Find the best routes, stays, attractions and experiences — all in one place.
          </p>

          {/* LARGE TRIP SEARCH BOX */}
          <div className="mt-8 sm:mt-10 max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/40 text-slate-800 text-left">
            
            {validationError && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
                {validationError}
              </div>
            )}

            <form onSubmit={onSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
              
              {/* Starting Location */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Starting Point
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Delhi"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Destination
                </label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium bg-slate-50/50 appearance-none"
                  >
                    {POPULAR_DESTINATIONS.map(d => (
                      <option key={d.id} value={d.name}>
                        {d.flag ? `${d.flag} ` : ''}{d.name} ({d.isInternational ? d.country : d.state})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Travel Date */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Travel Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-9 pr-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Return Date & Travelers */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Return & Travelers
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-2/3 px-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono bg-slate-50/50"
                  />
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-1/3 px-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono bg-slate-50/50"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map(n => (
                      <option key={n} value={n}>{n}p</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Plan My Trip Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  <span>Plan My Trip</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </form>

            {/* Quick Destination Shortcut Pills */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="text-[11px] font-semibold text-slate-400">Popular:</span>
              {['Kerala', 'Paris', 'Jaipur', 'Tokyo', 'Goa', 'Bali', 'Swiss Alps (Zermatt)', 'Dubai'].map(dest => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => setDestination(dest)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    destination === dest 
                      ? 'bg-emerald-100 text-emerald-800 font-bold' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* POPULAR & TRENDING DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Curated Escapes
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
              Popular Destinations
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-lg">
              Explore royal Rajput palaces, Parisian boulevards, Tokyo neon alleys, Balinese water sanctuaries, and Swiss Alpine peaks.
            </p>
          </div>

          {/* Scope Filters */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs self-start sm:self-auto">
            <button
              onClick={() => setDestScope('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                destScope === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({POPULAR_DESTINATIONS.length})
            </button>
            <button
              onClick={() => setDestScope('international')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                destScope === 'international'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🌐 International</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${destScope === 'international' ? 'bg-blue-500' : 'bg-slate-200'}`}>
                {POPULAR_DESTINATIONS.filter(d => d.isInternational).length}
              </span>
            </button>
            <button
              onClick={() => setDestScope('domestic')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                destScope === 'domestic'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇮🇳 Domestic</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${destScope === 'domestic' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                {POPULAR_DESTINATIONS.filter(d => !d.isInternational).length}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDestinations.map(dest => (
            <div
              key={dest.id}
              onClick={() => handlePlanTripSubmit({ destination: dest.name })}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm flex items-center gap-1">
                  {dest.flag && <span>{dest.flag}</span>}
                  <span>{dest.isInternational ? dest.country : dest.state}</span>
                </div>

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300" />
                  <span>{dest.popularRating}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-xl font-bold font-display leading-tight drop-shadow-sm">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium drop-shadow-xs">
                    {dest.tagline}
                  </p>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {dest.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Est. Budget: <strong className="text-slate-800 font-mono">₹{dest.avgDailyBudget.toLocaleString()}/day</strong>
                  </span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Plan Trip <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECOMMENDED STAYS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Verified Hospitality
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
              Recommended Stays & Resorts
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-lg">
              From backwater luxury villas to royal heritage havelis and beachfront bohemian retreats.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('stays')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline self-start sm:self-auto"
          >
            <span>View All Accommodations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStays.map(stay => (
            <StayCard
              key={stay.id}
              stay={stay}
              onViewDetails={() => setSelectedStay(stay)}
            />
          ))}
        </div>
      </section>

      {/* MUST-VISIT ATTRACTIONS & EXPERIENCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Iconic Landmarks
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
              Must-Visit Places
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-lg">
              Handpicked cultural monuments, nature expeditions, and local culinary food walks.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline self-start sm:self-auto"
          >
            <span>View All Attractions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mustVisitPlaces.map(attr => (
            <PlaceCard
              key={attr.id}
              attraction={attr}
              onViewDetails={() => setSelectedAttraction(attr)}
            />
          ))}
        </div>
      </section>

      {/* HOW TRIPNEST WORKS (3 SIMPLE STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Effortless Planning
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1">
              How TripNest Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Transform your travel inspiration into a realistic, booked itinerary in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Step 1 */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base mb-4 font-mono">
                  01
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-display">
                  1. Enter Your Trip
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your starting point, dream destination, travel dates, and group size. TripNest instantly maps the route coordinates and logistics.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700 text-[11px] text-emerald-400 font-medium">
                Origin & Destination Matrix
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-base mb-4 font-mono">
                  02
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-display">
                  2. Plan Your Journey
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Compare multi-modal transportation options (flights, high-speed trains, luxury buses, private cabs), and select verified stays and iconic landmarks.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700 text-[11px] text-cyan-400 font-medium">
                Transit, Stay & Sightseeing
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base mb-4 font-mono">
                  03
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-display">
                  3. Explore & Enjoy
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Organize your day-by-day itinerary timeline, adjust time slots, add custom notes, print shareable itineraries, and enjoy an unforgettable adventure.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700 text-[11px] text-amber-400 font-medium">
                Timeline Itinerary Ready
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE TRIPNEST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            The TripNest Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
            Why Choose TripNest?
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Built for modern independent travelers who value transparent options, authentic recommendations, and complete schedule control.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Plane className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5">
              Multi-Modal Travel Routes
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare flights, semi-high-speed trains, express buses, and private chauffeurs side-by-side with durations and carbon footprint metrics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <Hotel className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5">
              Curated & Verified Stays
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Discover boutique resorts, heritage havelis, lively backpacker hubs, and peaceful seaside guest houses with transparent amenities.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5">
              Day-by-Day Itineraries
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Build chronological schedules with ease. Reorder stops, customize times, add private travel notes, and export shareable plans.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Star className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5">
              Authentic Community Reviews
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Honest ratings and genuine insider tips from authenticated travelers who have walked the same cobblestone paths and shores.
            </p>
          </div>
        </div>
      </section>

      {/* USER REVIEWS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Traveler Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
              Loved by Explorers Worldwide
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-lg">
              Read how fellow wanderers crafted seamless adventures using TripNest.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('reviews')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline self-start sm:self-auto"
          >
            <span>Read All Reviews</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map(rev => (
            <div key={rev.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  “{rev.reviewText}”
                </p>

                {rev.travelTip && (
                  <p className="mt-3 text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-lg leading-relaxed">
                    💡 <strong>Tip:</strong> {rev.travelTip}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2.5">
                <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rev.userName}</h4>
                  <p className="text-[10px] text-slate-400 truncate max-w-[170px]">{rev.entityName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Ready to embark on your next great story?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Start custom planning with TripNest today. Select dates, compare multi-modal transit, and build your complete itinerary in minutes.
            </p>
          </div>

          <button
            onClick={() => handlePlanTripSubmit()}
            className="px-6 py-3 bg-white hover:bg-emerald-50 text-emerald-800 font-bold rounded-xl text-xs transition-colors shadow-lg whitespace-nowrap"
          >
            Start Planning Now
          </button>
        </div>
      </section>

    </div>
  );
};
