import React, { useState, useRef, useCallback } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateTemplate = () => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const editor = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://sr.apnipaathshaala.in/api/v1/admin/add-template', {
                subject,
                message: content,
            });
            toast.success('Template added successfully!');
            setSubject('');
            setContent('');
        } catch (error) {
            toast.error('Error adding template!');
            console.error('There was an error adding the template!', error);
        }
    };



    const handleContentChange = useCallback((newContent) => {
        setContent(newContent);
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-4">Add New Template</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                    <label htmlFor="templateSubject" className="block text-gray-700 mb-1">Subject</label>
                    <input
                        type="text"
                        id="templateSubject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="templateContent" className="block text-gray-700 mb-1">Message</label>
                    <JoditEditor
                        ref={editor}
                        value={content}
                        onChange={handleContentChange}
                        config={{
                            readonly: false
                        }}
                    />
                </div>
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-1 font-semibold text-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                        >
                        Add Template
                    </button>

                </div>
            </form>
        </div>
    );
};

export default CreateTemplate;
