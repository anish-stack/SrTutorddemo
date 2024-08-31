import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClassSearch } from '../../Slices/Class.slice';
import Modal from 'react-modal';
import ReactPaginate from 'react-paginate';
import { FaSearch, FaTimes } from 'react-icons/fa'; // Example icons
import { IoIosEye } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { ImBin } from "react-icons/im";
import { Link } from 'react-router-dom';
import { PiStudent } from "react-icons/pi";
import axios from 'axios';
import toast from 'react-hot-toast';
Modal.setAppElement('#root'); // Set the root element for accessibility
const AllClass = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.Class);
    const Token = localStorage.getItem('Sr-token');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState(null); // State for selected class
    const itemsPerPage = 12; // Number of items per page

    useEffect(() => {
        dispatch(ClassSearch());
    }, [dispatch]);

    // Handle modal open/close
    const openModal = (classData) => {
        setSelectedClass(classData);
        setModalIsOpen(true);
    };
    const closeModal = () => setModalIsOpen(false);

    // Pagination logic
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Search functionality
    const filteredData = data.filter((item) =>
        item.Class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Subjects.some(subject => subject.SubjectName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const paginatedData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleDelete = async (id) => {
        try {
            await toast.promise(
                axios.delete(`http://localhost:7000/api/v1/admin/delete-Class/${id}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }),
                {
                    loading: 'Deleting...',
                    success: <b>Subject deleted successfully!</b>,
                    error: <b>Could not delete class.</b>,
                }
            );
            dispatch(ClassSearch());
            // Optionally, you may want to refresh the data or update the UI after successful deletion
        } catch (error) {
            // You might want to handle additional error processing here if necessary
            console.error('Error deleting class:', error);
        }
    };




    return (
        <div className="p-4 min-h-screen">

            <div>
                <div className='flex items-baseline justify-between'>
                    <div>
                        <h2 className="text-2xl mb-4">All Classes</h2>
                    </div>
                    <div>
                        <Link to={'/Add-New-Class'} className='inline-flex cursor-pointer items-center gap-1 rounded border border-red-300 bg-gradient-to-b from-red-50 to-red-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-300 focus-visible:ring-offset-2 active:opacity-100'>  <PiStudent /> Add classes</Link>
                    </div>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by class or subject name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Class Modal"
                className="modal max-w-4xl h-[700px] overflow-auto mx-auto p-4 bg-white rounded-lg shadow-lg relative"
                overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50"
            >
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-600"
                >
                    <FaTimes className="text-xl" />
                </button>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">Error: {error.message}</p>}
                {selectedClass && selectedClass.Subjects && selectedClass.Subjects.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                            {selectedClass.Subjects.map((subject, index) => (
                                <div key={index} className="border border-gray-300 p-4 rounded-lg shadow-md bg-white">
                                    <h3 className="text-lg font-semibold">{subject.SubjectName}</h3>
                                    <p><strong>Class:</strong> {selectedClass.Class}</p>
                                </div>
                            ))}
                        </div>

                    </>
                ) : (
                    <p>No subjects available.</p>
                )}
            </Modal>

            {/* Optionally display some data on the main view */}
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error.message}</p>}
            <div className="grid min-h-[72vh] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedData && paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                        <div key={index} className="border border-gray-300 p-4 rounded-lg shadow-md bg-white">
                            <h3 className="text-lg font-semibold">{item.Class}</h3>
                            <p className="max-h-12 overflow-hidden">
                                <strong>Subjects:</strong> {truncateText(item.Subjects.map(subject => subject.SubjectName).join(', '), 50)}
                            </p>
                            <div className='grid grid-cols-3 w-full gap-1'>
                                <button
                                    onClick={() => openModal(item)}
                                    className="whitespace-nowrap  w-full gap-1  mt-2  text-sm flex items-center justify-center rounded border border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-1 font-semibold text-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >
                                    <IoIosEye className=' text-xl'/>
                                  
                                </button>
                                <Link
                                    to={`/Edit-Class/${item._id}`}
                                    className="whitespace-nowrap  w-full gap-1  mt-2  text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >
                                    <CiEdit className=' text-xl' />
                                 
                                </Link>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="whitespace-nowrap  w-full gap-1  mt-2  text-sm flex items-center justify-center rounded border border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-4 py-1 font-semibold text-red-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >
                                    <ImBin className='text-xl' />
                                   
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No classes available.</p>
                )}

            </div>
            <ReactPaginate
                pageCount={Math.ceil(data.length / itemsPerPage)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                containerClassName="flex items-center justify-center "
                pageClassName="mx-1"
                pageLinkClassName="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-200"
                previousClassName="mx-1"
                previousLinkClassName="whitespace-nowrap  w-full gap-1    text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                nextClassName="mx-1"
                nextLinkClassName="whitespace-nowrap  w-full gap-1    text-sm flex items-center justify-center rounded border border-indigo-400 bg-gradient-to-r from-indigo-100 to-indigo-200 px-4 py-1 font-semibold text-indigo-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                breakClassName="mx-1"
                breakLinkClassName="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-200"
                // activeClassName="bg-red-500 text-white"
            />
        </div>
    );
};

export default AllClass;
