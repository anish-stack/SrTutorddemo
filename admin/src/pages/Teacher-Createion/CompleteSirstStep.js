import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CompleteSirstStep = () => {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        TeacherName: '',
        PhoneNumber: '',
        Email: '',
        Password: '',
        DOB: '',

        gender: '',
        PermanentAddress: {
            streetAddress: '',
            City: '',
            Area: '',
            Pincode: ''
        }
    });

    const fetchDetails = async () => {
        try {
            const { data } = await axios.get(`https://api.srtutorsbureau.com/api/v1/teacher/Teacher-details/${id}`);
            console.log(data);
            setFormData({
                TeacherName: data?.data?.TeacherName || '',
                PhoneNumber: data?.data?.PhoneNumber || '',
                Email: data?.data?.Email || '',
                Password: '', // Password will remain empty
                DOB: data?.data?.DOB || '',
         
                gender: data?.data?.gender || '',
                PermanentAddress: {
                    streetAddress: data?.data?.PermanentAddress?.streetAddress || '',
                    City: data?.data?.PermanentAddress?.City || '',
                    Area: data?.data?.PermanentAddress?.Area || '',
                    Pincode: data?.data?.PermanentAddress?.Pincode || ''
                }
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch teacher details.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('PermanentAddress.')) {
            const field = name.split('.')[1];
            setFormData((prevState) => ({
                ...prevState,
                PermanentAddress: {
                    ...prevState.PermanentAddress,
                    [field]: value
                }
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://api.srtutorsbureau.com/api/v1/admin/Update-Teacher/${id}`, {
                ...formData
            });
            console.log('Form submitted successfully:', response.data);
            alert('Details updated successfully!');
        } catch (err) {
            console.error('Error updating details:', err);
            alert('Failed to update details.');
        }
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Complete First Step</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-medium mb-1">Teacher Name:</label>
                    <input
                        type="text"
                        name="TeacherName"
                        value={formData.TeacherName}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-1">Phone Number:</label>
                    <input
                        type="text"
                        name="PhoneNumber"
                        value={formData.PhoneNumber}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-1">Email:</label>
                    <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-1">Password:</label>
                    <input
                        type="password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-1">Date of Birth:</label>
                    <input
                        type="date"
                        name="DOB"
                        value={formData.DOB}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>
                {/* <div className="mb-4">
                    <label className="block font-medium mb-1">Age:</label>
                    <input
                        type="number"
                        name="Age"
                        value={formData.Age}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div> */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Gender:</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-1">Permanent Address:</label>
                    <input
                        type="text"
                        name="PermanentAddress.streetAddress"
                        value={formData.PermanentAddress.streetAddress}
                        onChange={handleChange}
                        className="border rounded w-full p-2 mb-2"
                        placeholder="Street Address"
                    />
                    <input
                        type="text"
                        name="PermanentAddress.City"
                        value={formData.PermanentAddress.City}
                        onChange={handleChange}
                        className="border rounded w-full p-2 mb-2"
                        placeholder="City"
                    />
                    <input
                        type="text"
                        name="PermanentAddress.Area"
                        value={formData.PermanentAddress.Area}
                        onChange={handleChange}
                        className="border rounded w-full p-2 mb-2"
                        placeholder="Area"
                    />
                    <input
                        type="text"
                        name="PermanentAddress.Pincode"
                        value={formData.PermanentAddress.Pincode}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        placeholder="Pincode"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CompleteSirstStep;
