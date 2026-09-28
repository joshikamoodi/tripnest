import React from 'react';
import { ReviewsManager } from '../components/reviews/ReviewsManager';

export const ReviewsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Verified Community Ratings & Tips
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 font-display mt-1">
          Traveler Reviews & Experiences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Browse honest reflections from travelers who visited our featured accommodations and cultural landmarks. Share your own reviews to guide upcoming journeys.
        </p>
      </div>

      <ReviewsManager />
    </div>
  );
};
