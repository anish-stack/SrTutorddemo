import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';

const CommentModal = ({ isOpen, onClose, comments }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
                <h2 className="text-lg font-bold mb-2">Comments</h2>
                <div className="space-y-2 mb-4">
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                           <div className='flex items-center justify-between'>
                            <p key={index} className="text-sm text-gray-700">{comment.comment}</p>
                            <p key={index} className="text-sm text-gray-700">{new Date(comment.date).toLocaleDateString()}</p>

                           </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No comments available.</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Close
                </button>
            </div>
        </div>,
        document.body
    );
};

export default CommentModal;
