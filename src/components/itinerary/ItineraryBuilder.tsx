import React, { useState } from 'react';
import { Trip, ItineraryItem } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Edit3, 
  Check, 
  Compass, 
  Bed, 
  Utensils, 
  Footprints, 
  Smile, 
  Navigation,
  FileText,
  Share2,
  Printer
} from 'lucide-react';
import { AddActivityModal } from './AddActivityModal';

interface ItineraryBuilderProps {
  trip: Trip;
}

export const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ trip }) => {
  const { 
    removeItineraryItem, 
    moveItineraryItem, 
    addItineraryItem, 
    updateItineraryItem,
    showNotification
  } = useTravel();

  const [activeDay, setActiveDay] = useState(1);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editNotesText, setEditNotesText] = useState('');

  // Group items by day
  const maxDay = Math.max(
    3,
    ...trip.itinerary.map(item => item.day || 1)
  );
  const dayTabs = Array.from({ length: maxDay }, (_, i) => i + 1);

  const currentDayItems = trip.itinerary.filter(item => (item.day || 1) === activeDay);

  const getItemIcon = (category: ItineraryItem['category']) => {
    switch (category) {
      case 'checkin':
        return <Bed className="w-4 h-4 text-sky-600" />;
      case 'attraction':
        return <Compass className="w-4 h-4 text-emerald-600" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'activity':
        return <Footprints className="w-4 h-4 text-indigo-600" />;
      case 'relaxation':
        return <Smile className="w-4 h-4 text-teal-600" />;
      case 'travel':
        return <Navigation className="w-4 h-4 text-purple-600" />;
    }
  };

  const getCategoryColor = (category: ItineraryItem['category']) => {
    switch (category) {
      case 'checkin': return 'bg-sky-50 border-sky-200 text-sky-700';
      case 'attraction': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'food': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'activity': return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'relaxation': return 'bg-teal-50 border-teal-200 text-teal-700';
      case 'travel': return 'bg-purple-50 border-purple-200 text-purple-700';
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showNotification('Shareable itinerary link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Day-by-Day Timeline
          </span>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            {trip.title} ({trip.startLocation} → {trip.destination})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {trip.startDate} to {trip.endDate} · {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            title="Share Itinerary"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            Share
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print
          </button>
          <button
            onClick={() => setIsAddActivityOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Activity
          </button>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {dayTabs.map(dayNum => {
          const count = trip.itinerary.filter(i => (i.day || 1) === dayNum).length;
          const isSelected = activeDay === dayNum;
          return (
            <button
              key={dayNum}
              onClick={() => setActiveDay(dayNum)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <span>Day {dayNum}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Itinerary Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        {currentDayItems.length === 0 ? (
          <div className="text-center py-12">
            <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800 font-display">
              No activities planned for Day {activeDay} yet
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your morning breakfast, cultural sightseeing, leisure walks, or local experiences.
            </p>
            <button
              onClick={() => setIsAddActivityOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Activity
            </button>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {currentDayItems.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === currentDayItems.length - 1;
              const isEditing = editingItemId === item.id;

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot Node */}
                  <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center text-emerald-600 shadow-xs z-10">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  </div>

                  {/* Activity Card */}
                  <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {item.time}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            · {item.duration}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 pt-1">
                          {item.title}
                        </h4>

                        {item.location && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.location}</span>
                          </p>
                        )}
                      </div>

                      {/* Controls: Reorder up/down, Edit notes, Delete */}
                      <div className="flex items-center gap-1 self-end sm:self-start shrink-0">
                        <button
                          disabled={isFirst}
                          onClick={() => moveItineraryItem(trip.id, item.id, 'up')}
                          className={`p-1.5 rounded-lg border text-slate-600 transition-colors ${
                            isFirst ? 'opacity-30 cursor-not-allowed border-slate-100' : 'hover:bg-slate-100 border-slate-200'
                          }`}
                          title="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          disabled={isLast}
                          onClick={() => moveItineraryItem(trip.id, item.id, 'down')}
                          className={`p-1.5 rounded-lg border text-slate-600 transition-colors ${
                            isLast ? 'opacity-30 cursor-not-allowed border-slate-100' : 'hover:bg-slate-100 border-slate-200'
                          }`}
                          title="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (isEditing) {
                              updateItineraryItem(trip.id, item.id, { notes: editNotesText });
                              setEditingItemId(null);
                            } else {
                              setEditingItemId(item.id);
                              setEditNotesText(item.notes || '');
                            }
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                          title={isEditing ? 'Save Notes' : 'Edit Notes'}
                        >
                          {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Edit3 className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => removeItineraryItem(trip.id, item.id)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Notes Area */}
                    {isEditing ? (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Edit Activity Notes:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editNotesText}
                            onChange={(e) => setEditNotesText(e.target.value)}
                            placeholder="Add tips, booking IDs, tickets..."
                            className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <button
                            onClick={() => {
                              updateItineraryItem(trip.id, item.id, { notes: editNotesText });
                              setEditingItemId(null);
                            }}
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : item.notes ? (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg flex items-start gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item.notes}</span>
                      </div>
                    ) : null}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        day={activeDay}
        onAdd={(newItem) => addItineraryItem(trip.id, newItem)}
      />
    </div>
  );
};
