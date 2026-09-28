import React from 'react';
import { TransitOption } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { 
  X, 
  Plane, 
  Train, 
  Bus, 
  Car, 
  Clock, 
  Luggage, 
  Leaf, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  MapPin,
  Calendar
} from 'lucide-react';

interface TransitModalProps {
  transit: TransitOption | null;
  onClose: () => void;
}

export const TransitModal: React.FC<TransitModalProps> = ({ transit, onClose }) => {
  const { selectTransitForTrip, searchParams } = useTravel();

  if (!transit) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            {transit.type === 'flight' && <Plane className="w-6 h-6" />}
            {transit.type === 'train' && <Train className="w-6 h-6" />}
            {transit.type === 'bus' && <Bus className="w-6 h-6" />}
            {transit.type === 'car' && <Car className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {transit.type} Option
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {transit.provider}
            </h3>
          </div>
        </div>

        {/* Schedule & Route */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {searchParams.startDate || 'Scheduled Date'}
            </span>
            <span className="font-mono text-emerald-700 font-semibold">
              {transit.duration} Total
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-slate-900 font-mono">{transit.departureTime}</p>
              <p className="text-xs font-semibold text-slate-700">{transit.from}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Platform / Gate Check</p>
            </div>

            <div className="flex-1 flex flex-col items-center pt-2">
              <div className="w-full border-t border-dashed border-slate-300 relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-1 left-1/2 -translate-x-1/2" />
              </div>
              <span className="text-[10px] text-slate-500 mt-2">
                {transit.stops === 0 ? 'Direct Non-Stop' : `${transit.stops} Intermediate Layover`}
              </span>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-slate-900 font-mono">{transit.arrivalTime}</p>
              <p className="text-xs font-semibold text-slate-700">{transit.to}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Destination Hub</p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Amenities & Included Services
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {transit.amenities.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Luggage & Carbon policy */}
        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-slate-700 space-y-1.5 mb-6">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-slate-900">
              <Luggage className="w-4 h-4 text-emerald-600" />
              Baggage Policy
            </span>
            <span className="font-semibold text-emerald-800">{transit.luggageAllowance}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-slate-900">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Estimated Carbon Emission
            </span>
            <span className="font-semibold text-emerald-800">{transit.co2Kg} kg CO2e</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div>
            <span className="text-2xl font-bold text-slate-900">
              ₹{transit.price.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 block">Total per passenger</span>
          </div>

          <button
            onClick={() => {
              selectTransitForTrip(transit);
              onClose();
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm shadow-emerald-600/20"
          >
            Select for My Trip
          </button>
        </div>
      </div>
    </div>
  );
};
