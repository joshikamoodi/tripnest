import React, { useState, useMemo } from 'react';
import { Review } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { 
  Star, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Filter, 
  ThumbsUp, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { MOCK_STAYS, MOCK_ATTRACTIONS } from '../../data/mockData';

export const ReviewsManager: React.FC = () => {
  const { 
    reviews, 
    addReview, 
    updateReview, 
    deleteReview, 
    currentUser, 
    openAuthModal, 
    showNotification 
  } = useTravel();

  // Filters
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'stay' | 'attraction' | 'general'>('all');

  // New review form modal
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [newEntityType, setNewEntityType] = useState<'stay' | 'attraction' | 'general'>('stay');
  const [newEntityId, setNewEntityId] = useState(MOCK_STAYS[0].id);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [newTravelTip, setNewTravelTip] = useState('');
  const [formError, setFormError] = useState('');

  // Editing state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState('');
  const [editTip, setEditTip] = useState('');

  // Statistics calculation
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { avg: 5.0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / total).toFixed(1));

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[rounded] += 1;
    });

    return { avg, total, distribution };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesRating = selectedRatingFilter === 'all' || r.rating === selectedRatingFilter;
      const matchesType = selectedTypeFilter === 'all' || r.entityType === selectedTypeFilter;
      return matchesRating && matchesType;
    });
  }, [reviews, selectedRatingFilter, selectedTypeFilter]);

  const handleOpenWriteModal = () => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    setFormError('');
    setIsWriteReviewOpen(true);
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) {
      setFormError('Please enter your review text.');
      return;
    }

    let entityName = 'TripNest Experience';
    if (newEntityType === 'stay') {
      const found = MOCK_STAYS.find(s => s.id === newEntityId);
      if (found) entityName = found.name;
    } else if (newEntityType === 'attraction') {
      const found = MOCK_ATTRACTIONS.find(a => a.id === newEntityId);
      if (found) entityName = found.name;
    }

    addReview({
      entityId: newEntityId,
      entityType: newEntityType,
      entityName,
      rating: newRating,
      reviewText: newReviewText.trim(),
      travelTip: newTravelTip.trim() || undefined
    });

    setIsWriteReviewOpen(false);
    setNewReviewText('');
    setNewTravelTip('');
  };

  const startEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditText(review.reviewText);
    setEditTip(review.travelTip || '');
  };

  const saveEdit = (id: string) => {
    if (!editText.trim()) {
      showNotification('Review text cannot be empty.');
      return;
    }
    updateReview(id, {
      rating: editRating,
      reviewText: editText.trim(),
      travelTip: editTip.trim() || undefined
    });
    setEditingReviewId(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Stats Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Average Rating Score */}
          <div className="text-center lg:text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Community Satisfaction
            </span>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-5xl font-extrabold text-slate-900 font-display">
                {stats.avg}
              </span>
              <div>
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.round(stats.avg) ? 'fill-amber-400' : 'text-slate-200'}`} 
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Based on {stats.total} verified reviews
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Real opinions from authenticated travelers visiting heritage sites, coastal escapes, and boutique stays.
            </p>
          </div>

          {/* Star Distribution Bars */}
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = stats.distribution[stars as 1 | 2 | 3 | 4 | 5] || 0;
              const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-6 text-slate-600 font-bold flex items-center gap-0.5">
                    {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] text-slate-400 font-mono">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action to Write Review */}
          <div className="text-center lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Have you traveled recently?
            </h4>
            <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto lg:ml-auto">
              Help fellow travelers by sharing your honest reviews and local tips.
            </p>
            <button
              onClick={handleOpenWriteModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              Write a Review
            </button>
          </div>

        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Filter Reviews:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            {(['all', 'stay', 'attraction', 'general'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedTypeFilter(type)}
                className={`px-3 py-1 rounded-md capitalize font-medium transition-colors ${
                  selectedTypeFilter === type 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'all' ? 'All Types' : `${type}s`}
              </button>
            ))}
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            {(['all', 5, 4, 3] as const).map(rate => (
              <button
                key={String(rate)}
                onClick={() => setSelectedRatingFilter(rate as any)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  selectedRatingFilter === rate 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {rate === 'all' ? 'All Stars' : `${rate}★`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No reviews match the selected filter.</p>
            <button
              onClick={() => { setSelectedRatingFilter('all'); setSelectedTypeFilter('all'); }}
              className="mt-3 text-xs font-bold text-emerald-700 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredReviews.map(review => {
            const isAuthor = currentUser && (review.userId === currentUser.id || review.userEmail === currentUser.email);
            const isEditing = editingReviewId === review.id;

            return (
              <div 
                key={review.id} 
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 transition-all hover:border-slate-300 shadow-xs"
              >
                {/* Header: User avatar, name, rating, date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {review.userName}
                        </h4>
                        {isAuthor && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Reviewed: <span className="font-semibold text-slate-700">{review.entityName}</span> ({review.entityType})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{review.date}</span>

                    {/* Author edit/delete controls */}
                    {isAuthor && (
                      <div className="flex items-center gap-1 ml-2 border-l border-slate-200 pl-2">
                        <button
                          onClick={() => startEdit(review)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Edit Review"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Body */}
                {isEditing ? (
                  <div className="pt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Edit Rating:
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            className="p-1"
                          >
                            <Star className={`w-5 h-5 ${star <= editRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Edit Review Text:
                      </label>
                      <textarea
                        rows={3}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Edit Traveler Tip:
                      </label>
                      <input
                        type="text"
                        value={editTip}
                        onChange={(e) => setEditTip(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingReviewId(null)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(review.id)}
                        className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 space-y-2">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {review.reviewText}
                    </p>

                    {review.travelTip && (
                      <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold">Traveler Tip: </strong>
                          <span>{review.travelTip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Write Review Modal */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsWriteReviewOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1 font-display">
              Write a Travel Review
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Share details about your stay, attraction visit, or general trip experience.
            </p>

            {formError && (
              <div className="p-2.5 mb-4 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    What are you reviewing?
                  </label>
                  <select
                    value={newEntityType}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      setNewEntityType(t);
                      if (t === 'stay') setNewEntityId(MOCK_STAYS[0].id);
                      if (t === 'attraction') setNewEntityId(MOCK_ATTRACTIONS[0].id);
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="stay">Hotel / Resort Stay</option>
                    <option value="attraction">Tourist Attraction</option>
                    <option value="general">General Trip Experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Place / Stay
                  </label>
                  {newEntityType === 'stay' ? (
                    <select
                      value={newEntityId}
                      onChange={(e) => setNewEntityId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {MOCK_STAYS.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  ) : newEntityType === 'attraction' ? (
                    <select
                      value={newEntityId}
                      onChange={(e) => setNewEntityId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {MOCK_ATTRACTIONS.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value="TripNest Journey"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                    />
                  )}
                </div>
              </div>

              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Overall Rating *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {newRating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Share details about the cleanliness, views, service, accessibility, or food..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Traveler Tip (Optional)
                </label>
                <input
                  type="text"
                  value={newTravelTip}
                  onChange={(e) => setNewTravelTip(e.target.value)}
                  placeholder="e.g. Best to visit before 10 AM, ask for high floor rooms"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWriteReviewOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
