import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useEffect } from 'react';

const AddCommentModal = ({ isOpen, onClose, onAddComment, initialComment = '' }) => {
    const [comment, setComment] = useState(initialComment);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setComment(initialComment);
    }, [initialComment]);

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await onAddComment(comment);
            onClose(); // Close the modal on success
        } catch (err) {
            setError('Error adding comment.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
                <h2 className="text-lg font-bold mb-2">Add Comment</h2>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 mb-2"
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        {loading ? 'Adding...' : 'Add Comment'}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddCommentModal;
