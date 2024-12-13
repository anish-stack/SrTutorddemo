import React from 'react';

const FilterBar = ({ filter, onFilterChange, startDate, endDate, onDateChange }) => (
  <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <div className="relative">
      <input
        type="text"
        placeholder="Search leads..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    
    <div>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onDateChange('start', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    
    <div>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onDateChange('end', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    
    <button
      onClick={() => onDateChange('clear')}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
    >
      Clear Filters
    </button>
  </div>
);

export default FilterBar;