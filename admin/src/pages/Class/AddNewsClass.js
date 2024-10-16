import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { IoIosRemoveCircleOutline, IoMdAdd } from "react-icons/io";
import Loading from '../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';

const AddNewsClass = () => {
    const navigate = useNavigate();
    const Token = localStorage.getItem('Sr-token');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        Class: '',
        InnerClasses: [{ InnerClass: '' }],  // Start with one empty inner class
        Subjects: [{ SubjectName: '' }]  // Start with one subject
    });

    // Handle input change for Class, Subjects, and InnerClasses
    const handleChange = (e, index, type) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            if (type === 'class') {
                return { ...prevData, [name]: value };
            } else if (type === 'innerClass') {
                const newInnerClasses = [...prevData.InnerClasses];
                newInnerClasses[index][name] = value;
                return { ...prevData, InnerClasses: newInnerClasses };
            } else if (type === 'subject') {
                const newSubjects = [...prevData.Subjects];
                newSubjects[index][name] = value;
                return { ...prevData, Subjects: newSubjects };
            }
        });
    };

    // Add new InnerClass field
    const addInnerClass = () => {
        setFormData((prevData) => ({
            ...prevData,
            InnerClasses: [...prevData.InnerClasses, { InnerClass: '' }]
        }));
    };

    // Remove InnerClass field
    const removeInnerClass = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            InnerClasses: prevData.InnerClasses.filter((_, i) => i !== index)
        }));
    };

    // Add new Subject field
    const addSubject = () => {
        setFormData((prevData) => ({
            ...prevData,
            Subjects: [...prevData.Subjects, { SubjectName: '' }]
        }));
    };

    // Remove Subject field
    const removeSubject = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            Subjects: prevData.Subjects.filter((_, i) => i !== index)
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(
                'https://api.srtutorsbureau.com/api/v1/admin/Create-Class',
                formData,
                {
                    headers: { Authorization: `Bearer ${Token}` }
                }
            );
            console.log(response.data);
            toast.success('Class added successfully!');
            setIsLoading(false);

            setTimeout(() => {
                navigate('/Manage-Class');
            }, 1000);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            toast.error(error.response.data.message || 'Internal Server Error');
        }
    };

    return (
        <>
            {isLoading ? <Loading /> : (
                <div className="max-w-3xl mx-auto p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Add News Class</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Class Heading:</label>
                                <input
                                    type="text"
                                    name="Class"
                                    value={formData.Class}
                                    onChange={(e) => handleChange(e, null, 'class')}
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                    required
                                />
                            </div>

                            <h3 className="text-lg font-medium">Inner Classes</h3>
                            {formData.InnerClasses.map((innerClass, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                                    <input
                                        type="text"
                                        name="InnerClass"
                                        value={innerClass.InnerClass}
                                        onChange={(e) => handleChange(e, index, 'innerClass')}
                                        className="p-2 border border-gray-300 rounded-lg flex-1"
                                        placeholder="Inner Class"
                          
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeInnerClass(index)}
                                        className="inline-flex cursor-pointer items-center gap-1 rounded border border-red-300 bg-gradient-to-b from-red-50 to-red-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-300 focus-visible:ring-offset-2 active:opacity-100"
                                        disabled={formData.InnerClasses.length <= 1}
                                    >
                                        Remove <IoIosRemoveCircleOutline />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addInnerClass}
                                className="w-full flex justify-center cursor-pointer items-center gap-1 rounded border border-green-300 bg-gradient-to-b from-green-50 to-green-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-300 focus-visible:ring-offset-2 active:opacity-100"
                            >
                                Add Inner Class <IoMdAdd />
                            </button>

                            <h3 className="text-lg font-medium">Subjects</h3>
                            {formData.Subjects.map((subject, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                                    <input
                                        type="text"
                                        name="SubjectName"
                                        value={subject.SubjectName}
                                        onChange={(e) => handleChange(e, index, 'subject')}
                                        className="p-2 border border-gray-300 rounded-lg flex-1"
                                        placeholder="Subject Name"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSubject(index)}
                                        className="inline-flex cursor-pointer items-center gap-1 rounded border border-red-300 bg-gradient-to-b from-red-50 to-red-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-300 focus-visible:ring-offset-2 active:opacity-100"
                                        disabled={formData.Subjects.length <= 1}
                                    >
                                        Remove <IoIosRemoveCircleOutline />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addSubject}
                                className="w-full flex justify-center cursor-pointer items-center gap-1 rounded border border-green-300 bg-gradient-to-b from-green-50 to-green-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-300 focus-visible:ring-offset-2 active:opacity-100"
                            >
                                Add Subject <IoMdAdd />
                            </button>

                            <button
                                type="submit"
                                className="w-full cursor-pointer items-center gap-1 rounded border border-blue-300 bg-gradient-to-b from-blue-50 to-blue-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-300 focus-visible:ring-offset-2 active:opacity-100"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddNewsClass;
