import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast';

const MessageTemplate = () => {
    const [templates, setTemplates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [templatesPerPage] = useState(10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    // Fetch all templates
    const handleFetchTemplates = async () => {
        try {
            const res = await axios.get('https://sr.apnipaathshaala.in/api/v1/admin/get-all-templates');

            setTemplates(res.data.data || []);
        } catch (error) {
            console.error('There was an error fetching the templates!', error);
        }
    };

    // Handle delete template
    const handleDeleteTemplate = async () => {
        try {
            await axios.delete(`https://sr.apnipaathshaala.in/api/v1/admin/delete-template/${selectedTemplate._id}`);
            handleFetchTemplates();
            setShowDeleteModal(false);
            toast.success('Template deleted successfully!');
        } catch (error) {
            console.error('There was an error deleting the template!', error);
            toast.error('Failed to delete template!');
        }
    };

    // Handle send template
    const handleSendTemplate = async (_id) => {
        setIsLoading(true)
        try {
            await axios.post('https://sr.apnipaathshaala.in/api/v1/admin/send-emails-in-batches', {
                id: _id
            });
            toast.success('Emails sent successfully!');
            setIsLoading(false)

        } catch (error) {
            console.error('There was an error sending the template!', error);
            setIsLoading(false)
            toast.error('Failed to send emails!');
        }
    };

    // Pagination logic
    const indexOfLastTemplate = currentPage * templatesPerPage;
    const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
    const currentTemplates = templates.slice(indexOfFirstTemplate, indexOfLastTemplate);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        handleFetchTemplates();
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-4">Message Templates</h1>
            <Link
                to={"/create-template"}
                className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-1 font-semibold text-blue-600 mb-4 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 active:opacity-100 transition duration-150"

            >
                Add New Template
            </Link>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentTemplates.map((template, index) => (
                        <tr key={template._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{indexOfFirstTemplate + index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.subject}</td>
                            <td className="px-6 flex items-center justify-between py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    disabled={isLoading}
                                    className={`whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    onClick={() => handleSendTemplate(template._id)}
                                >
                                    {isLoading ? (
                                        <>
                                            Sending messages, please wait...
                                            <i className="fa-solid fa-spinner spinner"></i>
                                        </>
                                    ) : (
                                        'Send to All'
                                    )}
                                </button>

                                <Link
                                    to={`/edit-template/${template._id}`}
                                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-violet-400 bg-gradient-to-r from-violet-100 to-violet-200 px-4 py-1 font-semibold text-violet-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 active:opacity-100 transition duration-150"

                                >
                                    Edit
                                </Link>
                                <button
                                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-4 py-1 font-semibold text-red-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                    onClick={() => {
                                        setSelectedTemplate(template);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <nav className="mt-4">
                <ul className="flex justify-center space-x-2">
                    {[...Array(Math.ceil(templates.length / templatesPerPage)).keys()].map(number => (
                        <li key={number + 1}>
                            <a
                                onClick={() => paginate(number + 1)}
                                className={`cursor-pointer px-3 py-1 rounded-md text-sm font-medium ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} hover:bg-blue-400`}
                            >
                                {number + 1}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
                        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h5 className="text-lg font-semibold">Delete Template</h5>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                <span><i className="fa-solid fa-xmark"></i></span>
                            </button>
                        </div>
                        <div className="px-4 py-3">
                            <p>Are you sure you want to delete this template?</p>
                        </div>
                        <div className="px-4 py-3 border-t border-gray-200 flex justify-end">
                            <button
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition mr-2"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Close
                            </button>
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                                onClick={handleDeleteTemplate}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageTemplate;
