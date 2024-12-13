import React from 'react';

const TeacherCard = ({ teacher }) => (
    <div className="bg-white border border-gray-900 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-semibold">{teacher.FullName}</h3>
                <p className="text-sm text-gray-600">{teacher.Gender} • {teacher.TeachingExperience} Experience</p>
            </div>
            {teacher.srVerifiedTag && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">SR Verified</span>
            )}
        </div>

        <div className="space-y-3">
            {/* Academic Information */}
            <div>
                <h4 className="text-sm font-medium text-gray-700">Classes & Subjects</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                    {teacher.AcademicInformation.map((info, idx) => (
                        <div key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {info.className}
                        </div>
                    ))}
                </div>
            </div>

            {/* Teaching Location */}
            <div>
                <h4 className="text-sm font-medium text-gray-700">Teaching Areas</h4>
                <p className="text-sm text-gray-600">
                    {teacher.TeachingLocation.Area.join(', ')}
                </p>
            </div>

            {/* Contact & Mode */}
            <div className="flex justify-between items-center pt-2">
                <div>
                    <p className="text-sm font-bold text-gray-600"><span className='font-normal'>Teaching Mode :</span>{teacher.TeachingMode}</p>
                    <p className="text-sm font-medium">₹{teacher.ExpectedFees}/month</p>
                </div>
                <div>
                    <p className="text-sm font-medium">{teacher.ContactNumber}</p>
                    <p onClick={()=> window.location.href=`manage-teacher/${teacher?.TeacherUserId}`} className="text-sm cursor-pointer underline text-blue-600">View Profile</p>
                </div>
            </div>
        </div>
    </div>
);

export default TeacherCard;