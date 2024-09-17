import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { IoIosEye } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';
import { ImBin } from 'react-icons/im';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GetTestimonials } from '../../Slices/Testinomial.slice';
import { MdToggleOn, MdToggleOff } from "react-icons/md";

const AllTestinomial = () => {
    const [testimonials, setTestimonials] = useState([]);
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.Testimonials);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 12;
    const Token = localStorage.getItem('Sr-token');

    useEffect(() => {
        dispatch(GetTestimonials());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            setTestimonials(data);
        } else if (error) {
            console.error(`Error In Fetching: ${error}`);
        }
    }, [data, error]);

    if (loading) {
        return <Loading />;
    }

    const handleDeleteTest = async (id) => {
        try {
            await toast.promise(
                axios.delete(`https://sr.apnipaathshaala.in/api/v1/admin/Delete-Testimonial/${id}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }),
                {
                    loading: 'Deleting...',
                    success: <b>Testimonial deleted successfully!</b>,
                    error: <b>Could not delete Testimonial.</b>,
                }
            );
            dispatch(GetTestimonials());
        } catch (error) {
            console.error('Error deleting Testimonial:', error);
        }
    };

    const toggleStatusOfReview = async (id) => {
        try {
            await axios.post(`https://sr.apnipaathshaala.in/api/v1/admin/Toggle-Testimonial-Status/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            dispatch(GetTestimonials()); // Refresh the testimonials after status toggle
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const paginatedData = testimonials.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="w-full py-3 px-4">
            <div className="heading flex items-center justify-between mt-3">
                <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                    All Review
                </h1>
                <Link
                    to="/create-Review"
                    className="whitespace-nowrap gap-1 text-xl flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                >
                    Create Review
                </Link>
            </div>
            <div className="max-w-7xl grid cursor-pointer grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-auto py-4">
                {paginatedData.length > 0 ? (
                    paginatedData.reverse().map((item, index) => (
                        <div
                            key={index}
                            className="relative flex flex-col rounded-lg bg-white shadow-lg overflow-hidden transition-transform cursor-pointer"
                        >
                            <div className="flex cursor-pointer items-center p-4 border-b border-gray-200">
                                <img
                                    src={item.userImage || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"}
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevents an infinite loop if the fallback image fails
                                        e.target.src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80';
                                    }}
                                    alt={item.Name}
                                    loading='lazy'
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <h5 className="text-lg font-semibold text-gray-800">
                                        {item.Name}
                                    </h5>
                                    <div className="flex items-center mt-1">
                                        {Array.from({ length: item.Rating }).map((_, i) => (
                                            <svg
                                                key={i}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-5 h-5 text-yellow-500"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-700">
                                    {item.Text}
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-2 py-2 px-2">
                                <div>
                                    <button
                                        onClick={() => toggleStatusOfReview(item._id)}
                                        className={`p-2 rounded-full transition duration-300 ${item.isActive
                                            ? 'text-green-600 bg-green-200 hover:bg-green-300'
                                            : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
                                            }`}
                                    >
                                        {item.isActive ? <MdToggleOn className="w-6 h-6" /> : <MdToggleOff className="w-6 h-6" />}
                                    </button>
                                </div>

                                {/* <Link
                                    to={`/Edit-review/${item._id}`}
                                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >
                                    <CiEdit />
                                </Link> */}
                                <button
                                    onClick={() => handleDeleteTest(item._id)}
                                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-4 py-1 font-semibold text-red-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >
                                    <ImBin />
                                </button>
                            </div>
                            <span className={`bg-indigo-100 absolute top-0 right-0 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300`}>
                                {item.isActive ? 'Active' : 'De-active'}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No testimonials found.</p>
                )}
            </div>

            <ReactPaginate
                pageCount={Math.ceil(testimonials.length / itemsPerPage)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                containerClassName="flex items-center justify-center mt-4"
                pageClassName="mx-1"
                pageLinkClassName="bg-red-400 px-4 py-1 border border-gray-300 rounded-lg hover:bg-red-500"
                previousClassName="mx-1"
                previousLinkClassName="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                nextClassName="mx-1"
                nextLinkClassName="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-indigo-400 bg-gradient-to-r from-indigo-100 to-indigo-200 px-4 py-1 font-semibold text-indigo-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                breakClassName="mx-1"
                breakLinkClassName="bg-red-400 px-4 py-1 border border-gray-300 rounded-lg hover:bg-red-500"
                activeClassName="rounded-lg "
            />
        </div>
    );
};

export default AllTestinomial;
