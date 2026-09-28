import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Calendar, 
  Heart, 
  Luggage, 
  Star, 
  Edit3, 
  Check, 
  X, 
  Compass, 
  Hotel,
  ArrowRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { POPULAR_DESTINATIONS, MOCK_STAYS, MOCK_ATTRACTIONS } from '../../data/mockData';

export const UserProfileView: React.FC = () => {
  const { 
    currentUser, 
    updateProfile, 
    logout, 
    openAuthModal, 
    savedStayIds, 
    savedPlaceIds, 
    trips, 
    reviews, 
    setSelectedStay, 
    setSelectedAttraction, 
    setActiveTripId,
    setActiveTab 
  } = useTravel();

  const [activeSubTab, setActiveSubTab] = useState<'trips' | 'stays' | 'places' | 'reviews'>('trips');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editStyle, setEditStyle] = useState(currentUser?.travelStyle || 'Scenic & Cultural Discovery');

  if (!currentUser) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto">
        <UserIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 font-display">
          Sign In to View Your Profile
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Access your personalized itineraries, bookmarked stays, and travel tips across all devices.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-sm shadow-emerald-600/20"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const savedStaysList = MOCK_STAYS.filter(s => savedStayIds.includes(s.id));
  const savedPlacesList = MOCK_ATTRACTIONS.filter(a => savedPlaceIds.includes(a.id));
  const userReviewsList = reviews.filter(r => r.userId === currentUser.id || r.userEmail === currentUser.email);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim() || currentUser.name,
      bio: editBio.trim() || currentUser.bio,
      travelStyle: editStyle.trim()
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-md shadow-xs">
                Active
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                {currentUser.name}
              </h2>
              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.email}
              </p>
              <p className="text-xs text-slate-600 max-w-md pt-1 leading-relaxed">
                {currentUser.bio}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 text-xs">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  ✨ {currentUser.travelStyle}
                </span>
                <span className="text-slate-400 text-[11px]">
                  Member since {currentUser.memberSince}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditName(currentUser.name);
                setEditBio(currentUser.bio);
                setEditStyle(currentUser.travelStyle);
                setIsEditing(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profile
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>

        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-2xl font-bold text-slate-900 font-display block">
              {trips.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">My Trips</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-2xl font-bold text-slate-900 font-display block">
              {savedStayIds.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Saved Stays</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-2xl font-bold text-slate-900 font-display block">
              {savedPlaceIds.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Saved Places</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-2xl font-bold text-slate-900 font-display block">
              {userReviewsList.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">My Reviews</span>
          </div>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('trips')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeSubTab === 'trips'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Luggage className="w-3.5 h-3.5" />
          My Trips ({trips.length})
        </button>

        <button
          onClick={() => setActiveSubTab('stays')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeSubTab === 'stays'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Hotel className="w-3.5 h-3.5" />
          Saved Stays ({savedStaysList.length})
        </button>

        <button
          onClick={() => setActiveSubTab('places')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeSubTab === 'places'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Saved Attractions ({savedPlacesList.length})
        </button>

        <button
          onClick={() => setActiveSubTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeSubTab === 'reviews'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          My Reviews ({userReviewsList.length})
        </button>
      </div>

      {/* Tab Content Panes */}
      <div>
        {/* TRIPS PANE */}
        {activeSubTab === 'trips' && (
          <div className="space-y-4">
            {trips.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <Luggage className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No trips planned yet.</p>
                <button
                  onClick={() => setActiveTab('plan')}
                  className="mt-3 text-xs font-bold text-emerald-700 hover:underline"
                >
                  Plan Your First Trip
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trips.map(trip => (
                  <div key={trip.id} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          trip.status === 'upcoming' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          trip.status === 'completed' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {trip.status}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 font-display">
                        {trip.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {trip.startLocation} → <strong className="text-slate-800">{trip.destination}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {trip.startDate} to {trip.endDate}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span>{trip.itinerary.length} scheduled stops</span>
                        {trip.selectedTransit && (
                          <span className="text-slate-500 truncate max-w-[150px]">
                            via {trip.selectedTransit.type}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => {
                          setActiveTripId(trip.id);
                          setActiveTab('trips');
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        Open Itinerary
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SAVED STAYS PANE */}
        {activeSubTab === 'stays' && (
          <div className="space-y-4">
            {savedStaysList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <Hotel className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No saved accommodations yet.</p>
                <button
                  onClick={() => setActiveTab('stays')}
                  className="mt-3 text-xs font-bold text-emerald-700 hover:underline"
                >
                  Browse Stays
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedStaysList.map(stay => (
                  <div key={stay.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-all p-3 flex flex-col justify-between">
                    <div>
                      <img src={stay.images[0]} alt={stay.name} className="w-full h-36 rounded-xl object-cover mb-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {stay.type} in {stay.destinationName}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                        {stay.name}
                      </h4>
                      <p className="text-xs font-bold text-emerald-700 mt-1">
                        ₹{stay.pricePerNight.toLocaleString()} / night
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStay(stay);
                        setActiveTab('stays');
                      }}
                      className="mt-3 w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                    >
                      View Property
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SAVED PLACES PANE */}
        {activeSubTab === 'places' && (
          <div className="space-y-4">
            {savedPlacesList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No saved attractions yet.</p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="mt-3 text-xs font-bold text-emerald-700 hover:underline"
                >
                  Explore Attractions
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPlacesList.map(attr => (
                  <div key={attr.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-all p-3 flex flex-col justify-between">
                    <div>
                      <img src={attr.images[0]} alt={attr.name} className="w-full h-36 rounded-xl object-cover mb-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {attr.category} · {attr.destinationName}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                        {attr.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {attr.entryFee}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAttraction(attr);
                        setActiveTab('explore');
                      }}
                      className="mt-3 w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEWS PANE */}
        {activeSubTab === 'reviews' && (
          <div className="space-y-4">
            {userReviewsList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <Star className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">You haven't written any reviews yet.</p>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="mt-3 text-xs font-bold text-emerald-700 hover:underline"
                >
                  Write Your First Review
                </button>
              </div>
            ) : (
              userReviewsList.map(r => (
                <div key={r.id} className="p-4 rounded-xl bg-white border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">{r.entityName}</span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{r.reviewText}</p>
                  {r.travelTip && (
                    <p className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg">
                      💡 <strong>Tip:</strong> {r.travelTip}
                    </p>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono mt-2 block">{r.date}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1 font-display">
              Edit Profile
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Update your public display name, travel bio, and explorer preference.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Traveler Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Travel Style
                </label>
                <input
                  type="text"
                  value={editStyle}
                  onChange={(e) => setEditStyle(e.target.value)}
                  placeholder="e.g. Scenic & Experiential Luxury, Solo Backpacker"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
