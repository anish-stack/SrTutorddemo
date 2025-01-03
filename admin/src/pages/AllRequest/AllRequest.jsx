import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // Import react-hot-toast
import Swal from 'sweetalert2'
import SingleRequestModel from './SingleRequestModel';
import CommentModel from './CommentModel';
import Tooltip from './Tooltip';
import AllotTeacher from './AllotTeacher';

const AllRequest = () => {
    const [data, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const [open, setOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState()
    const [sort, setSort] = useState('createdAt');
    const [page, setPage] = useState(1);
    const [perPage] = useState(8);
    const [commentModel, setCommentModel] = useState(false)
    const [selectedComment, setSelectedComment] = useState()
    const [AllotTeacherModel, setAllotTeacherModel] = useState(false)
    // const [selectedComment, setSelectedComment] = useState()
    const Token = localStorage.getItem('Sr-token');

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const response = await axios.get('https://api.srtutorsbureau.com/api/v1/uni/get-all-universal-Request', {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                console.log(response.data.data)
                setAllData(response.data.data);
                const sortedData = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                console.log(sortedData)
                setFilteredData(sortedData);
            } catch (err) {
                setError('Failed to fetch requests.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [Token]);

    useEffect(() => {
        let result = data;

        // Apply filter
        if (filter) {
            result = result.filter(request =>
                request.className.toLowerCase().includes(filter.toLowerCase()) ||
                request.subjects.some(subject => subject.toLowerCase().includes(filter.toLowerCase())) ||
                request.studentInfo.studentName.toLowerCase().includes(filter.toLowerCase()) ||
                request.studentInfo.contactNumber.toLowerCase().includes(filter.toLowerCase())
            );
        }



        setFilteredData(result);
    }, [data, filter, sort]);

    const UpdateStatusByAdmin = async (requestId, status) => {
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/uni/Accept-Request', {
                requestId,
                status,
                requestType: "admin"
            });
            toast.success('Status updated successfully!');
            // Update the local state to reflect the status change
            setAllData(prevData =>
                prevData.map(request =>
                    request._id === requestId ? { ...request, statusOfRequest: status } : request
                )
            );
        } catch (error) {
            toast.error('Failed to update status.');
            console.error(error);
        }
    };
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 ml-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400",
            cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 ml-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        },
        buttonsStyling: false
    });
    const handleAllotModelOpen = (selectedDataItem) => {
        setAllotTeacherModel(true)
        setSelectedComment(selectedDataItem)
    }
    const handleCommentModelOpen = (selectedDataItem) => {
        setCommentModel(true)
        setSelectedComment(selectedDataItem)
    }


    const handleCommentModelClose = () => {
        setCommentModel(false)
        setAllotTeacherModel(false)
        setSelectedComment(null)
    }
    const DeleteRequest = async (requestId) => {
        try {


            // Show confirmation dialog
            const result = await swalWithBootstrapButtons.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true
            });

            // If the user confirms, proceed with the delete request
            if (result.isConfirmed) {
                // Send delete request to the server
                const response = await axios.delete(`https://api.srtutorsbureau.com/api/v1/uni/delete-Request/${requestId}`);

                // Check if deletion was successful
                if (response.data.status === 'success') {
                    // Show success message
                    swalWithBootstrapButtons.fire({
                        title: "Deleted!",
                        text: "The request has been deleted successfully.",
                        icon: "success"
                    });
                    setAllData(prevData =>
                        prevData.filter(request => request._id !== requestId)
                    );
                } else {
                    // Show error if deletion failed
                    swalWithBootstrapButtons.fire({
                        title: "Error",
                        text: "Something went wrong. The request could not be deleted.",
                        icon: "error"
                    });
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // If the user cancels the action
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "The request is safe :)",
                    icon: "error"
                });
            }
        } catch (error) {
            // Handle errors
            console.log(error)
            swalWithBootstrapButtons.fire({
                title: "Error",
                text: error.response?.data?.message || "An error occurred while deleting the request.",
                icon: "error"
            });
        }
    }

    const handleOpen = (selectedData) => {
        setOpen(true)
        setSelectedRequest(selectedData)
    }
    const handleClose = () => {
        setOpen(false)
        setSelectedRequest({})
    }

    const handleDealDone = async (id) => {
        try {
            await axios.post(`https://api.srtutorsbureau.com/api/v1/uni/deal-done-Request`, {
                requestId: id, status: true
            })
            setAllData((prevData) =>
                prevData.map((request) =>
                    request._id === id ? { ...request, dealDone: true } : request
                )
            );
            toast.success("Student Subscribed Successful")
        } catch (error) {
            console.log(error)
        }
    }


    const handleChange = (event, requestId) => {
        const newStatus = event.target.value;
        UpdateStatusByAdmin(requestId, newStatus);
    };

    // Pagination logic
    const indexOfLastRequest = page * perPage;
    const indexOfFirstRequest = indexOfLastRequest - perPage;
    const currentRequest = filteredData.slice(indexOfFirstRequest, indexOfLastRequest);
    // console.log(currentRequest)
    const totalPages = Math.ceil(filteredData.length / perPage);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };
    const [formData, setFormData] = useState({
        className: '',
        locality: '',
        subjects: [],
        teacherGenderPreference: '',
        ClassId: '',
        Area: '',
        lat: '',
        lng: '',
    });

    const handleLocationLatAndLngFetch = async (address) => {
        const options = {
            method: 'GET',
            url: `https://api.srtutorsbureau.com/geocode?address=${encodeURIComponent(address)}` // Use encodeURIComponent
        };

        try {
            const response = await axios.request(options);
            const result = response.data;

            if (result && result.formatted_address && result.latitude && result.longitude) {
                setFormData((prev) => ({
                    ...prev,
                    Area: result.formatted_address,
                    lat: result.latitude,
                    lng: result.longitude,

                    className: prev.className,
                    locality: prev.locality,
                    subjects: prev.subjects,
                    teacherGenderPreference: prev.teacherGenderPreference,
                    ClassId: prev.ClassId?._id
                }));
            } else {
                console.error("Unexpected response structure:", result);

            }

        } catch (error) {
            console.error("Error fetching location:", error);

        }
    };


    const perFromAdvanced = async (request) => {
        const { classId, className, locality, subjects, teacherGenderPreference } = request;

        // Update state with all provided values
        setFormData((prev) => ({
            ...prev,
            className: className || prev.className,
            locality: locality || prev.locality,
            subjects: subjects.length > 0 ? subjects : prev.subjects,
            teacherGenderPreference: teacherGenderPreference || prev.teacherGenderPreference,
            ClassId: classId?._id || prev.ClassId
        }));


        await handleLocationLatAndLngFetch(locality);
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/admin/make-search', formData);
            console.log(response.data)
        } catch (error) {
            console.log(error)

        }
    };



    return (
        <div>
            <div className='heading py-2 px-3 rounded-lg shadow-md mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>Manage Request  </h2>
            </div>

            <div className='flex items-start justify-start gap-1 w-full'>
                <div className="w-1/2 mb-4">
                    {/* Filtering */}
                    <input
                        type="text"
                        placeholder="Search by class, subjects, student name, etc."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>
            </div>

            <div className="w-full">
                <div className="flex flex-col overflow-x-auto">
                    <div className="sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-start text-sm font-semibold text-surface dark:text-white">
                                    <thead className="border-b border-neutral-200 font-bold dark:border-white/10">
                                        <tr>
                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Request Id</th>
                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Date</th>

                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Request Type</th>
                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Student Name</th>
                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Student Contact Number</th>
                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Class</th>
                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Subjects</th>
                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Locality</th>
                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Teacher Gender</th>
                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Teacher Allotted</th>
                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Teacher Accept</th>
                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Admin Accept</th>
                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Teacher Allot</th>

                                            <th scope="col" className="px-6 whitespace-nowrap truncate py-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRequest && currentRequest.map((request, index) => (
                                            <tr className={`border-b border-neutral-200 ${request.teacherAcceptThis === 'pending'
                                                ? ''
                                                : request.teacherAcceptThis === 'declined'
                                                    ? ''
                                                    : 'bg-green-300'
                                                } dark:border-white/10`} key={index}>
                                                <td className="whitespace-nowrap px-6 py-4 font-medium"><Link to={`/CompleteInfo/${request._id}`}>{request?.requestId || 'No'}</Link></td>
                                                <td className="whitespace-nowrap px-6 py-4">
    <span className="inline-block text-sm px-3 py-1 rounded-full bg-gray-200 text-gray-700">
        {new Date(request.createdAt).toDateString()}
    </span>
</td>


                                                <td className="whitespace-nowrap px-6 py-4">{request.requestType}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{request.studentInfo.studentName}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{request.studentInfo.contactNumber}</td>
                                                <td className="whitespace-nowrap px-6 py-4">
    <span className="inline-block text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800">
        {request.className}
    </span>
</td>

                                                <td className="whitespace-nowrap px-6 py-4">{request.subjects.join(', ')}</td>
                                                <td className="whitespace-nowrap truncate w-14 px-6 py-4">
                                                    {request.locality.length > 10 ? request.locality.substring(0, 10) + '...' : request.locality}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {request.teacherGenderPreference === 'Male' ? (
                                                        <span className="inline-block text-sm px-3 py-1 rounded-full text-white bg-blue-500">
                                                            Male
                                                        </span>
                                                    ) : request.teacherGenderPreference === 'Female' ? (
                                                        <span className="inline-block text-sm px-3 py-1 rounded-full text-white bg-pink-500">
                                                            Female
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block text-sm px-3 py-1 rounded-full text-gray-700 bg-gray-200">
                                                            Any
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {request.teacherId ? (
                                                        <a
                                                            href={`/Manage-Teacher/${request?.teacherId?.TeacherUserId}`}
                                                            className="inline-block text-sm px-3 py-1 rounded-full text-white bg-blue-500 hover:bg-blue-600"
                                                        >
                                                            {request.teacherId && request.teacherId._id ? 'Yes Check Teacher' : 'No'}
                                                        </a>
                                                    ) : (
                                                        <span className="inline-block text-sm px-3 py-1 rounded-full text-gray-700 bg-gray-200">
                                                            Not Assigned
                                                        </span>
                                                    )}
                                                </td>


                                                <td> <span className="inline-block capitalize text-sm px-3 py-1 rounded-full text-white bg-green-500">
                                                    {request.teacherAcceptThis}
                                                </span></td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <form className="max-w-sm mx-auto">
                                                        <select
                                                            id="status"
                                                            value={request.statusOfRequest || ''}
                                                            onChange={(e) => handleChange(e, request._id)}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                        >
                                                            <option value="" disabled>Select status</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="accepted">Accepted</option>
                                                            <option value="declined">Declined</option>
                                                        </select>
                                                    </form>
                                                </td>
                                                <td className="whitespace-nowrap flex  px-6 py-4 text-center">
                                                    {request.teacherId ? null : (

                                                        <Tooltip message="Allot Teacher 👩‍🏫">

                                                            <span onClick={() => handleAllotModelOpen(request)} className="text-gray-900 cursor-pointer m-2"><i class="fa-solid fa-chalkboard-user"></i></span>

                                                        </Tooltip>
                                                    )}
                                                    {/* <Tooltip message="Perform Advance Search 🚀">

                                                        <span onClick={() => perFromAdvanced(request)} className="text-violet-900 text-lg cursor-pointer m-2"><i class="fa-brands fa-searchengin"></i></span>

                                                    </Tooltip> */}

                                                </td>
                                                <td className="whitespace-nowrap px-6  py-4">
                                                    <div className='flex'>
                                                        <Tooltip message={request.dealDone ? 'Deal Completed' : 'Deal Pending'}>
                                                            {request.dealDone ? (
                                                                <span className="text-gray-900 cursor-pointer m-2">
                                                                    <i className="fa-regular fa-thumbs-up"></i>
                                                                </span>
                                                            ) : (
                                                                <span onClick={() => handleDealDone(request._id)} className="text-gray-900 cursor-pointer m-2">
                                                                    <i className="fa-regular fa-thumbs-down"></i>
                                                                </span>
                                                            )}
                                                        </Tooltip>
                                                        <span onClick={() => handleCommentModelOpen(request)} className="text-gray-900 cursor-pointer m-2"><i class="fa-regular fa-pen-to-square"></i></span>
                                                        <Link onClick={() => handleOpen(request)} className="text-blue-500 cursor-pointer m-2"><i class="fa-regular fa-eye"></i></Link>
                                                        <span onClick={() => DeleteRequest(request._id)} className="text-red-500 cursor-pointer p-0 m-2"><i class="fa-solid fa-trash"></i></span>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* Pagination */}
            < div className="mt-4 flex justify-between items-center" >
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="bg-blue-500 text-white px-4 py-2 rounded">Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
            </div >

            <SingleRequestModel isOpen={open} SelectedData={selectedRequest} onClose={handleClose} />
            <CommentModel isOpen={commentModel} onClose={handleCommentModelClose} selected={selectedComment} />
            <AllotTeacher isOpen={AllotTeacherModel} onClose={handleCommentModelClose} SelectedRequest={selectedComment} />
        </div >
    );
};

export default AllRequest;
