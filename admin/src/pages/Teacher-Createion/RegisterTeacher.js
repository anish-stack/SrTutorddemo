import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const RegisterTeacher = () => {
    const [formData, setFormData] = useState({
        TeacherName: '',
        PhoneNumber: '',
        Email: '',
        Password: '',
        DOB: '',
        Age: '',
        gender: '',
        PermanentAddress: {
            streetAddress: '',
            City: '',
            Area: '',
            LandMark: '',
            Pincode: ''
        },
        DocumentType: 'Aadhaar',
        DocumentImage: null,
        QualificationDocument: null
    });
    const [Loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);
    const qualificationRef = useRef(null);

    const handleIdentityFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxSizeInMB = 10;
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

            if (!validFileTypes.includes(file.type)) {
                toast.error('Invalid file type. Please upload a .jpg, .jpeg, .png file.');

                fileInputRef.current.value = '';
                return;
            }

            if (file.size > maxSizeInBytes) {
                toast.error('File size exceeds 10 MB. Please upload a smaller file.');

                fileInputRef.current.value = '';

                return;
            }

            setFormData({ ...formData, DocumentImage: file });
          
            toast.success('File selected successfully!');
        }
    };

    const handleQualificationFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxSizeInMB = 10;
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

            if (!validFileTypes.includes(file.type)) {
                toast.error('Invalid file type. Please upload a .jpg, .jpeg, .png, file.');

                qualificationRef.current.value = '';
                return;
            }

            if (file.size > maxSizeInBytes) {
                toast.error('File size exceeds 10 MB. Please upload a smaller file.');

                qualificationRef.current.value = '';

                return;
            }

            setFormData({ ...formData, QualificationDocument: file });

            toast.success('File selected successfully!');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleNestedChange = (e, addressType) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [addressType]: {
                ...prevState[addressType],
                [name]: value
            }
        }));
    };

    const calculateAge = (dob) => {
        if (!dob) return '';
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleDOBChange = (e) => {
        const { value } = e.target;
        const calculatedAge = calculateAge(value);
        setFormData((prevData) => ({
            ...prevData,
            DOB: value,
            Age: calculatedAge
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const isFormValid = Object.values(formData).every(value => value !== '' && value !== undefined && value !== null);
        if (formData.PhoneNumber.length > 10) {
            toast.error('Phone number cannot exceed 10 digits.');
            return;
        }
        if (!isFormValid) {
            toast.error("Please fill all required fields.");
            return;
        }
        const data = new FormData();
        data.append('TeacherName', formData.TeacherName);
        data.append('PhoneNumber', formData.PhoneNumber);
        data.append('Email', formData.Email);
        data.append('Password', formData.Password);
        data.append('DOB', formData.DOB);
        data.append('gender', formData.gender);
        data.append('PermanentAddress', JSON.stringify(formData.PermanentAddress));
        data.append('Document', formData.DocumentImage);
        data.append('Qualification', formData.QualificationDocument);
        data.append('DocumentType', formData.DocumentType);
        setLoading(true);
        try {
            const response = await axios.post(`https://api.srtutorsbureau.com/api/v1/teacher/Create-teacher?DocumentType=${formData.DocumentType}&isAddedByAdmin=true`, data);
            console.log(response.data.message);
            toast.success(response.data.message);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error.response.data.message);
            toast.error(error.response.data.message);
        }
    };
    if (Loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }


    return (
        <div className="max-w-5xl mx-auto p-5">
            <form onSubmit={handleRegister} className="space-y-4">
                <h2 className="text-3xl font-bold text-center">Register Teacher</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="TeacherName" className="text-sm font-semibold">Teacher Name</label>
                        <input
                            type="text"
                            id="TeacherName"
                            name="TeacherName"
                            value={formData.TeacherName}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded-md"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="PhoneNumber" className="text-sm font-semibold">Phone Number</label>
                        <input
                            type="tel"
                            id="PhoneNumber"
                            name="PhoneNumber"
                            value={formData.PhoneNumber}
                            onChange={handleChange}
                            maxLength="10"
                            className="border border-gray-300 p-2 rounded-md"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="Email" className="text-sm font-semibold">Email</label>
                        <input
                            type="email"
                            id="Email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded-md"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="Password" className="text-sm font-semibold">Password</label>
                        <input
                            type="password"
                            id="Password"
                            name="Password"
                            value={formData.Password}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded-md"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="DOB" className="text-sm font-semibold">Date of Birth</label>
                    <input
                        type="date"
                        id="DOB"
                        name="DOB"
                        value={formData.DOB}
                        onChange={handleDOBChange}
                        className="border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="gender" className="text-sm font-semibold">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded-md"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="Age" className="text-sm font-semibold">Age</label>
                        <input
                            type="number"
                            id="Age"
                            name="Age"
                            value={formData.Age}
                            className="border border-gray-300 p-2 rounded-md"
                            readOnly
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="streetAddress" className="text-sm font-semibold text-gray-700">Street Address</label>
                        <input
                            type="text"
                            name="streetAddress"
                            value={formData.PermanentAddress.streetAddress}
                            onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                            placeholder="Street Address"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="City" className="text-sm font-semibold text-gray-700">City</label>
                        <input
                            type="text"
                            name="City"
                            value={formData.PermanentAddress.City}
                            onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                            placeholder="City"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="Area" className="text-sm font-semibold text-gray-700">Area</label>
                        <input
                            type="text"
                            name="Area"
                            value={formData.PermanentAddress.Area}
                            onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                            placeholder="Area"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="LandMark" className="text-sm font-semibold text-gray-700">Landmark</label>
                        <input
                            type="text"
                            name="LandMark"
                            value={formData.PermanentAddress.LandMark}
                            onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                            placeholder="Landmark"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="Pincode" className="text-sm font-semibold text-gray-700">Pincode</label>
                        <input
                            type="text"
                            name="Pincode"
                            value={formData.PermanentAddress.Pincode}
                            onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                            placeholder="Pincode"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col mt-4">
                    <label className="text-sm font-semibold">Select Document Type</label>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="Aadhaar"
                                name="DocumentType"
                                value="Aadhaar"
                                checked={formData.DocumentType === 'Aadhaar'}
                                onChange={(e) => setFormData({ ...formData, DocumentType: e.target.value })}
                                className="mr-2"
                            />
                            <label htmlFor="Aadhaar" className="text-sm">Aadhaar</label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="PanCard"
                                name="DocumentType"
                                value="Pan"
                                checked={formData.DocumentType === 'Pan'}
                                onChange={(e) => setFormData({ ...formData, DocumentType: e.target.value })}
                                className="mr-2"
                            />
                            <label htmlFor="Pan" className="text-sm">Pan Card</label>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="DocumentImage" className="text-sm font-semibold">Identity Document</label>
                    <input
                        type="file"
                        name="DocumentImage"
                        ref={fileInputRef}
                        onChange={handleIdentityFileChange}
                        className="border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>




                <div className="flex flex-col">
                    <label htmlFor="QualificationDocument" className="text-sm font-semibold">Qualification Document</label>
                    <input
                        type="file"
                        name="QualificationDocument"
                        ref={qualificationRef}
                        onChange={handleQualificationFileChange}
                        className="border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-3 rounded-md w-full md:w-auto"
                    >
                        Register Teacher
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterTeacher;
