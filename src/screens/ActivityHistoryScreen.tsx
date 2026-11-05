import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  ShieldAlert,
  MapPin,
  Zap,
  Sun,
  Calendar,
  Filter,
  Search,
} from 'lucide-react';
import { ActivityLogItem, BikeSystemState } from '../types/smartbike';

interface ActivityHistoryScreenProps {
  state: BikeSystemState;
}

export const ActivityHistoryScreen: React.FC<ActivityHistoryScreenProps> = ({
  state,
}) => {
  const [periodFilter, setPeriodFilter] = useState<'All' | 'Today' | 'This Week' | 'This Month'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const filteredActivities = state.activities.filter((item) => {
    if (periodFilter !== 'All' && item.period !== periodFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (dateFilter && item.dateStr !== dateFilter) return false;
    if (
      searchQuery.trim() &&
      !`${item.title} ${item.subtitle} ${item.timestamp}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const renderCategoryIcon = (category: ActivityLogItem['category']) => {
    switch (category) {
      case 'locked':
        return (
          <div className="w-11 h-11 rounded-full bg-[#102B46] border border-[#00E676]/50 flex items-center justify-center text-[#00E676] shrink-0">
            <Lock className="w-5 h-5" />
          </div>
        );
      case 'unlocked':
        return (
          <div className="w-11 h-11 rounded-full bg-[#102B46] border border-[#00D5FF]/50 flex items-center justify-center text-[#00D5FF] shrink-0">
            <Unlock className="w-5 h-5" />
          </div>
        );
      case 'auth_success':
        return (
          <div className="w-11 h-11 rounded-full bg-[#102B46] border border-[#00E676]/50 flex items-center justify-center text-[#00E676] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case 'auth_fail':
        return (
          <div className="w-11 h-11 rounded-full bg-[#102B46] border border-[#FF3B4F]/50 flex items-center justify-center text-[#FF3B4F] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        );
      case 'gps':
        return (
          <div className="w-11 h-11 rounded-full bg-[#102B46] border border-[#00D5FF]/50 flex items-center justify-center text-[#00D5FF] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
        );
      case 'solar':
        return (
          <div className="w-11 h-11 rounded-full bg-[#102B46] border border-[#FFB020]/50 flex items-center justify-center text-[#FFB020] shrink-0">
            <Sun className="w-5 h-5" />
          </div>
        );
      case 'dynamo':
        return (
          <div className="w-11 h-11 rounded-full bg-[#102B46] border border-[#00E676]/50 flex items-center justify-center text-[#00E676] shrink-0">
            <Zap className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#071D35] border border-[#00D5FF]/30 rounded-2xl p-5">
        <div>
          <span className="text-xs font-semibold text-[#00D5FF]">
            Chronological Audit Trail of Lock, Biometric, GPS & Charging Events
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            Ride & Activity History
          </h1>
        </div>
        <span className="text-xs font-mono-tabular text-slate-300">
          Showing {filteredActivities.length} of {state.activities.length} Events
        </span>
      </div>

      {/* Period Filter Tabs (Matches Screen 9 of Reference Image 3: Today | This Week | This Month) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['All', 'Today', 'This Week', 'This Month'] as const).map((period) => {
            const isActive = periodFilter === period;
            return (
              <button
                key={period}
                type="button"
                onClick={() => setPeriodFilter(period)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#087BFF] to-[#00B4FF] text-white shadow-[0_0_18px_rgba(8,123,255,0.45)]'
                    : 'bg-[#102B46]/80 hover:bg-[#102B46] border border-[#00D5FF]/25 text-slate-300 hover:text-white'
                }`}
              >
                {period}
              </button>
            );
          })}
        </div>

        {/* Date, Category & Search Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="pl-9 pr-3 py-2 rounded-xl bg-[#071D35] border border-[#00D5FF]/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00D5FF]"
            />
          </div>

          <div className="relative flex items-center">
            <Filter className="w-3.5 h-3.5 text-[#00D5FF] absolute left-3 pointer-events-none" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl bg-[#071D35] border border-[#00D5FF]/30 text-xs text-white focus:outline-none"
            >
              <option value="all">All Event Types</option>
              <option value="locked">Bicycle Locked</option>
              <option value="unlocked">Bicycle Unlocked</option>
              <option value="auth_success">Authentication Successful</option>
              <option value="auth_fail">Unauthorized Access Attempt</option>
              <option value="gps">GPS Location Updated</option>
              <option value="solar">Solar Charging</option>
              <option value="dynamo">Dynamo Charging</option>
            </select>
          </div>

          <div className="relative flex items-center">
            <Calendar className="w-3.5 h-3.5 text-[#00D5FF] absolute left-3 pointer-events-none" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl bg-[#071D35] border border-[#00D5FF]/30 text-xs font-mono-tabular text-white focus:outline-none"
            />
          </div>

          {(categoryFilter !== 'all' || dateFilter || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('all');
                setDateFilter('');
                setSearchQuery('');
              }}
              className="text-xs text-[#00D5FF] hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Timeline Container (Matches Screen 9 of Reference Image 3) */}
      <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-6 sm:p-8">
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-base font-bold text-white">
              No Activity Records Match Your Filter
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Try clearing the date or category filter to view all recorded system events.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-5">
            {/* Vertical Glowing Timeline Spine */}
            <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-[2px] bg-gradient-to-b from-[#00D5FF] via-[#00E676] to-[#087BFF]/30" />

            {filteredActivities.map((item) => (
              <div key={item.id} className="relative flex items-center gap-4">
                {/* Timeline Dot on Spine */}
                <span className=" -left-[19px] sm:-left-[23px] absolute w-3 h-3 rounded-full bg-[#00E676] ring-4 ring-[#071D35] shadow-[0_0_10px_#00E676]" />

                {/* Category Icon */}
                {renderCategoryIcon(item.category)}

                {/* Event Card */}
                <div className="flex-1 rounded-2xl bg-[#102B46]/85 hover:bg-[#133252] border border-[#00D5FF]/25 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                      {item.deltaText ? (
                        <span className="font-mono-tabular font-semibold text-[#00E676]">
                          {item.deltaText} ·{' '}
                        </span>
                      ) : null}
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs font-mono-tabular font-bold text-[#00D5FF] block">
                      {item.timestamp}
                    </span>
                    <span className="text-[11px] font-mono-tabular text-slate-400">
                      {item.dateStr}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
