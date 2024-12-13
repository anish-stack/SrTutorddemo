import React, { useState, useMemo, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const EditPage = () => {
    const { id, url } = useParams();
    const navigate = useNavigate();


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const editor = useRef(null);
    const [formData, setFormData] = useState({
        MetaTitle: '',
        seoFrendilyUrl: '',
        MetaDescription: '',
        MetaKeywords: [],
        PageTitle: '',
        Heading: '',
        Tag: '',
        PageContent: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'MetaKeywords') {
            // Split the value by commas and trim spaces around each keyword
            const keywords = value.split(',').map(keyword => keyword.trim());
            setFormData((prev) => ({
                ...prev,
                [name]: keywords // Set the MetaKeywords as an array
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value // Update other fields normally
            }));
        }
    };
    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/seo/get-page/${url}`);
                const data = response.data
                setFormData((prev) => ({
                    ...prev,
                    MetaTitle: data.MetaTitle,
                    seoFrendilyUrl: data.seoFrendilyUrl,
                    MetaDescription: data.MetaDescription,
                    MetaKeywords: data.MetaKeywords.join(', '),
                    PageTitle: data.PageTitle,
                    Heading: data.Heading,
                    Tag: data.Tag,
                    PageContent: data.PageContent
                }))
            } catch (error) {
                console.error('Error fetching page:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [url]);

    // Configuration for Jodit Editor
    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Start typing...',
    }), []);

    // Submit function for form
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        setLoading(true);
        try {
            const response = await axios.post(`http://api.srtutorsbureau.com/api/v1/seo/update-page/${id}`, formData);
            toast.success('Page Edit successfully!');
            setFormData({
                MetaTitle: '',
                seoFrendilyUrl: '',
                MetaDescription: '',
                MetaKeywords: [],
                PageTitle: '',
                Heading: '',
                Tag: '',
                PageContent: ''
            });
            navigate(`/manage-pages`);
        } catch (error) {
            console.error('Error creating page:', error);
            toast.error('Failed to Edit page!');
            setError(error.response?.data?.message || 'Error occurred while creating the page');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Edit Page</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="MetaTitle" className="block text-sm font-medium text-gray-700">Meta Title</label>
                        <input
                            type="text"
                            name="MetaTitle"
                            id="MetaTitle"
                            value={formData.MetaTitle}
                            required={true}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Meta Title"
                        />
                    </div>
                    <div>
                        <label htmlFor="seoFrendilyUrl" className="block text-sm font-medium text-gray-700">SEO Friendly URL</label>
                        <input
                            type="text"
                            name="seoFrendilyUrl"
                            id="seoFrendilyUrl"
                            value={formData.seoFrendilyUrl}
                            required={true}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter SEO URL"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="MetaDescription" className="block text-sm font-medium text-gray-700">Meta Description</label>
                        <textarea
                            type="text"
                            rows={4}
                            name="MetaDescription"
                            id="MetaDescription"
                            value={formData.MetaDescription}
                            required={true}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Meta Description"
                        />
                    </div>
                    <div>
                        <label htmlFor="MetaKeywords" className="block text-sm font-medium text-gray-700">Meta Keywords</label>
                        <textarea
                            rows={4}
                            type="text"
                            name="MetaKeywords"
                            id="MetaKeywords"
                            value={formData.MetaKeywords}
                            required={true}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Meta Keywords (comma separated)"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="PageTitle" className="block text-sm font-medium text-gray-700">Page Title</label>
                        <input
                            type="text"
                            name="PageTitle"
                            id="PageTitle"
                            value={formData.PageTitle}
                            required={true}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Page Title"
                        />
                    </div>
                    <div>
                        <label htmlFor="Heading" className="block text-sm font-medium text-gray-700">Heading</label>
                        <input
                            type="text"
                            name="Heading"
                            id="Heading"
                            value={formData.Heading}
                            required={true}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Heading"
                        />
                    </div>
                    <div>
                        <label htmlFor="Tag" className="block text-sm font-medium text-gray-700">Tag</label>
                        <input
                            type="text"
                            name="Tag"
                            id="Tag"
                            value={formData.Tag}
                            required={true}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Tag"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="PageContent" className="block text-sm font-medium text-gray-700">Page Content</label>
                    <JoditEditor
                        ref={editor}
                        value={formData.PageContent}
                        config={config}
                        onBlur={(newContent) => setFormData((prev) => ({ ...prev, PageContent: newContent }))}
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className={`w-full px-6 py-2 rounded-md bg-blue-500 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Page'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditPage