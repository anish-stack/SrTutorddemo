import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AllTeacher } from '../../Slices/Teacher.slice';
import Loading from '../../components/Loading/Loading';
import { MdVerifiedUser } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { Link } from 'react-router-dom'
import axios from 'axios'
import AdvancedSearchModel from './AdvancedSearchModel';
const PAGE_SIZE = 10; // Number of teachers per page

const Teacher = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.Teacher);
    const [show, setShow] = useState(false);
    const [teacherData, setTeacherData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const handleAdvancedClick = () => {
        setShow(true);
    };
    const handleCloseAdvancedClick = () => {
        setShow(false);
    };
    useEffect(() => {
        dispatch(AllTeacher());
    }, [dispatch]);

    useEffect(() => {
        if (data && data.data) {
            setTeacherData(data.data); // Assuming data.data is an array of teachers
            setFilteredData(data.data);
        }
    }, [data]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(filteredData.length / PAGE_SIZE)) {
            setCurrentPage(page);
        }
    };

    const handleFilter = (e) => {
        const value = e.target.value.toLowerCase();
        const filtered = teacherData.filter(teacher =>
            teacher.TeacherName.toLowerCase().includes(value) ||
            teacher.Email.toLowerCase().includes(value) ||
            teacher.PhoneNumber.toLowerCase().includes(value)
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page after filtering
    };

    const handleTopTeacherFilter = (e) => {
        const checked = e.target.checked;
        const filtered = teacherData.filter(teacher =>
            checked ? teacher.isTopTeacher : true
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page after filtering
    };
    const handleVerifedTeacherFilter = (e) => {
        const checked = e.target.checked;
        const filtered = teacherData.filter(teacher =>
            checked ? teacher.isTeacherVerified : true
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page after filtering
    };

    const makeVerifed = async (teacherId, stauts) => {
        try {
            const res = await axios.post(`https://api.srtutorsbureau.com/api/v1/uni/Make-teacher-Verified?teacherId=${teacherId}&status=${stauts}`)
            dispatch(AllTeacher());
        } catch (error) {
            console.log(error)

        }
    }



    const handleProfiledTeacherFilter = (e) => {
        const checked = e.target.checked;
        const filtered = teacherData.filter(teacher =>
            checked ? teacher.TeacherProfile : true
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page after filtering
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Pagination Logic
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedData = (filteredData || []).slice(startIndex, startIndex + PAGE_SIZE);
    const totalPages = Math.ceil((filteredData || []).length / PAGE_SIZE);
    console.log(paginatedData)
    return (
        <div className="w-full h-screen overflow-auto py-5 px-4">
            <h2 className="text-xl font-semibold mb-4">All Teachers</h2>

            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">

                <div className="search">
                    <input placeholder="Search by name or email or Phone Number"
                        onChange={handleFilter} type="text" className="search__input" />
                    <button className="search__button">
                        <svg className="search__icon" aria-hidden="true" viewBox="0 0 24 24">
                            <g>
                                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                            </g>
                        </svg>
                    </button>
                </div>

                <label className="mt-4 md:mt-0 flex items-center">
                    <div className="checkbox-wrapper-12">
                        <div className="cbx">
                            <input onChange={handleTopTeacherFilter} type="checkbox" className='mr-2' />
                            <label for="cbx-12"></label>
                            <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
                                <path d="M2 8.36364L6.23077 12L13 2"></path>
                            </svg>
                        </div>

                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <filter id="goo-12">
                                    <feGaussianBlur result="blur" stdDeviation="4" in="SourceGraphic"></feGaussianBlur>
                                    <feColorMatrix result="goo-12" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" mode="matrix" in="blur"></feColorMatrix>
                                    <feBlend in2="goo-12" in="SourceGraphic"></feBlend>
                                </filter>
                            </defs>
                        </svg>
                    </div>
                    <p className='ml-2'>   Show Top Teachers</p>

                </label>
                <label className="mt-4 md:mt-0 flex items-center">
                    <div className="checkbox-wrapper-12">
                        <div className="cbx">
                            <input onChange={handleVerifedTeacherFilter} type="checkbox" className='mr-2' />
                            <label for="cbx-12"></label>
                            <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
                                <path d="M2 8.36364L6.23077 12L13 2"></path>
                            </svg>
                        </div>

                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <filter id="goo-12">
                                    <feGaussianBlur result="blur" stdDeviation="4" in="SourceGraphic"></feGaussianBlur>
                                    <feColorMatrix result="goo-12" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" mode="matrix" in="blur"></feColorMatrix>
                                    <feBlend in2="goo-12" in="SourceGraphic"></feBlend>
                                </filter>
                            </defs>
                        </svg>
                    </div>
                    <p className='ml-2'>Show Verified Teachers</p>
                </label>
                <label className="mt-4 md:mt-0 flex items-center">

                    <div className="checkbox-wrapper-12">
                        <div className="cbx">
                            <input onChange={handleProfiledTeacherFilter} type="checkbox" className='mr-2' id="cbx-12" />
                            <label for="cbx-12"></label>
                            <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
                                <path d="M2 8.36364L6.23077 12L13 2"></path>
                            </svg>
                        </div>

                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <filter id="goo-12">
                                    <feGaussianBlur result="blur" stdDeviation="4" in="SourceGraphic"></feGaussianBlur>
                                    <feColorMatrix result="goo-12" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" mode="matrix" in="blur"></feColorMatrix>
                                    <feBlend in2="goo-12" in="SourceGraphic"></feBlend>
                                </filter>
                            </defs>
                        </svg>
                    </div>

                    <p className='ml-2'> Show Which have Profiled Teachers</p>
                </label>
                {/* <div>
                    <button onClick={handleAdvancedClick} className='bg-indigo-400 px-2 py-2 text-white text-sm rounded-3xl'>Advanced Search</button>
                </div> */}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Verified</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Date</th>

                            {/* <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Profile</th> */}

                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((teacher) => (
                            <tr key={teacher._id} className="border-b cursor-pointer hover:bg-gray-50">
                                <td className="py-1 whitespace-nowrap px-4 text-sm text-gray-900">{teacher.TeacherName}</td>
                                <td className="py-1 whitespace-nowrap px-4 text-sm text-gray-600">{teacher.PhoneNumber}</td>
                                <td className="py-1 whitespace-nowrap px-4 text-sm text-gray-600">{teacher.Email}</td>
                                <td className="py-2 px-4 text-center border-b">{teacher.isTeacherVerified ? <MdVerifiedUser className='text-3xl  text-green-400' /> : <IoIosCloseCircle className='text-3xl  text-red-400' />}</td>
                                <td className="py-1 whitespace-nowrap px-4 text-sm text-gray-600">{new Date(teacher?.createdAt || "Not-Available").toDateString('en-US')}</td>
                                <td className="py-1 whitespace-nowrap px-4 text-sm">
                                    {teacher.TeacherProfile ? (
                                        <>
                                            <Link
                                                to={`${teacher._id}`}
                                                className="inline-flex mr-4 whitespace-nowrap overflow-hidden cursor-pointer items-center gap-1 rounded border border-slate-300 bg-gradient-to-b from-slate-50 to-slate-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-2 active:opacity-100"
                                            >
                                                Check Profile
                                            </Link>
                                            {teacher.TeacherProfile.srVerifiedTag ? (
                                                <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-200">
                                                    SR Verified
                                                </button>
                                            ) : (
                                                <button onClick={() => makeVerifed(teacher.TeacherProfile._id, true)} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                                                    Make SR Verified
                                                </button>
                                            )}

                                        </>
                                    ) : (
                                        <button
                                            disabled={true}
                                            className="inline-flex whitespace-nowrap overflow-hidden cursor-not-allowed items-center gap-1 rounded border border-slate-300 bg-gradient-to-b from-red-50 to-red-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-2 active:opacity-100"

                                        >
                                            Onboarding Not Complete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center gap-4 items-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-300 cursor-pointer px-4 py-2 rounded-md"
                >
                    Previous
                </button>
                <span className="self-center">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-red-600 text-white px-4 py-2 cursor-pointer rounded-md"
                >
                    Next
                </button>
            </div>
            <AdvancedSearchModel handleCloseAdvancedClick={handleCloseAdvancedClick} Show={show} />
        </div>
    );
};

export default Teacher;
