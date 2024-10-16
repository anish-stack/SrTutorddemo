import React, { useState } from 'react';
import axios from 'axios';
import ImageUploader from 'react-image-upload';
import 'react-image-upload/dist/index.css';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';

const CreateReview = () => {
    const [formData, setFormData] = useState({
        Rating: 3, // Default rating
        Text: '',
        Name: '',
        file: null,
    });
    const [loading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const getImageFileObject = (imageFile) => {
        console.log({ imageFile });
        setFormData((prev) => ({ ...prev, file: imageFile }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('Rating', formData.Rating);
        formDataToSubmit.append('Text', formData.Text);
        formDataToSubmit.append('Name', formData.Name);

        if (formData.file) {
            formDataToSubmit.append('image', formData.file.file);
        }

        try {
            const token = localStorage.getItem('Sr-token');
            await toast.promise(
                axios.post('https://api.srtutorsbureau.com/api/v1/admin/Add-review', formDataToSubmit, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                }),
                {
                    pending: 'Creating Review...',
                    success: 'Review created successfully!',
                    error: 'Error creating review',
                }
            );
            navigate('/Manage-Reviews');
        } catch (error) {
            console.error('Error creating review:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Review</h2>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="Name">
                                Name Of Person
                            </label>
                            <input
                                type="text"
                                id="Name"
                                name="Name"
                                value={formData.Name}
                                onChange={handleFormChange}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="Text">
                                Write Some Text
                            </label>
                            <textarea
                                id="Text"
                                name="Text"
                                value={formData.Text}
                                onChange={handleFormChange}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="Rating">
                                Give Rating
                            </label>
                            <div className="flex space-x-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg
                                        key={i}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill={i < formData.Rating ? 'currentColor' : 'text-green-400'}
                                        className={`w-5 h-5 ${i < formData.Rating ? 'text-yellow-500' : 'text-green-300'} cursor-pointer`}
                                        onClick={() => setFormData({ ...formData, Rating: i + 1 })}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ))}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="file">
                                Upload Image For User
                            </label>
                            <ImageUploader
                                onFileAdded={(img) => getImageFileObject(img)}
                                className="border border-gray-300 rounded-md p-2"
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

export default CreateReview;
