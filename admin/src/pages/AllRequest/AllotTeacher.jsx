import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'
const AllotTeacher = ({ isOpen, SelectedRequest, onClose }) => {
    console.log(SelectedRequest)
    const [teacherId, setTeacherId] = useState('');
    const [data, setData] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleAllotTeacher = async () => {
        try {
            const { data } = await axios.post('http://localhost:7000/api/v1/uni/Add-Teacher-in-Request', {
                requestId: SelectedRequest._id,
                teacherId,
            });
            toast.success("Teacher Alloted Successful")
            onClose()
        } catch (error) {
            console.log(error);
            toast.error("Plaese try Again")
        }
    };

    const GetAllTeacher = async () => {
        try {
            const { data } = await axios.get('http://localhost:7000/api/v1/teacher/Get-Teacher-By-Profile');
            const InitialData = data.data



            const filterDataFromSelectedRequest = InitialData.filter((teacher) => {
                // Ensure teacher.AcademicInformation exists and is an array
                if (!teacher.AcademicInformation || !Array.isArray(teacher.AcademicInformation)) {

                    return false;
                }

                return teacher.AcademicInformation.some((acd) => {
                    // Ensure acd.Subjects exists and is an array
                    if (!acd.SubjectNames) {

                        return false;
                    }

                    return acd.SubjectNames.some((subject) =>

                        // Ensure subject.SubjectName exists
                        SelectedRequest.subjects.includes(subject)

                    );
                });
            });


            // console.log("Filter", filterDataFromSelectedRequest);

            if (filterDataFromSelectedRequest.length > 0) {
                setData(filterDataFromSelectedRequest);
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            GetAllTeacher();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block  text-left z-999 align-bottom min-h-60 transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">Allot Teacher</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">Please select a teacher to allot for the selected request.</p>
                                    <div className="relative mt-4">
                                        <button
                                            type="button"
                                            className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onClick={() => setShowDropdown(!showDropdown)}
                                        >
                                            {teacherId ? ` ${data.find(teacher => teacher._id === teacherId)?.FullName}` : 'Select a Teacher'}
                                        </button>

                                        {showDropdown && (
                                            <ul className="absolute z-999 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg  overflow-y-auto">
                                                {data.map((teacher) => (
                                                    <li
                                                        key={teacher._id}
                                                        className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                        onClick={() => {
                                                            setTeacherId(teacher._id);
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        <img
                                                            src={teacher?.ProfilePic?.url}
                                                            alt={teacher.FullName}
                                                            className="w-8 h-8 mr-2 rounded-full"
                                                        />
                                                        <span>{teacher.FullName}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={handleAllotTeacher}
                        >
                            Allot Teacher
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllotTeacher;
