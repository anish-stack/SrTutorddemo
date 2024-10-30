import axios from 'axios'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useGeolocated } from "react-geolocated";
import Select from 'react-select';

const AddRequest = () => {
    const [formData, setFormData] = useState({
        requestType: "",   //options ["Teacher Request For School Classes","Class Teacher","Subject Teacher"]
        classId: "",
        className: "",
        subjects: [],
        interestedInTypeOfClass: "",
        studentInfo: {
            studentName: "",
            contactNumber: ""
        },
        teacherGenderPreference: "",
        numberOfSessions: "",
        experienceRequired: 0,
        maxBudget: "",
        locality: "",
        startDate: "",
        location: {
            type: "Point",
            coordinates: []
        },
        requestByAdmin: true
    });

    const [classes, setClasses] = useState([]);
    const [concatenatedData, setConcatenatedData] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [locationInput, setLocationInput] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [clickLatitude, setClickLatitude] = useState(null);
    const [clickLongitude, setClickLongitude] = useState(null);

    const Token = localStorage.getItem('Sr-token');

    const fetchClass = async () => {
        try {
            const response = await axios.get('http://localhost:7000/api/v1/admin/Get-Classes', {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            setClasses(response.data.data.sort((a, b) => a.position - b.position));
        } catch (error) {
            toast.error('Failed to fetch classes');
            console.log(error);
        }
    };

    useEffect(() => {
        fetchClass();
    }, []);

    useEffect(() => {
        if (classes.length > 0) {
            const filterOutClasses = ["I-V", "VI-VIII", "IX-X", "XI-XII"];

            const filteredClasses = classes
                .filter(item => !filterOutClasses.includes(item.Class))
                .map(item => ({ class: item.Class, id: item._id }));

            const rangeClasses = classes
                .filter(item => item.InnerClasses && item.InnerClasses.length > 0)
                .flatMap(item => item.InnerClasses.map(innerClass => ({
                    class: innerClass.InnerClass,
                    id: innerClass._id
                })));

            const concatenatedData = rangeClasses.concat(filteredClasses);
            setConcatenatedData(concatenatedData);
        }
    }, [classes]);

    const fetchSubjects = async (classId) => {
        try {
            const response = await axios.get(
                `http://localhost:7000/api/v1/admin/Get-Class-Subject/${classId}`
            );
            setSubjects(response.data.data.Subjects || []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const handleClassChange = (selectedClassObj) => {
        setFormData({
            ...formData,
            classId: selectedClassObj.value,
            className: selectedClassObj.label
        });
        fetchSubjects(selectedClassObj.value);
    };

    const handleSubjectChange = (selectedSubjectObj) => {
        const subjectList = selectedSubjectObj.map(subject => subject.label);
        setFormData({
            ...formData,
            subjects: subjectList
        });
    };

    const handleLocationFetch = async (input) => {
        setLocationInput(input);

        if (input.length > 2) {
            try {
                const res = await axios.get(`http://localhost:7000/autocomplete?input=${input}`);
                setLocationSuggestions(res.data || []);
            } catch (error) {
                console.error("Error fetching location suggestions:", error);
                setLocationSuggestions([]);
            }
        } else {
            setLocationSuggestions([]);
        }
    };

    const handleLocationSelect = (suggestion) => {
        setLocationInput(suggestion);
        setFormData((prev) => ({
            ...prev,
            locality: suggestion
        }))
        setLocationSuggestions([]);
        handleLocationLatAndLngFetch(suggestion);
    };

    const handleLocationLatAndLngFetch = async (address) => {
        const options = {
            method: 'GET',
            url: `http://localhost:7000/geocode?address=${address}`
        };

        try {
            const response = await axios.request(options);
            const result = response.data;
            if (result) {
                setClickLatitude(result.latitude);
                setClickLongitude(result.longitude);
                setFormData((prev) => ({
                    ...prev,
                    location: {
                        type: "Point",
                        coordinates: [result.longitude, result.latitude]
                    }
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const { coords } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
    });

    const numberOfSessionsOptions = [
        { value: 'Two Classes a Week', label: 'Two Classes a Week' },
        { value: 'Three Classes a Week', label: 'Three Classes a Week' },
        { value: 'Four Classes a Week', label: 'Four Classes a Week' },
        { value: 'Five Classes a Week', label: 'Five Classes a Week' },
        { value: 'Six Classes a Week', label: 'Six Classes a Week' },
    ];
    const RequestTypeOptions = [
        { value: 'Teacher Request For School Classes', label: "Teacher Request For School Classes" },
        { value: 'Class Teacher', label: 'Class Teacher' },
        { value: 'Subject Teacher', label: 'Subject Teacher' },
    ]
    useEffect(() => {
        if (coords) {
            setFormData((prev) => ({
                ...prev,
                location: {
                    type: "Point",
                    coordinates: [coords.longitude, coords.latitude]
                }
            }));
        }
    }, [coords]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        try {
            await axios.post('http://localhost:7000/api/v1/student/universal-request', formData, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            toast.success("Request submitted successfully");
        } catch (error) {
            toast.error("Failed to submit request");
            console.error(error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Add Request</h2>
            <form onSubmit={handleSubmit}>



                <div className="mb-4">
                    <label className="block text-gray-700">Type Of Request</label>
                    <Select
                        options={RequestTypeOptions}
                        onChange={(selectedOption) =>
                            setFormData({ ...formData, requestType: selectedOption.value })
                        }

                        placeholder="Type Of Request "
                    />
                </div>



                {/* Student Info */}
                <div className='grid gap-1 grid-cols-2'>
                    <div className="mb-4">
                        <label className="block text-gray-700">Student Name</label>
                        <input
                            type="text"
                            value={formData.studentInfo.studentName}
                            onChange={(e) => setFormData({
                                ...formData,
                                studentInfo: {
                                    ...formData.studentInfo,
                                    studentName: e.target.value
                                }
                            })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Contact Number</label>
                        <input
                            type="text"
                            value={formData.studentInfo.contactNumber}
                            onChange={(e) => setFormData({
                                ...formData,
                                studentInfo: {
                                    ...formData.studentInfo,
                                    contactNumber: e.target.value
                                }
                            })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                {/* Class & Subjects */}
                <div className='grid gap-1 grid-cols-2'>
                    <div className="mb-4">
                        <label className="block text-gray-700">Class</label>
                        <Select
                            options={concatenatedData.map(item => ({ value: item.id, label: item.class }))}
                            onChange={handleClassChange}
                            placeholder="Select a class"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Subjects</label>
                        <Select
                            isMulti
                            options={subjects.map(subject => ({ value: subject._id, label: subject.SubjectName }))}
                            onChange={handleSubjectChange}
                            placeholder="Select subjects"
                        />
                    </div>
                </div>
                <div className='grid gap-1 grid-cols-2'>
                    {/* Class Type */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Class Type</label>
                        <Select
                            options={[
                                { value: 'online', label: 'Online' },
                                { value: 'offline', label: 'Offline' }
                            ]}
                            onChange={(option) => setFormData({ ...formData, interestedInTypeOfClass: option.value })}
                            placeholder="Select class type"
                        />
                    </div>

                    {/* Teacher Gender Preference */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Teacher Gender Preference</label>
                        <Select
                            options={[
                                { value: 'Male', label: 'Male' },
                                { value: 'Female', label: 'Female' },
                                { value: 'Any', label: 'Any' }
                            ]}
                            onChange={(option) => setFormData({ ...formData, teacherGenderPreference: option.value })}
                            placeholder="Select gender preference"
                        />
                    </div>
                </div>
                {/* Number of Sessions */}
                <div className="mb-4">
                    <label className="block text-gray-700">Number of Sessions</label>
                    <Select
                        name="numberOfSessions"
                        options={numberOfSessionsOptions}
                        onChange={(selectedOption) =>
                            setFormData({ ...formData, numberOfSessions: selectedOption.value })
                        }
                        required
                    />
                </div>

                {/* Location */}
                <div className="mb-4">
                    <label className="block text-gray-700">Locality</label>
                    <input
                        type="text"
                        value={locationInput}
                        onChange={(e) => handleLocationFetch(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter locality"
                    />
                    {locationSuggestions.length > 0 && (
                        <ul className="border border-gray-300 mt-2 max-h-40 overflow-y-auto bg-white">
                            {locationSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleLocationSelect(suggestion.description)}
                                >
                                    {suggestion.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* Experience Required */}
                <div className="mb-4">
                    <label className="block text-gray-700">Experience Required (in years)</label>
                    <input
                        type="number"
                        value={formData.experienceRequired}
                        onChange={(e) => setFormData({ ...formData, experienceRequired: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className='grid gap-1 grid-cols-2'>


                    <div className="mb-4">
                        <label className="block text-gray-700">Max Budget</label>
                        <input
                            type="number"
                            value={formData.maxBudget}
                            onChange={(e) => setFormData({ ...formData, maxBudget: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Start Date */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Start Date</label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>



                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRequest;
