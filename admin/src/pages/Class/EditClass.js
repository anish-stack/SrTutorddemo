import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import toast from 'react-hot-toast';
import { IoIosRemoveCircleOutline, IoMdAdd } from 'react-icons/io';
import { RxUpdate } from 'react-icons/rx';

const EditClass = () => {
    const { id } = useParams();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const Token = localStorage.getItem('Sr-token');
    const [activeTab, setActiveTab] = useState('class'); // state to manage active tab
    const [formData, setFormData] = useState({
        Class: '',
        InnerClasses: [{ InnerClass: '' }],
        Subjects: [{ SubjectName: '' }]
    });

    const fetchClass = async () => {
        try {
            const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/admin/Get-Classes`);
            const data = response.data.data;
            const filterData = data.find(item => item._id === id);
            console.log(filterData);

            if (filterData) {
                setClassData(filterData);
                setFormData({
                    Class: filterData.Class || '',
                    InnerClasses: filterData.InnerClasses || [{ InnerClass: '' }],
                    Subjects: filterData.Subjects || [{ SubjectName: '' }]
                });
            } else {
                setError("Class not found");
            }
        } catch (error) {
            setError("An error occurred while fetching the class data");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClass();
    }, [id]);

    const handleChange = (e, index, type) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            if (type === 'class') {
                return { ...prevData, [name]: value };
            } else if (type === 'innerClass') {
                const newInnerClasses = [...prevData.InnerClasses];
                newInnerClasses[index] = { ...newInnerClasses[index], [name]: value };
                return { ...prevData, InnerClasses: newInnerClasses };
            } else if (type === 'subject') {
                const newSubjects = [...prevData.Subjects];
                newSubjects[index] = { ...newSubjects[index], [name]: value };
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

    const addSubject = () => {
        setFormData((prevData) => ({
            ...prevData,
            Subjects: [...prevData.Subjects, { SubjectName: '' }]
        }));
    };

    const removeSubject = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            Subjects: prevData.Subjects.filter((_, i) => i !== index)
        }));
    };

    const handleSubjectNameEdit = async (subjectId, updatedSubjectName) => {
        try {
            const response = await axios.post(
                `https://api.srtutorsbureau.com/api/v1/admin/Edit-Subject/${id}`,
                {
                    SubjectId: subjectId,
                    UpdatedSubjectName: updatedSubjectName
                },
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }
            );
            toast.success('Subject updated successfully');
            console.log(response.data);
            fetchClass();
        } catch (error) {
            toast.error('Failed to update subject');
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axios.put(`https://api.srtutorsbureau.com/api/v1/admin/Edit-Class/${id}`, {
                UpdatedClassName: formData.Class,
                UpdatedInnerClasses: formData.InnerClasses
            }, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            toast.success('Class updated successfully');
            console.log(response.data);
            setLoading(false)

            fetchClass();
        } catch (error) {
            setLoading(false)

            toast.error('Failed to update class');
            console.log(error);
        }
    };

    const handleDeleteSubject = async (subject_id) => {
        try {
            await toast.promise(
                axios.delete(`https://api.srtutorsbureau.com/api/v1/admin/delete-Class/${id}/${subject_id}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }),
                {
                    loading: 'Deleting...',
                    success: <b>Subject deleted successfully!</b>,
                    error: <b>Could not delete subject.</b>,
                }
            );
            fetchClass();
        } catch (error) {
            console.error("Error deleting subject:", error);
        }
    };

    if (loading) return <Loading />;
    if (error) return <div>{error}</div>;

    return (
        <>
            <div className="flex p-5 justify-center mb-4">
                <button
                    onClick={() => setActiveTab('class')}
                    className={`px-4 py-2 border-b-2 ${activeTab === 'class' ? 'border-blue-500' : 'border-transparent'} focus:outline-none`}
                >
                    Edit Class Name
                </button>
                <button
                    onClick={() => setActiveTab('subjects')}
                    className={`px-4 py-2 border-b-2 ${activeTab === 'subjects' ? 'border-blue-500' : 'border-transparent'} focus:outline-none`}
                >
                    Edit Subjects
                </button>
            </div>

            {activeTab === 'class' && (
                <div>
                    <div className="max-w-3xl mx-auto p-2">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold mb-4">Edit Class</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium">Class Name:</label>
                                    <input
                                        type="text"
                                        name="Class"
                                        value={formData.Class}
                                        onChange={(e) => handleChange(e, null, 'class')}
                                        className="p-2 border border-gray-300 rounded-lg w-full"
                                        required
                                    />
                                </div>
                                {formData.InnerClasses.map((innerClass, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                                        <input
                                            type="text"
                                            name="InnerClass"
                                            value={innerClass.InnerClass || ''}
                                            onChange={(e) => handleChange(e, index, 'innerClass')}
                                            className="p-2 border border-gray-300 rounded-lg flex-1"
                                            placeholder="Inner Class"
                                            required
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
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full cursor-pointer items-center gap-1 rounded border border-blue-300 bg-gradient-to-b from-blue-50 to-blue-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-300 focus-visible:ring-offset-2 active:opacity-100"
                                >
                                    {loading ?'Please Wait...':"Submit"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'subjects' && (
                <div>
                    <div className="max-w-7xl mx-auto p-2">
                        <div className="bg-white p-4 rounded-lg shadow-xl">
                            <h2 className="text-2xl font-semibold mb-4">Edit Subjects</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {formData.Subjects.map((subject, index) => (
                                    <div key={index} className="items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                                        <input
                                            type="text"
                                            name="SubjectName"
                                            value={subject.SubjectName || ''}
                                            onChange={(e) => handleChange(e, index, 'subject')}
                                            className="p-3 border w-full border-gray-300 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Subject Name"
                                            required
                                        />
                                        <div className="flex mt-5 items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSubject(subject._id)}
                                                className="whitespace-nowrap gap-1 mt-2 flex items-center justify-center rounded border text-xs border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-4 py-1 font-semibold text-red-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                                disabled={formData.Subjects.length <= 1}
                                            >
                                                Remove <IoIosRemoveCircleOutline />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleSubjectNameEdit(subject._id, subject.SubjectName)}
                                                className="whitespace-nowrap gap-1 mt-2 text-xs flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                            >
                                                Update <RxUpdate />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addSubject}
                                className="w-full flex justify-center cursor-pointer items-center gap-1 rounded border border-green-300 bg-gradient-to-b from-green-50 to-green-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-300 focus-visible:ring-offset-2 active:opacity-100"
                            >
                                Add Subject <IoMdAdd />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default EditClass;
