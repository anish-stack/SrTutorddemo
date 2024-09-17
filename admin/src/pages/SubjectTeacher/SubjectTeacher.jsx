import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import { ImBin } from 'react-icons/im';
import { FaCalendarAlt, FaComments, FaEye, FaRegComments, FaTimes } from 'react-icons/fa';
import { PiEyeClosed } from 'react-icons/pi';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const SubjectTeacherTable = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [CommentModelOpen, setCommentModelOpen] = useState(false);
    const [adminComment, setAdminComment] = useState(false);
    const [loading, setLoading] = useState(false)

    const [selectedId, setSelectedId] = useState(null); // New state for the selected ID
    const token = localStorage.getItem('Sr-token');
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://sr.apnipaathshaala.in/api/v1/student/admin-teacher-Request', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response.data.data)
                setData(response.data.data);
                setFilteredData(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        const filtered = data.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(globalFilter.toLowerCase())
            )
        );
        setFilteredData(filtered);
    }, [globalFilter, data]);

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;
        const sorted = [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * (sortConfig.direction === 'asc' ? 1 : -1);
        });
        return sorted;
    }, [filteredData, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key ? (prev.direction === 'asc' ? 'desc' : 'asc') : 'asc'
        }));
    };

    const handleUpdateStatus = async (id, action) => {
        try {
            await axios.put(`https://sr.apnipaathshaala.in/api/v1/student/admin-toggle-Request/${id}/${action}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFilteredData(prevData =>
                prevData.map(item =>
                    item._id === id ? { ...item, statusOfRequest: action } : item
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleOpen = (id) => {
        setSelectedId(id); // Capture the ID of the row
        setIsModelOpen(true);
    };

    const onClose = () => {
        setIsModelOpen(false);
        setSelectedId(null); // Reset the selected ID
    };

    const handleAddComment = async () => {
        setLoading(true)
        try {
            const response = await axios.post('https://sr.apnipaathshaala.in/api/v1/student/admin-make-comment', {
                requestId: selectedId, comment
            });
            console.log(response.data);
            setIsModelOpen(false);
            setLoading(true)
        } catch (error) {
            console.error(error);
            setLoading(true)
            setIsModelOpen(false);
        }
    };
    const handleCommentOpen = (commentByAdmin) => {
        setCommentModelOpen(true)
        setAdminComment(commentByAdmin)

    }
    const handleCloseComment = () => {
        setCommentModelOpen(false)
    }

    const pageCount = Math.ceil(filteredData.length / pageSize);
    const paginatedData = sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Subject Teacher Requests</h1>

            {/* Search Input */}
            <input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="py-3 px-2 border w-full border-gray-900 rounded mb-4"
            />

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            {[
                                'Student Id',
                                'Name',
                                'Contact Number',
                                'Class',
                                'Subject',
                                'Location',
                                'Interested',
                                'Classes/Week',
                                // 'Budget Range',
                                // 'Start Date',
                                // 'Teacher Gender',
                                'isDealDone',
                                'Action',
                                'Add Comment',
                                'View Comment',
                            ].map((header, idx) => (
                                <th
                                    key={header}
                                    className="px-4 py-1 text-left text-sm font-medium text-gray-700"
                                    onClick={() =>
                                        idx < 11 &&
                                        handleSort(
                                            [
                                                'studentId',
                                                'userContactInfo.name',
                                                'userContactInfo.contactNumber',
                                                'subject',
                                                'location',
                                                'interested',
                                                'howManyClassYouWant',
                                                'minimumBudget',
                                                'maximumBudget',
                                                'startDate',
                                                'isDealDone',
                                                'teacherGender',
                                            ][idx]
                                        )
                                    }
                                >
                                    {header}
                                    {sortConfig.key ===
                                        [
                                            'studentId',
                                            'userContactInfo.name',
                                            'userContactInfo.contactNumber',
                                            'subject',
                                            'location',
                                            'interested',
                                            'howManyClassYouWant',
                                            'minimumBudget',
                                            'maximumBudget',
                                            'startDate',
                                            'isDealDone',
                                            'teacherGender',
                                        ][idx] &&
                                        (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row) => (
                            <tr key={row._id} className="border-b">
                                <td className="px-4 py-1 text-xs text-gray-700">
                                    <a
                                        href={`/Student-info/${row.studentId}`}
                                        className="text-red-500 hover:underline"
                                    >
                                        {row.studentId.substring(0, 4) + '...'}
                                    </a>
                                </td>
                                <td className="px-4 py-1 text-xs text-gray-700">
                                    {row.userContactInfo.name}
                                </td>
                                <td className="px-4 py-1 text-xs text-gray-700">
                                    {row.userContactInfo.contactNumber}
                                </td>
                                <td className="px-4 py-1 text-xs text-gray-700">
                                    {row.class}
                                </td>
                                <td className="px-4 py-1 text-xs text-gray-700">
                                    {row.subject}
                                </td>
                                <td className="px-4 py-1 text-xs text-gray-700">
                                    {row.location}
                                </td>
                                <td className="px-4 py-1 text-xs text-gray-700">
                                    {row.interested}
                                </td>
                                <td className="px-4 py-1 text-xs text-gray-700">
                                    {row.howManyClassYouWant}
                                </td>
                                {/* <td className="px-4 py-1 text-xs text-gray-700">
                                    {row.minimumBudget} - {row.maximumBudget}
                                </td>
                                <td className="px-4 py-1 text-xs text-gray-700">
                                    {new Date(row.startDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-1 text-xs text-gray-700">
                                    {row.teacherGender}
                                </td> */}
                                <td className="px-4 py-1 text-xs text-gray-700">
                                    {row.isDealDone ? 'Yes':'No'}
                                </td>
                                <td className="px-4 py-1 text-xs text-gray-700">
                                    <select
                                        onChange={(e) =>
                                            handleUpdateStatus(row._id, e.target.value)
                                        }
                                        className="px-2 py-1 border border-gray-300 rounded"
                                        value={row.statusOfRequest}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="Accept">Accept</option>
                                        <option value="declined">Declined</option>
                                    </select>
                                </td>
                                <td className="px-2">
                                    <button
                                        onClick={() => handleOpen(row._id)}
                                        className="whitespace-nowrap w-full gap-1 mt-2 text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                    >
                                        <CiEdit className="text-xl" />
                                    </button>
                                </td>
                                <td className="px-2">
                                    {row.commentByAdmin.length > 0 ? (
                                        <Link
                                            onClick={() => handleCommentOpen(row.commentByAdmin)}
                                            className="whitespace-nowrap w-full gap-1 mt-2 text-sm flex items-center justify-center rounded border border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-1 font-semibold text-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                        >
                                            <FaEye className="text-xl" />
                                        </Link>
                                    ) : (
                                        <button
                                            disabled={true}
                                            className="whitespace-nowrap w-full gap-1 cursor-not-allowed mt-2 text-sm flex items-center justify-center rounded border border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-1 font-semibold text-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                        >
                                            <PiEyeClosed className="text-xl" />
                                        </button>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
                <div>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="border border-gray-300 rounded py-1 px-2"
                    >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                            <option key={size} value={size}>
                                {size} per page
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        className="px-3 py-1 border border-gray-300 rounded mr-2"
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {currentPage + 1} of {pageCount}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1))
                        }
                        disabled={currentPage === pageCount - 1}
                        className="px-3 py-1 border border-gray-300 rounded ml-2"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal for Adding Comments */}
            {isModelOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Add Comment for ID: {selectedId}</h2>
                        <textarea
                            className="w-full h-24 border border-gray-300 rounded p-2 mb-4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your comment here..."
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                onClick={handleAddComment}
                                className={`px-4 py-2 bg-blue-500 text-white rounded ${loading ? 'cursor-not-allowed' : 'cursor-pointer'} `}
                            >
                                {loading ? "Please Wait ..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* model for showing comment */}
            {CommentModelOpen ? (
                <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-30 backdrop-blur-sm">
                    <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-lg overflow-hidden transform transition-transform duration-500 hover:scale-105 relative">
                        {/* Close Button */}
                        <div className='mb-5 p-5'>
                            <button
                                onClick={handleCloseComment}
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                <FaTimes className="text-2xl" />
                            </button>
                        </div>

                        {/* Header Section */}
                        <div className="flex items-center justify-between border-b border-gray-300 pb-3 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 tracking-wide">Admin Comments</h2>
                            <span className="flex items-center text-blue-500 bg-blue-100 px-3 py-1 rounded-full text-sm">
                                <FaRegComments className="mr-2 text-blue-500" />
                                {adminComment.length} Comments
                            </span>
                        </div>

                        {/* Comment List */}
                        {adminComment.length > 0 ? (
                            adminComment.map((comment, index) => (
                                <div
                                    key={comment.id}
                                    className="flex items-start border-b border-gray-200 py-3 space-x-4 hover:bg-gray-50 transition-colors duration-300"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <FaEye className="text-xl text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-800">
                                                Comment #{index + 1}
                                            </span>
                                            <span className="flex items-center text-gray-500 text-sm">
                                                <FaCalendarAlt className="mr-1" />
                                                {new Date(comment.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mt-2">{comment.comment}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No comments available.
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );

};

export default SubjectTeacherTable;
