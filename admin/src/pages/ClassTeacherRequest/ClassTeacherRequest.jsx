import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CommentModal from './CommentModal';
import AddCommentModal from './AddCommentModal'; // Import the add comment modal

const ClassTeacherRequest = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataError, setDataError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [addCommentModalOpen, setAddCommentModalOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentError, setCommentError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://sr.apnipaathshaala.in/api/v1/student/Class-Teacher-Request');
            setData(response.data.data);
            setDataError(false);
        } catch (error) {
            setDataError(true);
            toast.error('Error fetching data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (id) => {
        console.log(id)
        try {
            const response = await axios.get(`https://sr.apnipaathshaala.in/api/v1/student/Class-Get-Comments/${id}`);
            setComments(response.data.comments);
        } catch (error) {
            console.log(error)
            toast.error('Error fetching comments.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await axios.delete(`https://sr.apnipaathshaala.in/api/v1/student/Class-Delete-Request/${id}`);
                toast.success('Request deleted successfully');
                fetchData(); // Refresh data after deletion
            } catch (error) {
                toast.error('Error deleting request.');
            }
        }
    };

    const handleUpdate = async (id, status) => {
        try {
            await axios.post(`https://sr.apnipaathshaala.in/api/v1/student/Class-Accept-Request/${id}/${status}`);
            toast.success('Request updated successfully');
            fetchData(); // Refresh data after update
        } catch (error) {
            toast.error('Error updating request.');
        }
    };

    const handleChangeStatus = (e, id) => {
        handleUpdate(id, e.target.value);
    };

    const handleShowComments = async (id) => {
        setSelectedRequestId(id);
        setModalOpen(true);
        await fetchComments(id);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleOpenAddCommentModal = (id) => {
        setSelectedRequestId(id);
        setAddCommentModalOpen(true);
    };

    const handleCloseAddCommentModal = () => {
        setAddCommentModalOpen(false);
    };

    const handleAddComment = async (comment) => {
        setCommentLoading(true);
        setCommentError('');
        try {
            await axios.post(`https://sr.apnipaathshaala.in/api/v1/student/Class-comment-Request`, {
                requestId: selectedRequestId, comment
            });
            toast.success('Comment added successfully');
            fetchComments(selectedRequestId); // Refresh comments after adding
            setNewComment(''); // Clear comment input
        } catch (error) {
            setCommentError('Error adding comment.');
        } finally {
            setCommentLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (dataError) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">Error loading data.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500 uppercase tracking-wider">Number Of Sessions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500 uppercase tracking-wider">Current Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500 uppercase tracking-wider">State</th>
                        <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500 uppercase tracking-wider">Budget</th>
                        <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500 uppercase tracking-wider">Show Comments</th>
                        <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500 uppercase tracking-wider">Add Comments</th>
                        <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                        <tr key={item._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.studentName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.selectedClasses.join(', ')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.subjects.join(', ')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.numberOfSessions.join(', ')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currentAddress}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.state}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ₹{item.minBudget} - ₹{item.maxBudget}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <select
                                    value={item.statusOfRequest}
                                    onChange={(e) => handleChangeStatus(e, item._id)}
                                    className="bg-gray-50 border border-gray-300 rounded-md py-2 px-3"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="Accept">Accept</option>
                                    <option value="Declined">Declined</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => handleShowComments(item._id)}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    Show Comments
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                                    onClick={() => handleOpenAddCommentModal(item._id)}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    Do Comments
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Previous
                </button>
                <span className="text-gray-700">
                    Page {currentPage}
                </span>
                <button
                    onClick={() => setCurrentPage(prevPage => (data.length > currentPage * itemsPerPage ? prevPage + 1 : prevPage))}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Next
                </button>
            </div>
            <CommentModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                comments={comments}
            />
            <AddCommentModal
                isOpen={addCommentModalOpen}
                onClose={handleCloseAddCommentModal}
                onAddComment={handleAddComment}
            />
        </div>
    );
};

export default ClassTeacherRequest;
