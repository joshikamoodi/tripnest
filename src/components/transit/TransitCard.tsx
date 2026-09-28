import React, { useState } from 'react';
import { 
  Plane, 
  Train, 
  Bus, 
  Car, 
  Clock, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  Luggage,
  Leaf
} from 'lucide-react';
import { TransitOption } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface TransitCardProps {
  transit: TransitOption;
  isSelected?: boolean;
  onSelect?: () => void;
  onViewDetails?: () => void;
}

export const TransitCard: React.FC<TransitCardProps> = ({
  transit,
  isSelected,
  onSelect,
  onViewDetails
}) => {
  const { selectTransitForTrip } = useTravel();

  const getIcon = () => {
    switch (transit.type) {
      case 'flight':
        return <Plane className="w-5 h-5 text-sky-600" />;
      case 'train':
        return <Train className="w-5 h-5 text-emerald-600" />;
      case 'bus':
        return <Bus className="w-5 h-5 text-amber-600" />;
      case 'car':
        return <Car className="w-5 h-5 text-purple-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (transit.type) {
      case 'flight': return 'Airlines';
      case 'train': return 'Express Railway';
      case 'bus': return 'Intercity Coach';
      case 'car': return 'Private Chauffeur';
    }
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 bg-white ${
      isSelected 
        ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md' 
        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Provider & Type */}
        <div className="flex items-start gap-3.5 min-w-[220px]">
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {getTypeLabel()}
              </span>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{transit.rating}</span>
              </div>
            </div>
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {transit.provider}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {transit.routeInfo}
            </p>
          </div>
        </div>

        {/* Center: Departure, Duration, Arrival */}
        <div className="flex-1 flex items-center justify-between max-w-sm px-2 sm:px-6 py-2 bg-slate-50/80 rounded-xl border border-slate-100">
          {/* Departure */}
          <div className="text-left">
            <span className="text-sm sm:text-base font-bold text-slate-900 block font-mono">
              {transit.departureTime}
            </span>
            <span className="text-[11px] text-slate-500 block truncate max-w-[100px]">
              {transit.from}
            </span>
          </div>

          {/* Timeline & Stops */}
          <div className="flex flex-col items-center px-3">
            <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mb-1 font-mono">
              <Clock className="w-3 h-3 text-slate-400" />
              {transit.duration}
            </span>
            <div className="w-20 sm:w-28 h-0.5 bg-slate-300 relative flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 absolute left-0" />
              {transit.stops > 0 ? (
                <div className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded-full">
                  {transit.stops} stop{transit.stops > 1 ? 's' : ''}
                </div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 absolute right-0" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1">
              {transit.stops === 0 ? 'Non-Stop' : `${transit.stops} layover`}
            </span>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <span className="text-sm sm:text-base font-bold text-slate-900 block font-mono">
              {transit.arrivalTime}
            </span>
            <span className="text-[11px] text-slate-500 block truncate max-w-[100px]">
              {transit.to}
            </span>
          </div>
        </div>

        {/* Right: Price & Buttons */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 min-w-[150px] border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <div className="text-left sm:text-right">
            <span className="text-lg sm:text-xl font-bold text-slate-900 block">
              ₹{transit.price.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Approx. per traveler
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onViewDetails && (
              <button
                onClick={onViewDetails}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Details
              </button>
            )}

            <button
              onClick={() => {
                if (onSelect) onSelect();
                selectTransitForTrip(transit);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shadow-xs ${
                isSelected 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isSelected ? 'Selected' : 'Choose Transit'}
            </button>
          </div>
        </div>
      </div>

      {/* Perks, Luggage & Carbon Footprint Badges */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-[11px]">
            <Luggage className="w-3.5 h-3.5 text-slate-400" />
            {transit.luggageAllowance}
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            {transit.co2Kg} kg CO2e
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-[11px] text-slate-500">
            {transit.availableSeats} seats left
          </span>
        </div>

        <div className="flex items-center gap-2">
          {transit.amenities.slice(0, 2).map((amenity, i) => (
            <span key={i} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
