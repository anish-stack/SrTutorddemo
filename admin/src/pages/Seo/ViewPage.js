import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';

const ViewPage = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { url } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/seo/get-page/${url}`);
        setPage(response.data);
      } catch (error) {
        console.error('Error fetching page:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [url]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <button
            onClick={() => navigate('/manage-pages')}
            className="text-blue-600 hover:underline"
          >
            Back to Pages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/manage-pages')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Pages
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{page.PageTitle}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Information</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-700">Meta Title</p>
                <p className="text-gray-600">{page.MetaTitle}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Meta Description</p>
                <p className="text-gray-600">{page.MetaDescription}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">URL</p>
                <p className="text-gray-600">{page.seoFrendilyUrl}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Tag</p>
                <p className="text-gray-600">{page.Tag}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {page.MetaKeywords.map((keyword, index) => (
                keyword && (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                  >
                    {keyword}
                  </span>
                )
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Page Content</h2>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: page.PageContent }}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewPage;