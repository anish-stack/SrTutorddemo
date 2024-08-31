import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MdVerifiedUser } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
const AllStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const Token = localStorage.getItem('Sr-token');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/v1/student/get-all-students', {
                    headers: {
                        Authorization: `Bearer ${Token}` // Replace with your actual token or state variable
                    }
                });
                setStudents(response.data.data);
            } catch (err) {
                setError('Failed to fetch students.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleDeleteStudent = async (studentId) => {
        try {
            await toast.promise(
                axios.delete(`http://localhost:7000/api/v1/student/delete/${studentId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}` // Replace with your actual token or state variable
                    }
                }),
                {
                    loading: 'Deleting...',
                    success: 'Student deleted successfully!',
                    error: 'Could not delete student.'
                }
            );
            setStudents(students.filter(student => student._id !== studentId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleViewProfile = (studentId) => {
        // Navigate to the student's profile page
        window.location.href = `/student/profile/${studentId}`;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">All Students</h1>
            <table className="min-w-full text-center bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Phone Number</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Verified</th>
                        <th className="py-2 px-4 border-b">Role</th>
                        <th className="py-2 px-4 border-b">Created At</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr className=' text-center' key={student._id}>
                            <td className="py-2 px-4 border-b">{student.StudentName}</td>
                            <td className="py-2 px-4 border-b">{student.PhoneNumber}</td>
                            <td className="py-2 px-4 border-b">{student.Email}</td>
                            <td className="py-2 px-4 flex items-center justify-center text-center border-b">{student.isStudentVerified ? <MdVerifiedUser className='text-3xl  text-green-400'/> : <IoIosCloseCircle className='text-3xl  text-red-400'/>}</td>
                            <td className="py-2 px-4 border-b">{student.Role}</td>
                            <td className="py-2 px-4 border-b">{new Date(student.createdAt).toLocaleDateString()}</td>
                            <td className="py-2 px-4 flex border-b space-x-2">
                                <button
                                    onClick={() => handleViewProfile(student._id)}
                                    className="whitespace-nowrap gap-1  mt-2  text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >
                                    View Profile
                                </button>
                                <button
                                    onClick={() => handleDeleteStudent(student._id)}
                                    className="whitespace-nowrap gap-1  mt-2  text-sm flex items-center justify-center rounded border border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-4 py-1 font-semibold text-red-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllStudents;
