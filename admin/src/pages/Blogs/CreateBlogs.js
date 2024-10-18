import React, { useState, useRef, useMemo } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import ImageUploader from 'react-image-upload';
import 'react-image-upload/dist/index.css';
import 'tailwindcss/tailwind.css';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';

const CreateBlogs = () => {
    const [formData, setFormData] = useState({
        CreatedBy: 'Admin', // Default value
        Headline: '',
        SubHeading: '',
        Tag: '',
        BlogData: '',
        file: null // Use single file for handling one image
    });
    const [loading, setIsLoading] = useState(false)
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const navigate = useNavigate()

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: 'Start typing...',
            toolbar: true,
            height: 400
        }),
        []
    );
    function getImageFileObject(imageFile) {
        console.log({ imageFile })
        setFormData((prev) => ({ ...prev, file: { imageFile } }))
    }



    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('CreatedBy', formData.CreatedBy);
        formDataToSubmit.append('Headline', formData.Headline);
        formDataToSubmit.append('SubHeading', formData.SubHeading);
        formDataToSubmit.append('Tag', formData.Tag);
        formDataToSubmit.append('BlogData', formData.BlogData);

        if (formData.file) {
            formDataToSubmit.append('image', formData.file?.imageFile?.file);
        }

        try {
            const token = localStorage.getItem('Sr-token');
            await toast.promise(
                axios.post('https://api.srtutorsbureau.com/api/v1/admin/Create-Blog', formDataToSubmit, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }),
                {
                    pending: 'Creating blog...',
                    success: 'Blog created successfully!',
                    error: 'Error creating blog'
                }
            );
            navigate('/Manage-Blogs')
        } catch (error) {
            console.error('Error creating blog:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {loading ? <Loading /> : (
                <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Blog</h2>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="CreatedBy">
                                Created By
                            </label>
                            <input
                                type="text"
                                id="CreatedBy"
                                name="CreatedBy"
                                value={formData.CreatedBy}
                                onChange={handleFormChange}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="Headline">
                                Headline
                            </label>
                            <input
                                type="text"
                                id="Headline"
                                name="Headline"
                                value={formData.Headline}
                                onChange={handleFormChange}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="SubHeading">
                                Sub Heading
                            </label>
                            <input
                                type="text"
                                id="SubHeading"
                                name="SubHeading"
                                value={formData.SubHeading}
                                onChange={handleFormChange}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="Tag">
                                Tag
                            </label>
                            <input
                                type="text"
                                id="Tag"
                                name="Tag"
                                value={formData.Tag}
                                onChange={handleFormChange}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="file">
                                Upload Image For News Thumbnail
                            </label>
                            <ImageUploader
                                onFileAdded={(img) => getImageFileObject(img)}
                                className="border border-gray-300 rounded-md p-2"

                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="BlogData">
                                Blog Content
                            </label>
                            <JoditEditor
                                ref={editor}
                                value={content}
                                config={config}
                                onChange={(newContent) => {
                                    setContent(newContent);
                                    setFormData((prev) => ({ ...prev, BlogData: newContent }));
                                }}
                            // className="border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                disabled={loading}
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </>
    );
};

export default CreateBlogs;