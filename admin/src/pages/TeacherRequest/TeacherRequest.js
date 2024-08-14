import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const TeacherRequests = () => {
    const [requests, setRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [budget, setBudget] = useState('');

    const [comment, setComment] = useState();



    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/v1/student/Get-All-Post');
                if (response.data.success) {
                    setRequests(response.data.data);
                    setFilteredData(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchRequests();
    }, []);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const openCommentModal = (request) => {
        setSelectedRequest(request);
        setIsCommentModalOpen(true);
    };

    const closeCommentModal = () => {
        setIsCommentModalOpen(false);
        setSelectedRequest(null);
    };

    const openAddCommentModal = (request) => {
        setSelectedRequest(request);
        setIsAddCommentModalOpen(true);
    };

    const closeAddCommentModal = () => {
        setIsAddCommentModalOpen(false);
        setSelectedRequest(null);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const handleBudgetChange = (e) => {
        setBudget(e.target.value);
    };

    useEffect(() => {
        const filtered = requests.filter((request) => {
            const isSearchMatch =
                request.ClassName.toLowerCase().includes(searchQuery) ||
                request.StudentInfo.StudentName.toLowerCase().includes(searchQuery) ||
                request.InterestedInTypeOfClass.toLowerCase().includes(searchQuery) ||
                request.Locality.toLowerCase().includes(searchQuery) ||
                request.Subjects.some(subject => subject.SubjectName.toLowerCase().includes(searchQuery));

            const isBudgetMatch = budget === '' || request.minBudget.toString().includes(budget) || request.maxBudget.toString().includes(budget);

            return isSearchMatch && isBudgetMatch;
        });

        setFilteredData(filtered);
        setCurrentPage(0);
    }, [searchQuery, budget, requests]);

    const deleteRequest = (id) => {
        // Implement delete logic
        console.log('Delete request with id:', id);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageData = filteredData.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    const addComment = async () => {
        console.log(comment)
        console.log(selectedRequest)
        try {
            const response = await axios.post(`http://localhost:7000/api/v1/student/Add-Comment`, {
                id: selectedRequest._id,
                Comment: comment
            })
            console.log(response.data)
        } catch (error) {

        }
    }



    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">All Teacher Requests</h1>

            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search  by Class Name, Student Name, Class Option, Location, Subjects"
                    className="border w-full px-4 py-2 rounded"
                />
                <input
                    type="text"
                    value={budget}
                    onChange={handleBudgetChange}
                    placeholder="Filter by Budget"
                    className="border w-full px-4 py-2 rounded"
                />
            </div>

            {filteredData.length === 0 ? (
                <p className="text-center text-gray-500">No requests available.</p>
            ) : (
                <>
                    <table className="min-w-full mx-auto divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type of Class</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender Preference</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locality</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specific Requirement</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal Done</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentPageData.map((request) => (
                                <tr key={request._id}>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap hover:underline hover:text-red-400">
                                        <Link to={`/Student-info/${request.StudentId}`}>{request.StudentInfo.StudentName}</Link>
                                    </td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap">{request.ClassName}</td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap">
                                        {request.Subjects.map((subject) => subject.SubjectName).join(', ')}
                                    </td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap">{request.InterestedInTypeOfClass}</td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap">{request.TeacherGenderPreference}</td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap">Rs {request.minBudget} - {request.maxBudget}</td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap">{request.Locality}</td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap">{request.StartDate}</td>
                                    <td className="px-4 py-2 text-sm ">{request.SpecificRequirement.substring(0, 25) + '...'}</td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap">{request.DealDone ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openCommentModal(request)}
                                                className={`gap-1 text-sm flex items-center justify-center rounded border border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-1 font-semibold text-blue-600 hover:opacity-70 ${isCommentModalOpen && 'opacity-50 cursor-not-allowed'}`}
                                            >
                                                View Comments
                                            </button>
                                            <button
                                                onClick={() => openAddCommentModal(request)}
                                                className={`gap-1 text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-70 ${isAddCommentModalOpen && 'opacity-50 cursor-not-allowed'}`}
                                            >
                                                Add Comment
                                            </button>
                                            <button
                                                onClick={() => deleteRequest(request._id)}
                                                className="gap-1 text-sm flex items-center justify-center rounded border border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-4 py-1 font-semibold text-red-600 hover:opacity-70"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-center mt-4">
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}

                            activeClassName={'active'}
                            containerClassName="flex items-center justify-center mt-4"
                            pageClassName="mx-1"
                            pageLinkClassName="bg-red-400 px-4 py-1 border border-gray-300 rounded-lg hover:bg-red-500"
                            previousClassName="mx-1"
                            previousLinkClassName="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                            nextClassName="mx-1"
                            nextLinkClassName="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-indigo-400 bg-gradient-to-r from-indigo-100 to-indigo-200 px-4 py-1 font-semibold text-indigo-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                            breakClassName="mx-1"
                            breakLinkClassName="bg-red-400 px-4 py-1 border border-gray-300 rounded-lg hover:bg-red-500"

                        />
                    </div>
                </>
            )}

            {/* View Comments Modal */}
            {isCommentModalOpen && selectedRequest && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-1/2">
                        <h2 className="text-lg font-bold mb-4">Comments for {selectedRequest.StudentInfo.StudentName}</h2>
                        <ul className="list-disc pl-5">
                            {selectedRequest.CommentByAdmin && selectedRequest.CommentByAdmin.length > 0 ? (
                                selectedRequest.CommentByAdmin.map((comment, index) => (
                                    <li key={index} className="mb-2">
                                        {comment.Comment} <span className='text-red-400 font-bold underline'> On Date</span> {new Date(comment.Date).toLocaleString()}
                                    </li>

                                ))
                            ) : (
                                <li>No comments available.</li>
                            )}
                        </ul>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeCommentModal}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Comment Modal */}
            {isAddCommentModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-1/2">
                        <h2 className="text-lg font-bold mb-4">Add Comment</h2>
                        <textarea
                            className="w-full h-32 p-2 border border-gray-300 rounded"
                            value={comment}
                            name='comment'
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Enter your comment here..."
                        ></textarea>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeAddCommentModal}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                onClick={addComment}
                            >
                                Add Comment
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default TeacherRequests;
