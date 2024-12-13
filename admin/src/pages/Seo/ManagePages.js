import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2, Eye, Edit, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmModal from './DeleteConfirmModal';
import PageCard from './PageCard';

const ManagePages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, pageId: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await axios.get('https://api.srtutorsbureau.com/api/v1/seo/get-all-page');
      setPages(response.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.srtutorsbureau.com/api/v1/seo/delete-page/${id}`);
      setPages(pages.filter(page => page._id !== id));
      setDeleteModal({ show: false, pageId: null });
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SEO Pages</h1>
        <button
          onClick={() => navigate('/create-pages')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          Create New Page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <PageCard
            key={page._id}
            page={page}
            onView={() => navigate(`/seo/view/${page.seoFrendilyUrl}`)}
            onEdit={() => navigate(`/seo/edit/${page._id}/${page.seoFrendilyUrl}`)}
            onDelete={() => setDeleteModal({ show: true, pageId: page._id })}
          />
        ))}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, pageId: null })}
        onConfirm={() => handleDelete(deleteModal.pageId)}
      />
    </div>
  );
};

export default ManagePages;