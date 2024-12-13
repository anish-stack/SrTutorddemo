import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, onJumpToPage }) => (
  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <div className="flex items-center gap-1">
        {[...Array(Math.min(5, totalPages))].map((_, idx) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = idx + 1;
          } else if (currentPage <= 3) {
            pageNum = idx + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + idx;
          } else {
            pageNum = currentPage - 2 + idx;
          }
          return (
            <button
              key={idx}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 text-sm rounded-md ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
    
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <input
        type="number"
        min="1"
        max={totalPages}
        placeholder="Go to page"
        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              onJumpToPage(page);
              e.target.value = '';
            }
          }
        }}
      />
    </div>
  </div>
);

export default Pagination;