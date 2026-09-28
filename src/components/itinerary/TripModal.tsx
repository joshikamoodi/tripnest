import React, { useState, useEffect } from 'react';
import { Trip } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { X, Calendar, MapPin, Users, Luggage, Check, AlertCircle } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../../data/mockData';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripToEdit?: Trip | null;
}

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  tripToEdit
}) => {
  const { createTrip, updateTrip } = useTravel();

  const [title, setTitle] = useState('');
  const [startLocation, setStartLocation] = useState('Bengaluru');
  const [destination, setDestination] = useState('Kerala');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-20');
  const [travelers, setTravelers] = useState(2);
  const [status, setStatus] = useState<Trip['status']>('upcoming');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (tripToEdit) {
      setTitle(tripToEdit.title);
      setStartLocation(tripToEdit.startLocation);
      setDestination(tripToEdit.destination);
      setStartDate(tripToEdit.startDate);
      setEndDate(tripToEdit.endDate);
      setTravelers(tripToEdit.travelers);
      setStatus(tripToEdit.status);
      setNotes(tripToEdit.notes || '');
    } else {
      setTitle('Journey to Kerala');
      setStartLocation('Bengaluru');
      setDestination('Kerala');
      setStartDate('2026-10-15');
      setEndDate('2026-10-20');
      setTravelers(2);
      setStatus('upcoming');
      setNotes('');
    }
  }, [tripToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a trip title.');
      return;
    }
    if (!destination.trim()) {
      setError('Please select a destination.');
      return;
    }

    if (tripToEdit) {
      updateTrip(tripToEdit.id, {
        title: title.trim(),
        startLocation: startLocation.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        travelers,
        status,
        notes: notes.trim()
      });
    } else {
      const matchedDest = POPULAR_DESTINATIONS.find(d => 
        d.name.toLowerCase() === destination.toLowerCase()
      );

      createTrip({
        title: title.trim(),
        startLocation: startLocation.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        travelers,
        status,
        notes: notes.trim(),
        coverImage: matchedDest?.image,
        itinerary: [
          {
            id: `it-${Date.now()}`,
            day: 1,
            time: '10:00 AM',
            title: `Arrive in ${destination}`,
            category: 'travel',
            duration: '1.5 hours',
            notes: 'Check luggage and head to accommodation'
          }
        ]
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-1 font-display">
          {tripToEdit ? 'Edit Trip Details' : 'Create New Trip'}
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Organize transportation, hotel reservations, and custom daily stops.
        </p>

        {error && (
          <div className="p-2.5 mb-4 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trip Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kerala Backwaters & Munnar Hills"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Starting Location
              </label>
              <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Hyderabad"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destination *
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kerala, Jaipur, Goa"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Departure Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Return Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Number of Travelers
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trip Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="saved">Saved Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trip Notes / Packing Checklist
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Pack sunscreen, binoculars, download offline maps"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
            >
              {tripToEdit ? 'Save Changes' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
