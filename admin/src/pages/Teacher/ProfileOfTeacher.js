import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SingleTeacher } from '../../Slices/Teacher.slice'; // Adjust path if necessary
import axios from 'axios'
import toast from 'react-hot-toast';
const ProfileOfTeacher = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { singleTeacher, loading, error } = useSelector((state) => state.Teacher);

    const [teacherData, setTeacherData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        dispatch(SingleTeacher(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (singleTeacher) {
            setTeacherData(singleTeacher.data);
            setFormData(singleTeacher.data);
        }
    }, [singleTeacher]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };


    const handleUpdateClick = () => {
        setIsEditing(false);
        console.log(formData)

    };
    const [addresses, setAddresses] = useState([]);


    const handleVerify = async (teacherId, status) => {
        try {
            const { data } = await axios.post(`https://api.srtutorsbureau.com/api/v1/teacher/Make-Document-verified`, {
                teacherId: teacherId,
                status: status
            })
            toast.success('Document Verifed Succesful')
            dispatch(SingleTeacher(id));
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAddressName = async (lat, lng) => {
        try {
            const response = await axios.post(`https://api.srtutorsbureau.com/Fetch-Current-Location`, {

                lat,
                lng

            });
            if (response.data) {

                return response.data?.data?.
                    address?.completeAddress;
            }
        } catch (error) {
            console.error("Error fetching address name:", error);
        }
        return null;
    };
    useEffect(() => {
        const fetchAllAddresses = async () => {
            const fetchedAddresses = await Promise.all(
                teacherData.RangeWhichWantToDoClasses.map(async (item) => {
                    const lat = item.location.coordinates[1];
                    const lng = item.location.coordinates[0];
                    return await fetchAddressName(lat, lng);
                })
            );
            setAddresses(fetchedAddresses);
        };

        if (teacherData && teacherData.RangeWhichWantToDoClasses) {
            fetchAllAddresses();
        }
    }, [teacherData]);




    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!teacherData) {
        return <div>No data available</div>;
    }

    return (
        <div>
            <div className="p-6 max-w-screen mx-auto bg-white shadow-md rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Profile of {teacherData.FullName}</h2>
                    {isEditing ? (
                        <button onClick={handleUpdateClick} className="bg-green-500 text-white px-4 py-2 rounded-md">Update</button>
                    ) : (
                        <div className="relative group">
                      
                            <a href="#">
                                <img
                                    src={teacherData?.ProfilePic?.url || 'https://i.ibb.co/SJn894N/user-1.png'}
                                    alt="Profile Picture"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                                />
                            </a>
                     
                    
                        <div className="absolute bottom-25 right-0 mb-2 mr-2 opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="bg-white shadow-md rounded-md w-32 py-2">
                                <button 
                                    onClick={handleEditClick} 
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    Edit
                                </button>
                                <button 
                                   onClick={() => handleVerify(teacherData?.TeacherUserId?._id, true)}
                                    className="block w-full text-left truncate px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    Document Verified 
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    )}
                </div>
                <hr />
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-2">Personal Information</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-gray-100 p-4 rounded-md">
                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input
                                type="date"
                                name="DOB"
                                value={new Date(formData.DOB).toISOString().substring(0, 10)}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className={`mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                            />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md">
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                                name="Gender"
                                value={formData.Gender}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md">
                            <label className="block text-sm font-medium text-gray-700">Alternate Contact</label>
                            <input
                                type="text"
                                name="AlternateContact"
                                value={formData.AlternateContact}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className={`mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                            />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md">
                            <label className="block text-sm font-medium text-gray-700">Qualification</label>
                            <div className="mt-1 flex items-center">
                                <select
                                    name="Qualification"
                                    value={formData.Qualification}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={`py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                                >
                                    <option value="BA">B.A.</option>
                                    <option value="BSc">B.Sc.</option>
                                    <option value="BCom">B.Com.</option>
                                    <option value="BE">B.E.</option>
                                    <option value="BTech">B.Tech.</option>
                                    <option value="MBBS">MBBS</option>
                                    <option value="BDS">BDS</option>
                                    <option value="LLB">LL.B.</option>
                                    <option value="BBA">BBA</option>
                                    <option value="BCA">BCA</option>
                                    <option value="MA">M.A.</option>
                                    <option value="MSc">M.Sc.</option>
                                    <option value="MCom">M.Com.</option>
                                    <option value="ME">M.E.</option>
                                    <option value="MTech">M.Tech.</option>
                                    <option value="LLM">LL.M.</option>
                                    <option value="MBA">MBA</option>
                                    <option value="MCA">MCA</option>
                                    <option value="other">Other</option>
                                </select>

                                {formData.Qualification === "other" && (
                                    <input
                                        type="text"
                                        name="customQualification"
                                        value={formData.customQualification}
                                        onChange={handleInputChange}
                                        placeholder="Enter your degree"
                                        disabled={!isEditing}
                                        className="ml-2 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-md">
                            <label className="block text-sm font-medium text-gray-700">Teaching Experience</label>
                            <input
                                type="text"
                                name="TeachingExperience"
                                value={formData.TeachingExperience}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className={`mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                            />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md">
                            <label className="block text-sm font-medium text-gray-700">Expected Fees</label>
                            <input
                                type="text"
                                name="ExpectedFees"
                                value={formData.ExpectedFees}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className={`mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                            />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md">
                            <label className="block text-sm font-medium text-gray-700">Vehicle Owned</label>
                            <select
                                name="VehicleOwned"
                                value={formData.VehicleOwned ? 'Yes' : 'No'}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md">
                            <label className="block text-sm font-medium text-gray-700">Teaching Mode</label>
                            <select
                                name="TeachingMode"
                                value={formData.TeachingMode}
                                onChange={handleInputChange}

                                className={`mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                            >
                                <option value="online">{formData.TeachingMode}</option>
                            </select>

                        </div>
                        <div className="bg-gray-100 p-4 rounded-md">
                            <label className="block text-sm font-medium text-gray-700">Date Of Join</label>
                            <select
                                name="createdAt"
                           

                                className={`mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                            >
                                <option value="online">{new Date(formData.createdAt).toLocaleDateString('en-us')}</option>
                            </select>

                        </div>
                      
                    </div>
                </div>
                <div className="p-6 bg-white shadow-md rounded-lg">
                    {teacherData.TeacherUserId ? (
                        <div className='relative'>
                            <div className='flex items-baseline justify-around'>
                                {/* Qualification Document Section */}
                                <div className="mb-6">
                                    <p className="text-lg font-semibold text-gray-700 mb-2">
                                        Qualification Document:
                                    </p>
                                    {teacherData?.TeacherUserId?.QualificationDocument?.QualificationImageUrl ? (
                                        <a
                                            href={teacherData.TeacherUserId.QualificationDocument.QualificationImageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={teacherData.TeacherUserId.QualificationDocument.QualificationImageUrl}
                                                alt="Qualification Document"
                                                className="w-full max-h-36 max-w-xs rounded-md border border-gray-300 shadow-sm cursor-pointer"
                                            />
                                        </a>
                                    ) : (
                                        <p className="text-sm text-red-500">No qualification document uploaded.</p>
                                    )}
                                </div>

                                {/* Identity Document Section */}
                                <div className="mb-6">
                                    <p className="text-lg font-semibold text-gray-700 mb-2">Identity Document:</p>
                                    <p className="text-sm text-gray-600">
                                        {teacherData?.TeacherUserId?.identityDocument?.DocumentType || "No document type available"}
                                    </p>
                                    {teacherData?.TeacherUserId?.identityDocument?.DocumentImageUrl ? (
                                        <a
                                            href={teacherData.TeacherUserId.identityDocument.DocumentImageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={teacherData.TeacherUserId.identityDocument.DocumentImageUrl}
                                                alt="Identity Document"
                                                className="w-full max-h-36 max-w-xs rounded-md border border-gray-300 shadow-sm cursor-pointer"
                                            />
                                        </a>
                                    ) : (
                                        <p className="text-sm text-red-500">No identity document uploaded.</p>
                                    )}
                                </div>

                                <span
                                    className={`absolute top-0 right-0 transform translate-x-2 -translate-y-2 px-3 py-1 text-xs font-semibold rounded-full ${teacherData?.TeacherUserId?.DocumentStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {teacherData?.TeacherUserId?.DocumentStatus ? 'Verified' : 'Not Verified'}
                                </span>
                            </div>

                            <div className="flex justify-end">
                                {
                                    teacherData?.TeacherUserId?.DocumentStatus ? null : (
                                        <button
                                            className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition duration-200 ease-in-out"
                                            onClick={() => handleVerify(teacherData?.TeacherUserId?._id, true)}
                                        >
                                            Mark as Verified
                                        </button>
                                    )
                                }

                            </div>

                        </div>
                    ) : (
                        <div className="text-center absolute text-gray-500">No teacher data available.</div>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-2">Addresses</h3>

                    <div className="grid gap-4 md:grid-cols-1">

                        <div className="grid gap-4 md:grid-cols-2">

                            <div className="bg-gray-100 p-4 rounded-md">
                                <h4 className="text-lg font-semibold mb-1">Permanent Address</h4>
                                <input
                                    type="text"
                                    name="PermanentAddress"

                                    value={`${formData.PermanentAddress.Area}, ${formData.PermanentAddress.City}, ${formData.PermanentAddress.Pincode}, ${formData.PermanentAddress.streetAddress}`}


                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className={`block py-1 px-3 w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                                />
                            </div>


                        </div>

                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-2">Academic Information</h3>
                    {teacherData.AcademicInformation.map((info) => (
                        <div key={info._id} className="bg-gray-100 p-4 rounded-md mb-4">

                            {/* <h4 className="text-lg font-semibold mb-1">Class: {info.className || "Not-Disclosed"
                        }</h4>
                            <h4 className="text-lg font-semibold mb-1">Class Id: {info.ClassId || "Not-Disclosed"
                        }</h4> */}

                            <h4 className="text-lg font-semibold mb-1">Class ID: {info.ClassId}</h4>
                            {info.className && (

                                <h4 className="text-lg font-semibold mb-1">Class ID: {info.className}</h4>

                            )}

                            <input type="text" readOnly value={info?.SubjectNames?.join(',')} className="block py-1 px-3 w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900" />
                        </div>
                    ))}
                </div>

                <div className="mb-6">

                    <div className="grid gap-4 md:grid-cols-2">
                        {teacherData.TeachingLocation ? (
                            null
                        ) : (
                            teacherData.RangeWhichWantToDoClasses && teacherData.RangeWhichWantToDoClasses.length > 0 ? (
                                teacherData.RangeWhichWantToDoClasses.map((item, index) => (
                                    <div key={index} className="bg-gray-100 gap-2 p-4 grid grid-cols-2 rounded-md shadow-md">
                                        {/* Longitude */}
                                        <div>
                                            <label className="text-gray-700 font-medium">Longitude</label>
                                            <input
                                                type="text"
                                                name="longitude"
                                                readOnly
                                                value={item.location.coordinates[0] || "Unavailable"}
                                                className="mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900"
                                            />
                                        </div>

                                        {/* Latitude */}
                                        <div>
                                            <label className="text-gray-700 font-medium">Latitude</label>
                                            <input
                                                type="text"
                                                name="latitude"
                                                readOnly
                                                value={item.location.coordinates[1] || "Unavailable"}
                                                className="mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900"
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="col-span-2">
                                            <label className="text-gray-700 font-medium">Address Name</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={addresses[index] || "Fetching address..."}
                                                readOnly
                                                className="mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900"
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center text-gray-500">
                                    <p>No available teaching locations.</p>
                                </div>
                            )
                        )}
                    </div>


                    <h3 className="text-center text-gray-800 font-semibold mb-4">Location Via Teaching Location Data</h3>
                    {teacherData.TeachingLocation && (
                        <div className="col-span-2">
                            <ul className="bg-white shadow-lg rounded-lg p-6 space-y-6">
                                <li className="border-b pb-4 last:border-b-0">
                                    <p className="text-gray-800 font-medium">
                                        <strong>Location Name:</strong>
                                    </p>
                                    <ul className="list-disc ml-6 text-gray-700">
                                        {teacherData.TeachingLocation.Area.map((item, index) => (
                                            <li key={index} className="py-1">{item}</li>
                                        ))}
                                    </ul>
                                    <p className="text-gray-800 font-medium">
                                        <strong>District:</strong> {teacherData.TeachingLocation.City}
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        <strong>City:</strong> {teacherData.TeachingLocation.State}
                                    </p>
                                </li>
                            </ul>
                        </div>
                    )}

                </div>

            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Verification Status</h3>
                <div className="bg-gray-100 p-4 rounded-md">
                    <label className="block py- px-3 text-sm font-medium text-gray-700">All Details Verified</label>
                    <input type="text" readOnly value={teacherData.isAllDetailVerified ? 'Yes' : 'No'} className="mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900" />
                </div>
            </div>
        </div>
    );

};

export default ProfileOfTeacher;