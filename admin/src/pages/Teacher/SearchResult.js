import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const SearchResult = () => {
    const { data, loading, error } = useSelector((state) => state.Advanced);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Items per page
    const [selectedTeacher, setSelectedTeacher] = useState(null); // For modal

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.results.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle changing the page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Function to handle opening the modal
    const openModal = (teacher) => setSelectedTeacher(teacher);

    // Function to handle closing the modal
    const closeModal = () => setSelectedTeacher(null);

    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Search Results</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItems.map((teacher) => (
                    <div key={teacher._id} className="bg-white relative shadow-md rounded-lg p-4">
                        <div className="flex items-center">
                            <img
                                src={teacher.Gender === 'Male' ? 'https://i.ibb.co/JnXb39p/teacher-male.png' : 'https://i.ibb.co/sCHMwHB/teacher-female.png'}
                                alt="Teacher"
                                className="w-16 h-16 rounded-full mr-4"
                            />
                            <div>
                                <h2 className="text-xl font-semibold">{teacher.FullName}</h2>
                                <p>{teacher.Qualification}</p>
                                <p>{teacher.TeachingExperience} of experience</p>
                            </div>
                        </div>
                        <div className='min-h-[12rem] overflow-auto'>
                            <p className="mt-2">{teacher.ExpectedFees} INR / month</p>
                            <p className="mt-2">Subjects: {teacher.AcademicInformation.map(info => info.SubjectNames.join(", ")).join(", ")}</p>
                            <p className="mt-2">Address: {teacher.CurrentAddress.LandMark}, {teacher.CurrentAddress.District}, {teacher.CurrentAddress.Pincode}</p>
                        </div>
                        <button
                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                            onClick={() => openModal(teacher)}
                        >
                            View More
                        </button>
                        <span className="inline-flex m-2 absolute top-0 right-0 items-center rounded-md bg-green-50 px-4 py-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">{teacher.isAllDetailVerified ? 'Verified' : 'Not-Verified'}</span>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                {Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`py-2 px-4 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Modal */}
            {selectedTeacher && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
                        <h2 className="text-2xl font-bold mb-4">{selectedTeacher.FullName}</h2>
                        <p><strong>Qualification:</strong> {selectedTeacher.Qualification}</p>
                        <p><strong>Experience:</strong> {selectedTeacher.TeachingExperience}</p>
                        <p><strong>Expected Fees:</strong> {selectedTeacher.ExpectedFees} INR / month</p>
                        <p><strong>Subjects:</strong> {selectedTeacher.AcademicInformation.map(info => info.SubjectNames.join(", ")).join(", ")}</p>
                        <p><strong>Current Address:</strong>{selectedTeacher.CurrentAddress.LandMark}, {selectedTeacher.CurrentAddress.District}, {selectedTeacher.CurrentAddress.Pincode}</p>
                        <p><strong>Permanent Address:</strong>{selectedTeacher.PermanentAddress.LandMark}, {selectedTeacher.PermanentAddress.District}, {selectedTeacher.PermanentAddress.Pincode}</p>
                        <button
                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResult;
