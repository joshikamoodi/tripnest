import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { 
  Compass, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  Phone 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, handlePlanTripSubmit } = useTravel();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const destinations = ['Kerala', 'Jaipur', 'Goa', 'Hyderabad', 'Bengaluru', 'Visakhapatnam', 'Mumbai', 'Delhi'];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand info & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                TripNest
              </span>
            </div>
            
            <p className="text-sm text-emerald-400 font-medium">
              “Plan Your Journey, Explore the World.”
            </p>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              TripNest is your all-in-one travel planning ecosystem. Discover verified transportation routes, compare scenic stays, explore must-visit cultural wonders, build synchronized day-by-day itineraries, and read authentic traveler reviews.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setActiveTab('plan'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Plan Trip
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Explore Destinations
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('stays'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Find Accommodations
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('trips'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Itinerary Builder
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('reviews'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Traveler Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Top Destinations</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {destinations.map(d => (
                <button
                  key={d}
                  onClick={() => handlePlanTripSubmit({ destination: d })}
                  className="text-left text-slate-400 hover:text-emerald-400 transition-colors truncate"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Legal, Support & Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Stay Inspired</h4>
            <p className="text-xs text-slate-400">
              Get monthly curated itineraries, seasonal flight deals, and hidden gems.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-9"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {error && <p className="text-[11px] text-red-400">{error}</p>}
              {subscribed && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed! Welcome aboard.</span>
                </div>
              )}
            </form>

            <div className="pt-2 flex flex-col gap-1 text-[11px] text-slate-400">
              <span>About Us · Help Center</span>
              <span>Privacy Policy · Terms & Conditions</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TripNest Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Designed for passionate travelers worldwide</span>
            <span>·</span>
            <span>Ready for Google Maps & Global Travel APIs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
