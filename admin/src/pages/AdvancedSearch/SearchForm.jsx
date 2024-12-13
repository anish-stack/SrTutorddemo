import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchForm = ({ formData, handleInputChange, suggestions, handleSearch, concatenatedData }) => {
 
  const [showSuggestions, setShowSuggestions] = useState(true);
    
  const handleSuggestionClick = (suggestion) => {
    handleInputChange({
      target: { name: 'searchLocation', value: suggestion.description }
    });
    setShowSuggestions(false); 
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location Search */}
        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="searchLocation"
            value={formData.searchLocation}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Location"
            onFocus={() => setShowSuggestions(true)} // Show suggestions when input is focused
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSuggestionClick(suggestion)} // Hide suggestions after click
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>

 
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Class</label>
          <select
            name="classSearch"
            value={formData.classSearch}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            
            {!formData.classSearch && <option value="">Select Class</option>}
            {concatenatedData.map((classItem) => (
              <option key={classItem.id} value={classItem.class}>
                {classItem.class}
              </option>
            ))}
          </select>
        </div>

        {/* Radius Input */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Radius (km)</label>
          <input
            type="number"
            name="radius"
            value={formData.radius}
            onChange={handleInputChange}
            min="1"
            max="50"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Search radius"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
