import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Trip, 
  Stay, 
  Attraction, 
  Review, 
  User, 
  ItineraryItem, 
  TransitOption 
} from '../types/travel';
import { 
  INITIAL_TRIPS, 
  INITIAL_REVIEWS, 
  MOCK_STAYS, 
  MOCK_ATTRACTIONS,
  MOCK_TRANSIT_OPTIONS
} from '../data/mockData';

export type AppTab = 'home' | 'plan' | 'explore' | 'stays' | 'trips' | 'reviews' | 'profile';

export interface TripSearchParams {
  startLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
}

interface TravelContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  searchParams: TripSearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<TripSearchParams>>;
  handlePlanTripSubmit: (params?: Partial<TripSearchParams>) => void;
  
  // Trips
  trips: Trip[];
  activeTripId: string | null;
  setActiveTripId: (id: string | null) => void;
  currentActiveTrip: Trip | undefined;
  createTrip: (tripData: Omit<Trip, 'id' | 'createdAt'>) => Trip;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  
  // Itinerary
  addItineraryItem: (tripId: string, item: Omit<ItineraryItem, 'id'>) => void;
  updateItineraryItem: (tripId: string, itemId: string, updates: Partial<ItineraryItem>) => void;
  removeItineraryItem: (tripId: string, itemId: string) => void;
  moveItineraryItem: (tripId: string, itemId: string, direction: 'up' | 'down') => void;
  
  // Bookmarks / Saved
  savedStayIds: string[];
  toggleSaveStay: (stayId: string) => void;
  savedPlaceIds: string[];
  toggleSavePlace: (placeId: string) => void;
  
  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'userId' | 'userName' | 'userAvatar'>) => void;
  updateReview: (id: string, updates: Partial<Pick<Review, 'rating' | 'reviewText' | 'travelTip'>>) => void;
  deleteReview: (id: string) => void;
  
  // User & Auth
  currentUser: User | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string, remember?: boolean) => { success: boolean; message?: string };
  register: (name: string, email: string, password: string) => { success: boolean; message?: string };
  loginWithGoogle: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  
  // Modals & Drawers
  selectedStay: Stay | null;
  setSelectedStay: (stay: Stay | null) => void;
  selectedAttraction: Attraction | null;
  setSelectedAttraction: (attraction: Attraction | null) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  
  // Quick Actions
  addStayToTrip: (stay: Stay, targetTripId?: string) => void;
  addAttractionToTrip: (attraction: Attraction, targetTripId?: string) => void;
  selectTransitForTrip: (transit: TransitOption, targetTripId?: string) => void;
  notification: string | null;
  showNotification: (msg: string) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TRIPS: 'tripnest_trips_v2',
  REVIEWS: 'tripnest_reviews_v1',
  SAVED_STAYS: 'tripnest_saved_stays_v2',
  SAVED_PLACES: 'tripnest_saved_places_v2',
  USER: 'tripnest_user_v1',
  SEARCH: 'tripnest_search_params_v1'
};

const DEFAULT_USER: User = {
  id: 'u-user-default',
  name: 'Aarav Patel',
  email: 'aarav.patel@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  bio: 'Passionate travel photographer & culture explorer. Always ready for high-altitude passes, Paris boulevards, or secluded tropical retreats.',
  savedDestinations: ['kerala', 'jaipur', 'paris', 'tokyo'],
  savedStays: ['stay-resort-1', 'stay-paris-1', 'stay-swiss-1'],
  savedAttractions: ['attr-alleppey-houseboat', 'attr-paris-eiffel', 'attr-tokyo-shibuya'],
  travelStyle: 'Global Explorer & Scenic Luxury',
  memberSince: 'January 2025'
};

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Search parameters
  const [searchParams, setSearchParams] = useState<TripSearchParams>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SEARCH);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // Fallback
    }
    return {
      startLocation: 'Bengaluru',
      destination: 'Kerala',
      startDate: '2026-10-15',
      endDate: '2026-10-20',
      travelers: 2
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH, JSON.stringify(searchParams));
    } catch (e) {}
  }, [searchParams]);

  // Trips state
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRIPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_TRIPS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    } catch (e) {}
  }, [trips]);

  const [activeTripId, setActiveTripId] = useState<string | null>(() => {
    return trips.length > 0 ? trips[0].id : null;
  });

  const currentActiveTrip = trips.find(t => t.id === activeTripId) || trips[0];

  // Saved items
  const [savedStayIds, setSavedStayIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_STAYS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['stay-resort-1', 'stay-paris-1', 'stay-swiss-1'];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_STAYS, JSON.stringify(savedStayIds));
    } catch (e) {}
  }, [savedStayIds]);

  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_PLACES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['attr-alleppey-houseboat', 'attr-palolem-beach'];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_PLACES, JSON.stringify(savedPlaceIds));
    } catch (e) {}
  }, [savedPlaceIds]);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_REVIEWS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {}
  }, [reviews]);

  // User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_USER;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {}
  }, [currentUser]);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Handlers
  const handlePlanTripSubmit = (params?: Partial<TripSearchParams>) => {
    if (params) {
      setSearchParams(prev => ({ ...prev, ...params }));
    }
    setActiveTab('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createTrip = (tripData: Omit<Trip, 'id' | 'createdAt'>): Trip => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTrips(prev => [newTrip, ...prev]);
    setActiveTripId(newTrip.id);
    showNotification(`Trip "${newTrip.title}" created successfully!`);
    return newTrip;
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showNotification('Trip details updated!');
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
    if (activeTripId === id) {
      const remaining = trips.filter(t => t.id !== id);
      setActiveTripId(remaining.length > 0 ? remaining[0].id : null);
    }
    showNotification('Trip removed from your dashboard.');
  };

  // Itinerary items
  const addItineraryItem = (tripId: string, item: Omit<ItineraryItem, 'id'>) => {
    const newItem: ItineraryItem = {
      ...item,
      id: `it-${Date.now()}`
    };
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        itinerary: [...t.itinerary, newItem]
      };
    }));
    showNotification(`Added "${item.title}" to Day ${item.day} itinerary.`);
  };

  const updateItineraryItem = (tripId: string, itemId: string, updates: Partial<ItineraryItem>) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        itinerary: t.itinerary.map(item => item.id === itemId ? { ...item, ...updates } : item)
      };
    }));
    showNotification('Itinerary activity updated.');
  };

  const removeItineraryItem = (tripId: string, itemId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        itinerary: t.itinerary.filter(item => item.id !== itemId)
      };
    }));
    showNotification('Activity removed from itinerary.');
  };

  const moveItineraryItem = (tripId: string, itemId: string, direction: 'up' | 'down') => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const index = t.itinerary.findIndex(i => i.id === itemId);
      if (index === -1) return t;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= t.itinerary.length) return t;
      
      const newItinerary = [...t.itinerary];
      const [moved] = newItinerary.splice(index, 1);
      newItinerary.splice(targetIndex, 0, moved);
      return {
        ...t,
        itinerary: newItinerary
      };
    }));
  };

  // Toggle Saves
  const toggleSaveStay = (stayId: string) => {
    setSavedStayIds(prev => {
      const exists = prev.includes(stayId);
      const updated = exists ? prev.filter(id => id !== stayId) : [...prev, stayId];
      showNotification(exists ? 'Removed stay from saved list.' : 'Stay saved to your wishlist!');
      return updated;
    });
  };

  const toggleSavePlace = (placeId: string) => {
    setSavedPlaceIds(prev => {
      const exists = prev.includes(placeId);
      const updated = exists ? prev.filter(id => id !== placeId) : [...prev, placeId];
      showNotification(exists ? 'Removed place from saved list.' : 'Place saved to your bookmarks!');
      return updated;
    });
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'userId' | 'userName' | 'userAvatar'>) => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      userEmail: currentUser.email,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    setReviews(prev => [newRev, ...prev]);
    showNotification('Thank you! Your review has been published.');
  };

  const updateReview = (id: string, updates: Partial<Pick<Review, 'rating' | 'reviewText' | 'travelTip'>>) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    showNotification('Review updated successfully.');
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    showNotification('Review deleted.');
  };

  // Auth
  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email: string, password: string, _remember: boolean = true) => {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }
    if (password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }
    const user: User = {
      id: `u-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      bio: 'Adventurer exploring incredible destinations with TripNest.',
      savedDestinations: ['kerala', 'goa'],
      savedStays: ['stay-resort-1'],
      savedAttractions: ['attr-alleppey-houseboat'],
      travelStyle: 'Cultural Explorer',
      memberSince: 'September 2026'
    };
    setCurrentUser(user);
    closeAuthModal();
    showNotification(`Welcome back, ${user.name}!`);
    return { success: true };
  };

  const register = (name: string, email: string, password: string) => {
    if (!name.trim()) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!email.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }
    const user: User = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      bio: 'New traveler on TripNest ready to see the world!',
      savedDestinations: [],
      savedStays: [],
      savedAttractions: [],
      travelStyle: 'Scenic & Experiential',
      memberSince: 'September 2026'
    };
    setCurrentUser(user);
    closeAuthModal();
    showNotification(`Account created! Welcome to TripNest, ${user.name}!`);
    setActiveTab('trips');
    return { success: true };
  };

  const loginWithGoogle = () => {
    const user: User = {
      id: 'u-google-verified',
      name: 'Priya Sundaram',
      email: 'priya.sundaram@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      bio: 'Travel enthusiast, foodie, and landscape photographer.',
      savedDestinations: ['kerala', 'jaipur', 'goa', 'bengaluru'],
      savedStays: ['stay-resort-1', 'stay-palace-1'],
      savedAttractions: ['attr-alleppey-houseboat', 'attr-amber-fort'],
      travelStyle: 'Eco-Luxury & Heritage',
      memberSince: 'March 2025'
    };
    setCurrentUser(user);
    closeAuthModal();
    showNotification(`Signed in with Google as ${user.name}!`);
  };

  const logout = () => {
    setCurrentUser(null);
    showNotification('Logged out successfully.');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    showNotification('Profile updated successfully.');
  };

  // Quick action connections
  const addStayToTrip = (stay: Stay, targetTripId?: string) => {
    const targetId = targetTripId || activeTripId || (trips.length > 0 ? trips[0].id : null);
    if (!targetId) {
      const created = createTrip({
        title: `Trip to ${stay.destinationName}`,
        startLocation: searchParams.startLocation || 'Bengaluru',
        destination: stay.destinationName,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        travelers: searchParams.travelers,
        selectedStay: stay,
        itinerary: [
          {
            id: `it-${Date.now()}`,
            day: 1,
            time: '02:00 PM',
            title: `Check-in at ${stay.name}`,
            category: 'checkin',
            duration: '1 hour',
            notes: `Check-in from ${stay.checkInTime}. Address: ${stay.address}`,
            location: stay.address
          }
        ],
        status: 'upcoming',
        coverImage: stay.images[0]
      });
      setActiveTripId(created.id);
      showNotification(`Stay "${stay.name}" attached to new trip!`);
      return;
    }

    setTrips(prev => prev.map(t => {
      if (t.id !== targetId) return t;
      const hasCheckin = t.itinerary.some(i => i.category === 'checkin');
      const newItinerary = hasCheckin ? t.itinerary : [
        {
          id: `it-${Date.now()}`,
          day: 1,
          time: '02:00 PM',
          title: `Check-in at ${stay.name}`,
          category: 'checkin' as const,
          duration: '1 hour',
          notes: `Check-in from ${stay.checkInTime}. Address: ${stay.address}`,
          location: stay.address
        },
        ...t.itinerary
      ];
      return {
        ...t,
        selectedStay: stay,
        itinerary: newItinerary
      };
    }));
    showNotification(`Stay "${stay.name}" linked to your trip!`);
  };

  const addAttractionToTrip = (attraction: Attraction, targetTripId?: string) => {
    const targetId = targetTripId || activeTripId || (trips.length > 0 ? trips[0].id : null);
    if (!targetId) {
      const created = createTrip({
        title: `Trip to ${attraction.destinationName}`,
        startLocation: searchParams.startLocation || 'Bengaluru',
        destination: attraction.destinationName,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        travelers: searchParams.travelers,
        itinerary: [
          {
            id: `it-${Date.now()}`,
            day: 1,
            time: '11:00 AM',
            title: attraction.name,
            category: 'attraction',
            duration: attraction.approximateDuration,
            notes: `Entry Fee: ${attraction.entryFee}. Hours: ${attraction.openingHours}`,
            location: attraction.address
          }
        ],
        status: 'upcoming',
        coverImage: attraction.images[0]
      });
      setActiveTripId(created.id);
      showNotification(`"${attraction.name}" added to new trip!`);
      return;
    }

    // Determine appropriate day based on existing itinerary
    const targetTrip = trips.find(t => t.id === targetId);
    const day = targetTrip && targetTrip.itinerary.length > 0 
      ? Math.min(Math.floor(targetTrip.itinerary.length / 3) + 1, 5)
      : 1;

    addItineraryItem(targetId, {
      day,
      time: '02:00 PM',
      title: attraction.name,
      category: 'attraction',
      duration: attraction.approximateDuration,
      notes: `Entry Fee: ${attraction.entryFee}. Timings: ${attraction.openingHours}`,
      location: attraction.address
    });
  };

  const selectTransitForTrip = (transit: TransitOption, targetTripId?: string) => {
    const targetId = targetTripId || activeTripId || (trips.length > 0 ? trips[0].id : null);
    if (!targetId) {
      const created = createTrip({
        title: `Journey to ${searchParams.destination}`,
        startLocation: searchParams.startLocation,
        destination: searchParams.destination,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        travelers: searchParams.travelers,
        selectedTransit: transit,
        itinerary: [
          {
            id: `it-${Date.now()}`,
            day: 1,
            time: transit.departureTime,
            title: `Depart via ${transit.provider}`,
            category: 'travel',
            duration: transit.duration,
            notes: `From: ${transit.from} -> To: ${transit.to}. ${transit.routeInfo}`,
            location: transit.from
          }
        ],
        status: 'upcoming'
      });
      setActiveTripId(created.id);
      showNotification(`Selected ${transit.provider} for your trip!`);
      return;
    }

    setTrips(prev => prev.map(t => {
      if (t.id !== targetId) return t;
      return {
        ...t,
        selectedTransit: transit
      };
    }));
    showNotification(`Transit updated to ${transit.provider}!`);
  };

  return (
    <TravelContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchParams,
        setSearchParams,
        handlePlanTripSubmit,
        trips,
        activeTripId,
        setActiveTripId,
        currentActiveTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        addItineraryItem,
        updateItineraryItem,
        removeItineraryItem,
        moveItineraryItem,
        savedStayIds,
        toggleSaveStay,
        savedPlaceIds,
        toggleSavePlace,
        reviews,
        addReview,
        updateReview,
        deleteReview,
        currentUser,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        selectedStay,
        setSelectedStay,
        selectedAttraction,
        setSelectedAttraction,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        addStayToTrip,
        addAttractionToTrip,
        selectTransitForTrip,
        notification,
        showNotification
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
