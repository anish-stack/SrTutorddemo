import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const CompleteProfile = ({ profileInfo, readable, title }) => {
    const token = Cookies.get('teacherToken');

    // Initialize state with profileInfo
    const [formData, setFormData] = useState({
        FullName: '',
        Gender: '',
        ContactNumber: '',
        AlternateContact: '',
        Qualification: '',
        TeachingExperience: '',
        ExpectedFees: '',
        PermanentAddress: {
            HouseNo: '',
            LandMark: '',
            District: '',
            Pincode: ''
        },
        CurrentAddress: {
            HouseNo: '',
            LandMark: '',
            District: '',
            Pincode: ''
        }
    });
    const [checkIsCurrentLocationWantChange, setCheckIsCurrentLocationWantChange] = useState(false);

    useEffect(() => {
        if (profileInfo) {
            setFormData({
                ...profileInfo,
                PermanentAddress: profileInfo.PermanentAddress || formData.PermanentAddress,
                CurrentAddress: profileInfo.CurrentAddress || formData.CurrentAddress
            });
        }
    }, [profileInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleNestedChange = (e) => {
        const { name, value } = e.target;
        const [parentKey, childKey] = name.split('.');
        setFormData(prevData => ({
            ...prevData,
            [parentKey]: {
                ...prevData[parentKey],
                [childKey]: value
            }
        }));
    };

    const handleCheck = () => {
        setCheckIsCurrentLocationWantChange(!checkIsCurrentLocationWantChange);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedFields = {};

            // Check for changes in the profile info
            Object.keys(formData).forEach((key) => {
                if (key === 'PermanentAddress' || key === 'CurrentAddress') {
                    // Handle nested objects
                    Object.keys(formData[key]).forEach((subKey) => {
                        if (formData[key][subKey] !== profileInfo[key]?.[subKey]) {
                            updatedFields[`${key}.${subKey}`] = formData[key][subKey];
                        }
                    });
                } else {
                    if (formData[key] !== profileInfo[key]) {
                        updatedFields[key] = formData[key];
                    }
                }
            });

            // If current location checkbox is checked, handle current address fields
            if (checkIsCurrentLocationWantChange) {
                Object.keys(formData.CurrentAddress).forEach((key) => {
                    if (formData.CurrentAddress[key] !== profileInfo.CurrentAddress[key]) {
                        updatedFields[`CurrentAddress.${key}`] = formData.CurrentAddress[key];
                    }
                });
            }

            if (Object.keys(updatedFields).length === 0) {
                console.log("No fields have been updated.");
                return;
            }

            const response = await axios.put('http://localhost:7000/api/v1/teacher/update-profile-details', updatedFields, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Profile Details Will be Updated")
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
    };

    if (!profileInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container my-4">
            <h2>{title} Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <label htmlFor="FullName" className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="FullName"
                            name="FullName"
                            value={formData.FullName}
                            onChange={handleChange}
                            readOnly={readable}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="Gender" className="form-label">Gender</label>
                        <select
                            className="form-control"
                            id="Gender"
                            name="Gender"
                            value={formData.Gender}
                            onChange={handleChange}
                            disabled={readable}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="ContactNumber" className="form-label">Contact Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="ContactNumber"
                            name="ContactNumber"
                            value={formData.ContactNumber}
                            onChange={handleChange}
                            readOnly={readable}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="AlternateContact" className="form-label">Alternate Contact</label>
                        <input
                            type="text"
                            className="form-control"
                            id="AlternateContact"
                            name="AlternateContact"
                            value={formData.AlternateContact}
                            onChange={handleChange}
                            readOnly={readable}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="Qualification" className="form-label">Qualification</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Qualification"
                            name="Qualification"
                            value={formData.Qualification}
                            onChange={handleChange}
                            readOnly={readable}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="TeachingExperience" className="form-label">Teaching Experience (Years)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="TeachingExperience"
                            name="TeachingExperience"
                            value={formData.TeachingExperience}
                            onChange={handleChange}
                            readOnly={readable}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="ExpectedFees" className="form-label">Expected Fees</label>
                        <input
                            type="text"
                            className="form-control"
                            id="ExpectedFees"
                            name="ExpectedFees"
                            value={formData.ExpectedFees}
                            onChange={handleChange}
                            readOnly={readable}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <h5>Permanent Address</h5>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="PermanentHouseNo" className="form-label">House No</label>
                            <input
                                type="text"
                                className="form-control"
                                id="PermanentHouseNo"
                                name="PermanentAddress.HouseNo"
                                value={formData.PermanentAddress.HouseNo}
                                onChange={handleNestedChange}
                                readOnly={readable}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="PermanentLandMark" className="form-label">LandMark</label>
                            <input
                                type="text"
                                className="form-control"
                                id="PermanentLandMark"
                                name="PermanentAddress.LandMark"
                                value={formData.PermanentAddress.LandMark}
                                onChange={handleNestedChange}
                                readOnly={readable}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="PermanentDistrict" className="form-label">District</label>
                            <input
                                type="text"
                                className="form-control"
                                id="PermanentDistrict"
                                name="PermanentAddress.District"
                                value={formData.PermanentAddress.District}
                                onChange={handleNestedChange}
                                readOnly={readable}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="PermanentPincode" className="form-label">Pincode</label>
                            <input
                                type="text"
                                className="form-control"
                                id="PermanentPincode"
                                name="PermanentAddress.Pincode"
                                value={formData.PermanentAddress.Pincode}
                                onChange={handleNestedChange}
                                readOnly={readable}
                            />
                        </div>
                    </div>
                </div>

                {title === "Edit" && (
                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="currentLocation"
                            checked={checkIsCurrentLocationWantChange}
                            onChange={handleCheck}
                        />
                        <label htmlFor="currentLocation" className="form-check-label">
                            Please tick if you want to update with current location.
                        </label>
                    </div>
                )}

                {checkIsCurrentLocationWantChange && (
                    <div className="mb-3">
                        <h5>Current Address</h5>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="CurrentHouseNo" className="form-label">House No</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="CurrentHouseNo"
                                    name="CurrentAddress.HouseNo"
                                    value={formData.CurrentAddress.HouseNo}
                                    onChange={handleNestedChange}
                                    readOnly={readable}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="CurrentLandMark" className="form-label">LandMark</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="CurrentLandMark"
                                    name="CurrentAddress.LandMark"
                                    value={formData.CurrentAddress.LandMark}
                                    onChange={handleNestedChange}
                                    readOnly={readable}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="CurrentDistrict" className="form-label">District</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="CurrentDistrict"
                                    name="CurrentAddress.District"
                                    value={formData.CurrentAddress.District}
                                    onChange={handleNestedChange}
                                    readOnly={readable}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="CurrentPincode" className="form-label">Pincode</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="CurrentPincode"
                                    name="CurrentAddress.Pincode"
                                    value={formData.CurrentAddress.Pincode}
                                    onChange={handleNestedChange}
                                    readOnly={readable}
                                />
                            </div>
                        </div>
                    </div>
                )}

               {title === 'Edit' ? (
                <div className="mb-3 text-end">
                <Button
                    variant="primary"
                    type="submit"
                    className="btn w-100 btn-primary btn-sm"
                    style={{ padding: '12px 16px', borderRadius: '5px' }}
                >
                    Edit Profile Details
                </Button>
            </div>
               ):null }
            </form>
        </div>
    );
};

export default CompleteProfile;
