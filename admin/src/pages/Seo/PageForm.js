import React from 'react';

const PageForm = ({ formData, onChange, onSubmit, loading, children }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="MetaTitle" className="block text-sm font-medium text-gray-700">
            Meta Title
          </label>
          <input
            type="text"
            name="MetaTitle"
            id="MetaTitle"
            value={formData.MetaTitle}
            onChange={onChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="seoFrendilyUrl" className="block text-sm font-medium text-gray-700">
            SEO Friendly URL
          </label>
          <input
            type="text"
            name="seoFrendilyUrl"
            id="seoFrendilyUrl"
            value={formData.seoFrendilyUrl}
            onChange={onChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="MetaDescription" className="block text-sm font-medium text-gray-700">
            Meta Description
          </label>
          <textarea
            name="MetaDescription"
            id="MetaDescription"
            rows={4}
            value={formData.MetaDescription}
            onChange={onChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="MetaKeywords" className="block text-sm font-medium text-gray-700">
            Meta Keywords
          </label>
          <textarea
            name="MetaKeywords"
            id="MetaKeywords"
            rows={4}
            value={formData.MetaKeywords}
            onChange={onChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter keywords separated by commas"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label htmlFor="PageTitle" className="block text-sm font-medium text-gray-700">
            Page Title
          </label>
          <input
            type="text"
            name="PageTitle"
            id="PageTitle"
            value={formData.PageTitle}
            onChange={onChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="Heading" className="block text-sm font-medium text-gray-700">
            Heading
          </label>
          <input
            type="text"
            name="Heading"
            id="Heading"
            value={formData.Heading}
            onChange={onChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="Tag" className="block text-sm font-medium text-gray-700">
            Tag
          </label>
          <input
            type="text"
            name="Tag"
            id="Tag"
            value={formData.Tag}
            onChange={onChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {children}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default PageForm;