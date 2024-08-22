import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { IoIosRemoveCircleOutline, IoMdAdd } from "react-icons/io";
import Loading from '../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';

const AddNewsClass = () => {
    const navigate  = useNavigate()
    const Token = localStorage.getItem('Sr-token');
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        Class: '',
        Subjects: Array(3).fill({ SubjectName: '' }) // Initialize with 5 subjects
    });

    // Handle input change
    const handleChange = (e, index) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const newSubjects = [...prevData.Subjects];
            if (name === 'Class') {
                return { ...prevData, [name]: value };
            }
            newSubjects[index] = { ...newSubjects[index], [name]: value };
            return { ...prevData, Subjects: newSubjects };
        });
    };

    // Add new subject field
    const addSubject = () => {
        setFormData((prevData) => ({
            ...prevData,
            Subjects: [...prevData.Subjects, { SubjectName: '' }]
        }));
    };

    // Remove subject field
    const removeSubject = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            Subjects: prevData.Subjects.filter((_, i) => i !== index)
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const response = await axios.post(
                'https://www.sr.apnipaathshaala.in/api/v1/admin/Create-Class',
                formData,
                {
                    headers: { Authorization: `Bearer ${Token}` }
                }
            );
            console.log(response.data)
            toast.success('Class added successfully!');
            setIsLoading(false)

            setTimeout(()=>{
                navigate('/Manage-Class')
            },1000)
            // setFormData({ Class: '', Subjects: Array(5).fill({ SubjectName: '' }) });
        } catch (error) {
            console.log(error)
            setIsLoading(false)
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
                                <label className="block mb-2 text-sm font-medium">Class Name:</label>
                                <input
                                    type="text"
                                    name="Class"
                                    value={formData.Class}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                    required
                                />
                            </div>

                            {formData.Subjects.map((subject, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                                    <input
                                        type="text"
                                        name="SubjectName"
                                        value={subject.SubjectName}
                                        onChange={(e) => handleChange(e, index)}
                                        className="p-2 border border-gray-300 rounded-lg flex-1"
                                        placeholder="Subject Name"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSubject(index)}
                                        className="inline-flex cursor-pointer items-center gap-1 rounded border border-red-300 bg-gradient-to-b from-red-50 to-red-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-300 focus-visible:ring-offset-2 active:opacity-100"
                                        disabled={formData.Subjects.length <= 5} // Disable if only 5 subjects
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
