import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SingleTeacher } from '../../Slices/Teacher.slice'; // Adjust path if necessary

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
    console.log(teacherData)

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
        <div className="p-6 max-w-7xl mx-auto bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Profile of {teacherData.FullName}</h2>
                {isEditing ? (
                    <button onClick={handleUpdateClick} className="bg-green-500 text-white px-4 py-2 rounded-md">Update</button>
                ) : (
                    <button onClick={handleEditClick} className="bg-blue-500 text-white px-4 py-2 rounded-md">Edit</button>
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
                            disabled={!isEditing}
                            className={`mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                        >
                            <option value="Home Tuition at Student\'s Home">Home Tuition at Student's Home</option>
                            <option value="Home Tuition at Your Home">Home Tuition at Your Home</option>
                            <option value="Institute or Group Tuition">Institute or Group Tuition</option>
                        </select>

                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Addresses</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-gray-100 p-4 rounded-md">
                        <h4 className="text-lg font-semibold mb-1">Permanent Address</h4>
                        <input
                            type="text"
                            name="PermanentAddress"
                            value={`${formData.PermanentAddress.HouseNo}, ${formData.PermanentAddress.LandMark}, ${formData.PermanentAddress.District}, ${formData.PermanentAddress.Pincode}`}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            className={`block py-1 px-3 w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                        />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                        <h4 className="text-lg font-semibold mb-1">Current Address</h4>
                        <input
                            type="text"
                            name="CurrentAddress"
                            value={`${formData.CurrentAddress.HouseNo}, ${formData.CurrentAddress.LandMark}, ${formData.CurrentAddress.District}, ${formData.CurrentAddress.Pincode}`}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            className={`block py-1 px-3 w-full bg-white border border-gray-300 rounded-md shadow-sm ${isEditing ? 'text-gray-900' : 'text-gray-500'}`}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Academic Information</h3>
                {teacherData.AcademicInformation.map((info) => (
                    <div key={info._id} className="bg-gray-100 p-4 rounded-md mb-4">
                        <h4 className="text-lg font-semibold mb-1">Class ID: {info.ClassId}</h4>
                        <input type="text" readOnly value={info.SubjectNames.join(', ')} className="block py-1 px-3 w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900" />
                    </div>
                ))}
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Location</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-gray-100 p-4 rounded-md">
                        <label className="block py- px-3 text-sm font-medium text-gray-700">Latitude</label>
                        <input type="text" readOnly value={teacherData.latitude} className="mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900" />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                        <label className="block py- px-3 text-sm font-medium text-gray-700">Longitude</label>
                        <input type="text" readOnly value={teacherData.longitude} className="mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900" />
                    </div>
                    <label className="block py- px-3 text-sm font-medium text-gray-700">Range for Classes In Km</label>
                    {teacherData.RangeWhichWantToDoClasses.map((item, index) => (

                        <div key={index} className="bg-gray-100 gap-2 p-4 grid grid-cols-2 rounded-md md:col-span-2">
                            <div>
                                <label>Lat</label>
                                <input type="text"
                                    name="RangeWhichWantToDoClasses"
                                    readOnly={!isEditing}
                                    value={`${item.lat}`} className="mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900"
                                />
                            </div>
                            <div>
                                <label>lang</label>
                                <input type="text"
                                    name="RangeWhichWantToDoClasses"
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    value={`${item.lat}`} className="mt-1 py-1 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900"
                                />
                            </div>
                        </div>
                    ))}
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
