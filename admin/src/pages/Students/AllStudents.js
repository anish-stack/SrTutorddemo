import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { MdVerifiedUser } from 'react-icons/md';
import { IoIosCloseCircle } from 'react-icons/io';

const AllStudents = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('createdAt');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10); // Number of students per page

    const Token = localStorage.getItem('Sr-token');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('https://api.srtutorsbureau.com/api/v1/student/get-all-students', {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                setStudents(response.data.data);
                setFilteredStudents(response.data.data);
            } catch (err) {
                setError('Failed to fetch students.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [Token]);

    useEffect(() => {
        let result = students;

        // Apply filter
        if (filter) {
            result = result.filter(student =>
                student.StudentName.toLowerCase().includes(filter.toLowerCase()) ||
                student.PhoneNumber.includes(filter) ||
                student.Email.toLowerCase().includes(filter.toLowerCase())
            );
        }

        // Apply sorting
        result = result.sort((a, b) => {
            if (sort === 'createdAt') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            // Implement other sorting logic if needed
            return 0;
        });

        // Update filtered students
        setFilteredStudents(result);
    }, [students, filter, sort]);

    const handleDeleteStudent = async (studentId) => {
        try {
            await toast.promise(
                axios.delete(`https://api.srtutorsbureau.com/api/v1/student/studentDelete/${studentId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }),
                {
                    loading: 'Deleting...',
                    success: 'Student deleted successfully!',
                    error: 'Could not delete student.'
                }
            );
            setStudents(students.filter(student => student._id !== studentId));
            setFilteredStudents(filteredStudents.filter(student => student._id !== studentId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleViewProfile = (studentId) => {
        window.location.href = `/Student-info/${studentId}`;
    };

    // Pagination logic
    const indexOfLastStudent = page * perPage;
    const indexOfFirstStudent = indexOfLastStudent - perPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / perPage);
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">All Students</h1>

            {/* Filtering */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name, phone, or email"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                />
            </div>

          
           

            <table className="min-w-full text-start bg-white border border-gray-200">
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
                    {currentStudents.map(student => (
                        <tr className="text-center" key={student._id}>
                            <td className="py-2 capitalize h-11 px-4 border-b">{student.StudentName}</td>
                            <td className="py-2 h-11 px-4 border-b">{student.PhoneNumber}</td>
                            <td className="py-2 h-11 px-4 border-b">{student.Email}</td>
                            <td className="h-11 px-4 border-b flex items-center justify-center">
                                {student.isStudentVerified ? <MdVerifiedUser className="text-green-400" /> : <IoIosCloseCircle className="text-red-400" />}
                            </td>
                            <td className="py-2 h-11 px-4 border-b">{student.Role}</td>
                            <td className="py-2 h-11 px-4 border-b">{new Date(student.createdAt).toLocaleDateString()}</td>
                            <td className="py-2 h-11 px-4 flex space-x-2 justify-center">
                                <Link
                                    to={`/Student-info/${student._id}`}
                                    className="text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 transition duration-150"
                                >
                                    View Profile
                                </Link>
                                <button
                                    onClick={() => handleDeleteStudent(student._id)}
                                    className="text-sm flex items-center justify-center rounded border border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-4 py-1 font-semibold text-red-600 hover:opacity-90 transition duration-150"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-l bg-gray-100 hover:bg-gray-200"
                >
                    Previous
                </button>
                <span className="flex items-center px-4 py-2">Page {page} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-r bg-gray-100 hover:bg-gray-200"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllStudents;
