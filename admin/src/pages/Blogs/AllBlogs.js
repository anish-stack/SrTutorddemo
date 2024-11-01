import React, { useEffect, useState } from 'react';
import { BlogsSearch } from '../../Slices/Blog.slice';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { IoIosEye } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';
import { ImBin } from 'react-icons/im';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import axios from 'axios';
import toast from 'react-hot-toast';

const AllBlogs = () => {
    const [Blog, setBlogs] = useState([]);
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.Blog);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;
    const Token = localStorage.getItem('Sr-token');

    useEffect(() => {
        dispatch(BlogsSearch());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            setBlogs(data);
        } else if (error) {
            console.log(`Error In Fetching ${error}`);
        }
    }, [data, error]);

    if (loading) {
        return <Loading />
    }
    const handleViewBlog = async (id) => {
        // Implement logic here
    };



    const handleDeleteBlog = async (id) => {
        try {
            await toast.promise(
                axios.delete(`https://api.srtutorsbureau.com/api/v1/admin/Delete-Blog/${id}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }),
                {
                    loading: 'Deleting...',
                    success: <b>Blog deleted successfully!</b>,
                    error: <b>Could not delete Blog.</b>,
                }
            );
            dispatch(BlogsSearch());
            // Optionally, you may want to refresh the data or update the UI after successful deletion
        } catch (error) {
            // You might want to handle additional error processing here if necessary
            console.error('Error deleting Blog:', error);
        }
    };

    const paginatedData = Blog?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="w-full py-3 px-4">
            <div className="heading flex items-center justify-between mt-3">
                <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                    All Blogs
                </h1>
                <Link
                    to="/create-blog"
                    className="whitespace-nowrap gap-1 text-xl flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                >
                    Create Blog
                </Link>
            </div>
            <div className="max-w-7xl grid grid-cols-4 gap-2 mx-auto py-2">
                {paginatedData.length > 0 ? (
                    paginatedData.reverse().map((item, index) => (
                        <div
                            key={index} // Ensure unique key for each element
                            className="relative cursor-pointer flex max-w-[18rem] shadow-xl flex-col overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700"
                        >
                            <div className="relative m-0 overflow-hidden text-gray-700 bg-transparent rounded-none shadow-none bg-clip-border">
                                <img src={item.ImageOfBlog} className='aspect-square' loading='lazy' alt={item.Headline} />
                            </div>
                            <div className="p-3">
                                <h4 className="block truncate font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                                    {item.Headline}
                                </h4>
                                <p className="block mt-3 truncate font-sans text-sm antialiased font-normal leading-relaxed text-gray-700">
                                    {item.SubHeading}
                                </p>
                            </div>
                            <span className="inline-flex absolute top-0 left-0 items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-500 text-white">
                                {new Date(item.DateOfBlog).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                            <div className="grid grid-cols-3 gap-2 py-2 px-2">
                                <Link
                                    to={`/View-Blog/${item._id}`}
                                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-1 font-semibold text-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >
                                    <IoIosEye />
                                </Link>
                                <Link
                                    to={`/Edit-Blog/${item._id}`}
                                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >
                                    <CiEdit />
                                </Link>
                                <button
                                    onClick={() => handleDeleteBlog(item._id)}
                                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-4 py-1 font-semibold text-red-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >
                                    <ImBin />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No blogs found.</p>
                )}
            </div>
            <ReactPaginate
                pageCount={Math.ceil(Blog.length / itemsPerPage)}
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

export default AllBlogs;
