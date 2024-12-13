import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { MdVerifiedUser, MdSearch, MdNavigateNext, MdNavigateBefore, MdDelete, MdRemoveRedEye } from 'react-icons/md';
import { IoIosCloseCircle } from 'react-icons/io';

const AllStudents = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpToPage, setJumpToPage] = useState('');
    const perPage = 10;

    const Token = localStorage.getItem('Sr-token');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('https://api.srtutorsbureau.com/api/v1/student/get-all-students', {
                    headers: { Authorization: `Bearer ${Token}` }
                });
                setStudents(response.data.data);
                setFilteredStudents(response.data.data);
            } catch (err) {
                setError('Failed to fetch students.');
                toast.error('Failed to load students');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [Token]);

    useEffect(() => {
        const result = students.filter(student =>
            student.StudentName.toLowerCase().includes(filter.toLowerCase()) ||
            student.PhoneNumber.includes(filter) ||
            student.Email.toLowerCase().includes(filter.toLowerCase())
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setFilteredStudents(result);
        setCurrentPage(1);
    }, [students, filter]);

    const handleDeleteStudent = async (studentId) => {
        try {
            await toast.promise(
                axios.delete(`https://api.srtutorsbureau.com/api/v1/student/studentDelete/${studentId}`, {
                    headers: { Authorization: `Bearer ${Token}` }
                }),
                {
                    loading: 'Deleting student...',
                    success: 'Student deleted successfully!',
                    error: 'Failed to delete student'
                }
            );
            setStudents(prev => prev.filter(student => student._id !== studentId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleJumpToPage = (e) => {
        e.preventDefault();
        const pageNum = parseInt(jumpToPage);
        if (pageNum > 0 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
            setJumpToPage('');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                {error}
            </div>
        );
    }

    const indexOfLastStudent = currentPage * perPage;
    const indexOfFirstStudent = indexOfLastStudent - perPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / perPage);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">All Students</h1>
                    <div className="relative w-full sm:w-96">
                        <input
                            type="text"
                            placeholder="Search by name, phone, or email..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Name', 'Phone Number', 'Email', 'Verified', 'Role', 'Created At', 'Actions'].map((header) => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentStudents.map(student => (
                                    <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 capitalize">
                                                {student.StudentName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.PhoneNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.Email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {student.isStudentVerified ? (
                                                <MdVerifiedUser className="inline text-2xl text-green-500" />
                                            ) : (
                                                <IoIosCloseCircle className="inline text-2xl text-red-500" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                {student.Role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(student.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex space-x-2">
                                                <Link
                                                    to={`/Student-info/${student._id}`}
                                                    className="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                                >
                                                    <MdRemoveRedEye className="mr-1" /> View
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteStudent(student._id)}
                                                    className="inline-flex items-center px-3 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                                                >
                                                    <MdDelete className="mr-1" /> 
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="inline-flex items-center px-4 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <MdNavigateBefore className="mr-1" /> Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="inline-flex items-center px-4 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <MdNavigateNext className="ml-1" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <form onSubmit={handleJumpToPage} className="flex items-center space-x-2">
                            <input
                                type="number"
                                min="1"
                                max={totalPages}
                                value={jumpToPage}
                                onChange={(e) => setJumpToPage(e.target.value)}
                                placeholder="Jump to page"
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Go
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllStudents;