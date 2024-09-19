import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CiEdit, CiViewBoard } from 'react-icons/ci';
import { ImBin } from 'react-icons/im';
import { FaCalendarAlt, FaCheckDouble, FaComments, FaEye, FaRegComments, FaRegThumbsDown, FaRegThumbsUp, FaThumbsUp, FaTimes } from 'react-icons/fa';
import { PiEyeClosed } from 'react-icons/pi';
import toast from 'react-hot-toast';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const TeacherRequest = () => {
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
    const [dealDoneData, setDealDoneData] = useState(false)
    const [selectedId, setSelectedId] = useState(null); // New state for the selected ID
    const token = localStorage.getItem('Sr-token');
    const [comment, setComment] = useState('');


    const fetchData = async () => {
        try {
            const response = await axios.get('https://api.srtutorsbureau.com/api/v1/student/admin-particular-Request', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = response.data.data.filter((item) => item.isDealDone === dealDoneData);
            setData(data);
            setFilteredData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleShowDataOfdeal = () => {
        setLoading(true)
        fetchData()
        setTimeout(() => {
            setDealDoneData(!dealDoneData)
            setLoading(false)

        }, 2000)
    }

    useEffect(() => {
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
            const res = await axios.put(`https://api.srtutorsbureau.com/api/v1/student/admin-toggle-Request/${id}/${action}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(res.data)
            setFilteredData(prevData =>
                prevData.map(item =>
                    item._id === id ? { ...item, statusOfRequest: action } : item
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDeleteStatus = async (id,) => {
        try {
            const res = await axios.delete(`https://api.srtutorsbureau.com/api/v1/student/admin-delete-Request/${id}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(res.data)
            toast.success("Request Deleted Successful")
            fetchData()
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
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/admin-do-comment', {
                requestId: selectedId, comment
            });
            console.log(response.data);
            setIsModelOpen(false);
            setLoading(false)
            window.location.reload()
        } catch (error) {
            console.error(error);
            setLoading(false)
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
    const handleDealDone = async (id) => {
        try {
            setLoading(true)
            const response = await axios.post(`https://api.srtutorsbureau.com/api/v1/student/ToggleDealDone/${id}`)
            fetchData()
            toast.success("Congratulations Deal is Done 🎉🎉")
            setLoading(false)


        } catch (error) {
            setLoading(false)

            toast.error(error.response.data.message)
        }
    }

    return (
        <div className="py-4 px-0 ">
            <div className='flex items-center justify-between h-12 ml-4 mr-4 mb-3'>
                <div><h1 className="text-xl font-bold mb-4">Particular Teacher Requests</h1></div>
                <div onClick={handleShowDataOfdeal}>
                    <Link
                        className="whitespace-nowrap w-full gap-1 mt-2 text-sm flex items-center justify-center rounded border border-sky-400 bg-gradient-to-r from-sky-100 to-sky-200 px-2 py-1 font-semibold text-sky-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                    >
                        {loading ? (
                            <span>Loading...</span> // Show loader text while loading
                        ) : (
                            <>
                                {dealDoneData ? 'Show New Request' : 'Check Deal Done Request'}{' '}
                                <FaCheckDouble className="text-gray-900" />
                            </>
                        )}
                    </Link>
                </div>
            </div>

            {/* Search Input */}
            <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Search Field */}
                <div className="w-full">
                    <input
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search by: studentId, className, Subject, location, interested, howManyClassYouWant, minimumBudget, maximumBudget, startDate, isDealDone, teacherGender"

                        className="py-3 px-2 border border-gray-300 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
                    />
                </div>

                {/* Page Size Dropdown */}
                <div className="w-full">
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="py-3 px-2 border border-gray-300 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
                    >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                            <option key={size} value={size}>
                                {size} per page
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className=" relative overflow-x-auto">
                <table className="w-full t text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                    <thead className='t text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                        <tr className="bg-gray-100">
                            {[
                                'Student Id',
                                'Teacher Id',
                                'Classes/Week',
                                'Class',
                                'Subject',
                                'Location',
                                'Interested',
                                // 'Budget Range',
                                // 'Start Date',
                                // 'Teacher Gender',
                                'isDealDone',
                                'Action',
                                'Deal Done',
                                // 'Show Details',
                                'Add Comment',
                                'View Comment',
                            ].map((header, idx) => (
                                <th
                                    key={header}
                                    className="px-2 whitespace-nowrap py-2 text-left text-xs font-medium text-gray-700"
                                    onClick={() =>
                                        idx < 11 &&
                                        handleSort(
                                            [
                                                'studentId',
                                                'className',
                                                'Subject',
                                                'location',
                                                'interested',
                                                'howManyClassYouWant',
                                                // 'minimumBudget',
                                                // 'maximumBudget',
                                                // 'startDate',
                                                'isDealDone',
                                                'Gender',
                                            ][idx]
                                        )
                                    }
                                >
                                    {header}
                                    {sortConfig.key ===
                                        [
                                            'studentId',
                                            'className',
                                            'Subject',
                                            'location',
                                            'interested',
                                            'howManyClassYouWant',
                                            'minimumBudget',
                                            'maximumBudget',
                                            'startDate',
                                            'isDealDone',
                                            'Gender',
                                        ][idx] &&
                                        (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row) => (
                            <tr key={row._id} className="border-b">
                                <td className="px-2 text-xs text-gray-700">
                                    <a
                                        href={`/Student-info/${row.studentId}`}
                                        className="text-red-500 hover:underline"
                                    >
                                        {row.studentId.substring(0, 4) + '...'}
                                    </a>
                                </td>
                                <td>
                                    <a
                                        href={`/Manage-Teacher/${row.teacherId}`}
                                        className="text-red-500 hover:underline"
                                    >
                                        {row.teacherId.substring(0, 4) + '...'}
                                    </a>

                                </td>
                                <td className="px-2 py-1 text-xs text-gray-700">
                                    {row.HowManyClassYouWant || "Not-Sure"}
                                </td>
                                <td className="px-2 py-1 text-xs text-gray-700">
                                    {row.className}
                                </td>
                                <td className="px-2 py-1 text-xs text-gray-700">
                                    {row.Subject.join(', ')}
                                </td>

                                <td className="px-2 py-1 text-xs text-gray-700">
                                    {row.Location}
                                </td>
                                <td className="px-2 py-1 text-xs text-gray-700">
                                    {row.TeachingMode}
                                </td>

                                {/* <td className="px-2 py-1 text-xs text-gray-700">
                                    {row.MinRange} - {row.MaxRange}
                                </td> */}
                                {/* <td className="px-2 py-1 text-xs text-gray-700">
                                    {new Date(row.StartDate).toLocaleDateString('es-gd')}
                                </td> */}
                                {/* <td className="px-2 py-1 text-xs text-gray-700">
                                    {row.Gender}
                                </td> */}
                                <td className="px-2 py-1 text-xs text-gray-700">
                                    {row.isDealDone ? 'Yes' : 'No'}
                                </td>
                                <td className="px-2 py-1 text-xs text-gray-700">
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
                                        className="whitespace-nowrap w-full gap-1 mt-2 text-sm flex items-center justify-center rounded border border-violet-400 bg-gradient-to-r from-violet-100 to-violet-200 px-2 py-1 font-semibold text-violet-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                    >
                                        {loading ? (
                                            <svg
                                                className="animate-spin h-5 w-5 text-violet-600"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                                                ></path>
                                            </svg>
                                        ) : row.isDealDone ? (
                                            <FaRegThumbsUp className="text-xl cursor-not-allowed" />
                                        ) : (
                                            <FaRegThumbsDown onClick={() => handleDealDone(row._id)} className="text-xl" />
                                        )}
                                    </button>
                                </td>

                                {/* <td className="px-2">
                                    <button
                                        onClick={() => handleDeleteStatus(row._id)}
                                        className="whitespace-nowrap w-full gap-1 mt-2 text-sm flex items-center justify-center rounded border border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-2 py-1 font-semibold text-red-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                    >
                                        <CiViewBoard className="text-xl" />
                                    </button>
                                </td> */}
                                <td className="px-2">
                                    <button
                                        onClick={() => handleOpen(row._id)}
                                        className="whitespace-nowrap w-full gap-1 mt-2 text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-2 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                    >
                                        <CiEdit className="text-xl" />
                                    </button>
                                </td>
                                <td className="px-2">

                                    {row.commentByAdmin.length > 0 ? (
                                        <Link
                                            onClick={() => handleCommentOpen(row.commentByAdmin)}
                                            className="whitespace-nowrap w-full gap-1 mt-2 text-sm flex items-center justify-center rounded border border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 px-2 py-1 font-semibold text-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                        >
                                            <FaEye className="text-xl" />
                                        </Link>
                                    ) : (
                                        <button
                                            disabled={true}
                                            className="whitespace-nowrap w-full gap-1 cursor-not-allowed mt-2 text-sm flex items-center justify-center rounded border border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 px-2 py-1 font-semibold text-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
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
                                className="px-2 py-2 bg-gray-200 text-gray-700 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                onClick={handleAddComment}
                                className={`px-2 py-2 bg-blue-500 text-white rounded ${loading ? 'cursor-not-allowed' : 'cursor-pointer'} `}
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

export default TeacherRequest;
