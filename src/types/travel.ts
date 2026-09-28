export type TransportType = 'flight' | 'train' | 'bus' | 'car';

export type StayType = 'hotel' | 'hostel' | 'resort' | 'guesthouse';

export type AttractionCategory = 
  | 'must-visit' 
  | 'historical' 
  | 'nature' 
  | 'adventure' 
  | 'food' 
  | 'entertainment' 
  | 'shopping';

export interface Coordinates {
  lat: number;
  lng: number;
  x?: number; // relative SVG percentage (0-100)
  y?: number; // relative SVG percentage (0-100)
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  country: string;
  tagline: string;
  description: string;
  image: string;
  fallbackImage?: string;
  popularRating: number;
  coords: Coordinates;
  tags: string[];
  bestTimeToVisit: string;
  avgDailyBudget: number;
  highlights: string[];
  isInternational?: boolean;
  flag?: string;
  currency?: string;
}

export interface TransitOption {
  id: string;
  type: TransportType;
  provider: string;
  from: string;
  to: string;
  duration: string; // e.g., "1h 45m"
  durationMinutes: number;
  price: number; // approximate price in INR / USD
  stops: number; // 0 = non-stop
  departureTime: string; // e.g. "07:30 AM"
  arrivalTime: string; // e.g. "09:15 AM"
  routeInfo: string;
  amenities: string[];
  co2Kg: number;
  luggageAllowance: string;
  rating: number;
  availableSeats: number;
  isInternational?: boolean;
}

export interface StayRoom {
  id: string;
  name: string;
  bedType: string;
  pricePerNight: number;
  maxGuests: number;
  perks: string[];
}

export interface Stay {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  country?: string;
  isInternational?: boolean;
  currencySymbol?: string;
  type: StayType;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  images: string[];
  facilities: string[];
  shortDescription: string;
  fullDescription: string;
  distanceToAttractions: {
    name: string;
    distance: string;
  }[];
  rooms: StayRoom[];
  address: string;
  checkInTime: string;
  checkOutTime: string;
  phone: string;
}

export interface Attraction {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  country?: string;
  isInternational?: boolean;
  category: AttractionCategory;
  rating: number;
  reviewsCount: number;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  approximateDuration: string; // e.g., "2 - 3 hours"
  entryFee: string; // e.g., "₹50 (Free for children)" or "Free"
  openingHours: string; // e.g., "9:00 AM - 6:00 PM (Closed Mondays)"
  bestTimeToVisit: string;
  thingsToDo: string[];
  nearbyAttractions: string[];
  nearbyAccommodations: string[];
  address: string;
  tags: string[];
}

export interface Review {
  id: string;
  entityId: string; // stay ID or attraction ID
  entityType: 'stay' | 'attraction' | 'general';
  entityName: string;
  userName: string;
  userAvatar: string;
  userEmail?: string;
  rating: number; // 1 - 5
  reviewText: string;
  date: string;
  travelTip?: string;
  userId: string;
}

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  title: string;
  category: 'checkin' | 'attraction' | 'food' | 'activity' | 'travel' | 'relaxation' | 'nature';
  duration: string;
  notes?: string;
  location?: string;
  cost?: number;
}

export interface Trip {
  id: string;
  title: string;
  startLocation: string;
  destination: string;
  destinationCountry?: string;
  isInternational?: boolean;
  startDate: string;
  endDate: string;
  travelers: number;
  selectedTransit?: TransitOption;
  selectedStay?: Stay;
  itinerary: ItineraryItem[];
  status: 'upcoming' | 'completed' | 'saved';
  notes?: string;
  coverImage?: string;
  createdAt: string;
  totalBudgetEstimate?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  savedDestinations: string[];
  savedStays: string[];
  savedAttractions: string[];
  travelStyle: string;
  memberSince: string;
}
