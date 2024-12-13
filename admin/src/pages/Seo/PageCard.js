import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

const PageCard = ({ page, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl border p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
        {page.PageTitle}
      </h2>
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600 line-clamp-1">
          <span className="font-medium">URL:</span> {page.seoFrendilyUrl}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">
          <span className="font-medium">Meta Description:</span> {page.MetaDescription}
        </p>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Tags:</span>
          <span className="ml-2 inline-block bg-gray-100 px-2 py-1 rounded">
            {page.Tag}
          </span>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          onClick={onView}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
          title="View Page"
        >
          <Eye className="h-5 w-5" />
        </button>
        <button
          onClick={onEdit}
          className="p-2 text-green-600 hover:bg-green-50 rounded-full"
          title="Edit Page"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
          title="Delete Page"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PageCard;