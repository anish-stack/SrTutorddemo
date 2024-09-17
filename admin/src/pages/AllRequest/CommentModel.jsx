import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'
import Tooltip from "./Tooltip";
const CommentModel = ({ selected, onClose, isOpen, type }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]); // Initialize as an empty array
    const [isEditing, setIsEditing] = useState(null);
    const [updatedCommentText, setUpdatedCommentText] = useState('');
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (isOpen && selected) {
            handleViewComments();

        }
    }, [isOpen, selected]);

    const handleAddComment = async () => {
        setLoading(true)
        try {
            const res = await axios.post('https://sr.apnipaathshaala.in/api/v1/uni/Add-Comment-Request', {
                requestId: selected._id,
                comment,
            });
            toast.success('Comment Added Successful 👍')
            setComment('');
            handleViewComments();
            setLoading(false)

            console.log(res.data);
        } catch (error) {
            toast.error('Error In  Add Comment  ❌')
            console.log(error);
            setLoading(false)

        }
    };

    const handleViewComments = async () => {
        try {
            const res = await axios.get(`https://sr.apnipaathshaala.in/api/v1/uni/All-Comment-Request/${selected._id}`);
            console.log(res.data.data)
            setComments(res.data.data || []); // Set the comments or an empty array
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        // console.log("commentId", commentId)
        setLoading(true)

        try {
            const res = await axios.post(`https://sr.apnipaathshaala.in/api/v1/uni/delete-Comment-Request`, {
                requestId: selected._id,
                commentId
            });
            toast.success('Comment Deleted Successful 👍')
            handleViewComments();
            // window.location.reload()
            // console.log(res.data);
            setLoading(false)

        } catch (error) {
            toast.error('Error In  Deleting Comment  ❌')
            console.log(error);
            setLoading(false)

        }
    };

    const handleEditComment = async (commentId) => {
        setLoading(true)

        try {
            const res = await axios.post(`https://sr.apnipaathshaala.in/api/v1/uni/update-Comment-Request`, {
                requestId: selected._id,
                commentId,
                updatedCommentText,
            });
            setIsEditing(null);
            setUpdatedCommentText('');
            handleViewComments();
            setLoading(false)

            toast.success('Comment Updated Successful 👍')
            console.log(res.data);
        } catch (error) {
            toast.error('Error In  Updating Comment  ❌')
            console.log(error);
            setLoading(false)

        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 overflow-y-auto">
                <div className="flex  justify-between items-center border-b pb-3 mb-4">
                    <h3 className="font-bold text-xl">Comments for Request ID: {selected?._id}</h3>
                    <button
                        type="button"
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        onClick={onClose}
                    >
                        <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className='overflow-y-auto max-h-96 space-y-6'>

                    <div className="mb-4">
                        <textarea
                            className="w-full p-2 border rounded-md"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            disabled={loading}
                            className={`mt-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center ${loading ? 'cursor-not-allowed' : ''} `}
                            onClick={handleAddComment}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white mr-2"
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
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.528-1.39A6 6 0 0112 18v4a8 8 0 01-6-2.709z"
                                    ></path>
                                </svg>
                            ) : (
                                "Add Comment"
                            )}
                        </button>

                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-3">Comments:</h4>
                        {comments.length === 0 ? (
                            <p>No comments available.</p>
                        ) : (
                            <ul className="space-y-3">
                                {comments.map((c) => (
                                    <li key={c._id} className="border p-3 rounded-md">
                                        {isEditing === c._id ? (
                                            <>
                                                <textarea
                                                    className="w-full p-2 border rounded-md"
                                                    value={updatedCommentText}
                                                    onChange={(e) => setUpdatedCommentText(e.target.value)}
                                                />
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        className="py-1 px-3 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                                                        onClick={() => handleEditComment(c._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="py-1 px-3 bg-gray-400 text-white rounded hover:bg-gray-500"
                                                        onClick={() => setIsEditing(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p>{c.comment}</p>
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        className="py-1 px-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 mr-2"
                                                        onClick={() => {
                                                            setIsEditing(c._id);
                                                            setUpdatedCommentText(c.comment);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        disabled={loading}
                                                        className={`py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700 ${loading ? 'cursor-not-allowed' : ''} `}
                                                        onClick={() => handleDeleteComment(c._id)}
                                                    >
                                                        {loading ? (
                                                            <svg
                                                                className="animate-spin h-5 w-5 text-white mr-2"
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
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.528-1.39A6 6 0 0112 18v4a8 8 0 01-6-2.709z"
                                                                ></path>
                                                            </svg>
                                                        ) : (
                                                            "Delete Comment"
                                                        )}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentModel;
