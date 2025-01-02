import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AllTeacher } from "../../Slices/Teacher.slice";
import { MdVerifiedUser, MdSearch, MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";

const PAGE_SIZE = 10;

const Teacher = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.Teacher);
    const [teacherData, setTeacherData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const [jumpToPage, setJumpToPage] = useState("");

    useEffect(() => {
        dispatch(AllTeacher());
    }, [dispatch]);

    useEffect(() => {
        if (data?.data) {
            setTeacherData(data.data);
            setFilteredData(data.data);
        }
    }, [data]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            setJumpToPage("");
        }
    };

    const handleJumpToPage = (e) => {
        e.preventDefault();
        const pageNum = parseInt(jumpToPage);
        if (pageNum > 0 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
            setJumpToPage("");
        }
    };

    const handleFilter = (e) => {
        const value = e.target.value.toLowerCase();
        const filtered = teacherData.filter(
            (teacher) =>
                teacher.TeacherName.toLowerCase().includes(value) ||
                teacher.Email.toLowerCase().includes(value) ||
                teacher.PhoneNumber.toLowerCase().includes(value)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const handleFilterChange = (filterType) => (e) => {
        const checked = e.target.checked;
        const filtered = teacherData.filter((teacher) => {
            switch (filterType) {
                case 'top':
                    return checked ? teacher.isTopTeacher : true;
                case 'verified':
                    return checked ? teacher.isTeacherVerified : true;
                case 'profile':
                    return checked ? teacher.TeacherProfile : true;
                default:
                    return true;
            }
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const makeVerified = async (teacherId, status) => {
        try {
            await axios.post(
                `https://api.srtutorsbureau.com/api/v1/uni/Make-teacher-Verified?teacherId=${teacherId}&status=${status}`
            );
            dispatch(AllTeacher());
        } catch (error) {
            console.error(error);
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
                Error: {error}
            </div>
        );
    }

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);
    const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

    return (
        <div className="w-full min-h-screen  bg-gray-50">

            {/* Search and Filters */}
            <div className="space-y-4  mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone number..."
                        onChange={handleFilter}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Show Top Teachers', type: 'top' },
                        { label: 'Show Verified Teachers', type: 'verified' },
                        { label: 'Show Profiled Teachers', type: 'profile' }
                    ].map(({ label, type }) => (
                        <label key={type} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                            <input
                                type="checkbox"
                                onChange={handleFilterChange(type)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Name', 'Phone', 'Email', 'Verified', 'Added By', 'Date', 'Profile'].map((header) => (
                                <th key={header} className="px-6 py-3 text-left whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((teacher) => (
                            <tr key={teacher._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {teacher.TeacherName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {teacher.PhoneNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {teacher.Email.substring(0, 12) + ' ...'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {teacher.isTeacherVerified ? (
                                        <MdVerifiedUser className="text-2xl text-green-500 inline" />
                                    ) : (
                                        <IoIosCloseCircle className="text-2xl text-red-500 inline" />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${teacher.isAddedByAdmin ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {teacher.isAddedByAdmin ? 'By Admin' : 'Self'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(teacher?.createdAt || "Not-Available").toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {teacher.TeacherProfile ? (
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                to={`${teacher._id}`}
                                                className="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                            >
                                                View Profile
                                            </Link>
                                            {teacher.TeacherProfile.srVerifiedTag ? (
                                                <span className="px-3 py-1 rounded-md bg-green-50 text-green-700">
                                                    SR Verified
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => makeVerified(teacher.TeacherProfile._id, true)}
                                                    className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                                >
                                                    Make SR Verified
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <span className="px-3 py-1 rounded-md bg-red-50 text-red-700">
                                                Incomplete
                                            </span>
                                            <Link
                                                to={`/Complete-Profile-Ist_Step/${teacher._id}`}
                                                className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                            >
                                                Complete Ist Step
                                            </Link>
                                            <Link
                                                to={`/Complete-Profile/${teacher._id}`}
                                                className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                            >
                                                Complete Profile
                                            </Link>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex items-center px-4 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdNavigateBefore className="mr-1" /> Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
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
    );
};

export default Teacher;