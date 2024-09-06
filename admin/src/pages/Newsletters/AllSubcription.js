import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllSubscription = () => {
    const [emails, setEmails] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEmailId, setSelectedEmailId] = useState(null);

    // Fetch all subscribed emails
    const handleFetch = async () => {
        try {
            const res = await axios.get('https://www.sr.apnipaathshaala.in/api/v1/admin/get-all-subscribe-newsletter-email');
            setEmails(res.data.data);
        } catch (error) {
            console.error('There was an error fetching the subscribed emails!', error);
        }
    };

    // Handle delete email
    const handleDelete = async () => {
        try {
            await axios.delete(`https://www.sr.apnipaathshaala.in/api/v1/admin/delete-newsletter-email/${selectedEmailId}`);
            handleFetch();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('There was an error deleting the email!', error);
        }
    };

    useEffect(() => {
        handleFetch();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Subscribed Emails</h1>
            <Link
                to="/all-template"
                className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-yellow-400 bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-1 font-semibold text-gray-900 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
            >
                Send Offer On Email
            </Link>
            <table className="min-w-full mt-4 bg-white border border-gray-300 rounded-lg shadow-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Subscribed At</th>

                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {emails.map((email, index) => (
                        <tr key={email._id} className="hover:bg-gray-100">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{email.email}</td>
                            <td className="px-4 py-2"> {new Date(email.subscribedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</td>

                            <td className="px-4 py-2">
                                <button
                                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-4 py-1 font-semibold text-red-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                    onClick={() => {
                                        setSelectedEmailId(email._id);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    Delete <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete Modal */}
            <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 ${showDeleteModal ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4">
                    <div className="px-4 py-3 border-b">
                        <h5 className="text-lg font-semibold">Delete Email</h5>
                        <button type="button" className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowDeleteModal(false)}>
                            <span><i className="fa-solid fa-xmark"></i></span>
                        </button>
                    </div>
                    <div className="px-4 py-3">
                        <p>Are you sure you want to delete this email?</p>
                    </div>
                    <div className="px-4 py-3 border-t flex justify-end space-x-2">
                        <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300" onClick={() => setShowDeleteModal(false)}>Close</button>
                        <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllSubscription;
