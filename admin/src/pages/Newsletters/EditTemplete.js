import React, { useState, useRef, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

const EditTemplate = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const editor = useRef(null);
const navigate = useNavigate()
  useEffect(() => {
    handleFetchTemplate();
  }, [id]);

  const handleFetchTemplate = async () => {
    try {
      const res = await axios.get('https://api.srtutorsbureau.com/api/v1/admin/get-all-templates');
      const template = res.data.data.find((item) => item._id === id);  // Adjust '_id' if your id field name is different
      if (template) {
        setSubject(template.subject || '');
        setContent(template.message || '');
      } else {
        toast.error('Template not found.');
      }
    } catch (error) {
      console.error('There was an error fetching the templates!', error);
      toast.error('Failed to fetch the template.');
    }
  };

  const handleEditTemplate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://api.srtutorsbureau.com/api/v1/admin/edit-template/${id}`, {
        subject,
        message: content,
      });
      toast.success('Template updated successfully!');
      navigate('/all-template');
    } catch (error) {
      console.error('There was an error updating the template!', error);
      toast.error('Failed to update the template.');
    }
  };

  const handlePreview = () => {
    Swal.fire({
      title: subject,
      html: content,
      confirmButtonText: 'Close',
    });
  };

  // Debounce the editor change event
  const handleContentChange = debounce((newContent) => {
    setContent(newContent);
  }, 300);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-4">Edit Template</h2>
      <form onSubmit={handleEditTemplate} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="templateSubject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            id="templateSubject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="templateContent" className="block text-sm font-medium text-gray-700">Message</label>
          <JoditEditor
            ref={editor}
            value={content}
            onChange={handleContentChange}
            config={{
              readonly: false
            }}
            className="border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Template
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={handlePreview}
          >
            Preview
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTemplate;
