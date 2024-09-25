import React, { useEffect, useState } from 'react';

const SingleRequestModel = ({ isOpen, SelectedData, onClose }) => {
    const [data, setData] = useState({});

    // Load the selected data when it changes
    useEffect(() => {
        if (SelectedData) {
            setData(SelectedData);
        }
    }, [SelectedData]);

    // Do not render if the modal is not open
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg lg:max-w-4xl lg:w-full overflow-hidden">
                {/* Modal Header */}
                <div className="flex justify-between items-center py-3 px-4 border-b">
                    <h3 className="font-bold text-gray-800">Request Details</h3>
                    <button
                        type="button"
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 overflow-y-auto max-h-96 space-y-6">
                    {/* Student Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Student Info</h3>
                        <p><strong>Name:</strong> {data.studentInfo?.studentName || 'N/A'}</p>
                        <p><strong>Contact Number:</strong> {data.studentInfo?.contactNumber || 'N/A'}</p>
                        <p><strong>Email:</strong> {data.studentInfo?.emailAddress || 'N/A'}</p>
                    </div>

                    {/* Request Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Request Info</h3>
                        <p><strong>Request ID:</strong> {data.requestId || 'N/A'}</p>
                        <p><strong>Request Type:</strong> {data.requestType || 'N/A'}</p>
                        <p><strong>Class:</strong> {data.className || 'N/A'}</p>
                        <p><strong>Subjects:</strong> {data.subjects?.join(', ') || 'N/A'}</p>
                        <p><strong>Subject language:</strong> {data?.ClassLangUage || 'N/A'}</p>
                        <p><strong>Type of Class:</strong> {data.interestedInTypeOfClass || 'N/A'}</p>
                        <p><strong>Teacher Gender Preference:</strong> {data.teacherGenderPreference || 'N/A'}</p>
                        <p><strong>Number of Sessions:</strong> {data.numberOfSessions || 'N/A'}</p>
                        <p><strong>Budget:</strong> ₹{data.minBudget} - ₹{data.maxBudget}</p>
                        <p><strong>Locality:</strong> {data.locality || 'N/A'}</p>
                        <p><strong>Start Date:</strong> {data.startDate || 'N/A'}</p>
                        <p><strong>Specific Requirement:</strong> {data.specificRequirement || 'N/A'}</p>
                    </div>

                    {/* Teacher Info */}
                    {data.teacherId && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Teacher Info</h3>
                            <p><strong>Teacher Name:</strong> {data.teacherId.FullName || 'N/A'}</p>
                            <p><strong>Phone Number:</strong> {data.teacherId.ContactNumber || 'N/A'}</p>
                            <p><strong>Teaching Mode:</strong> {data.teacherId.TeachingMode || 'N/A'}</p>
                            <p><strong>Gender:</strong> {data.teacherId.Gender || 'N/A'}</p>
                            <p><strong>Verified:</strong> {data.teacherId.isAllDetailVerified ? 'Yes' : 'No'}</p>
                        </div>
                    )}

                    {/* Status Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Request Status</h3>
                        <p><strong>Status of Request:</strong> {data.statusOfRequest || 'N/A'}</p>
                        <p><strong>Deal Done:</strong> {data.dealDone ? 'Yes' : 'No'}</p>
                        <p><strong>Teacher Accepted:</strong> {data.teacherAcceptThis || 'N/A'}</p>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                    <button
                        type="button"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>
    );
};

export default SingleRequestModel;
