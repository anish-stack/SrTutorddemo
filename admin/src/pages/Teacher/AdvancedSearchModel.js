import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdvancedSearch } from '../../Slices/AdvancedSearch.slice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const AdvancedSearchModel = ({ Show, handleCloseAdvancedClick }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [allSubject, setAllSubject] = useState([]);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [Advanced, setAdvanced] = useState({
        Gender: '',
        TeachingExperience: '',
        VehicleOwned: '',
        TeachingMode: 'All',
        Location: '',
        Subject: [],
        MinRange: 0,
        MaxRange: 0,
        isBestFaculty: false,
    });

    // Fetch all subjects from the API
    const handleFetch = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/v1/admin/Get-All-Subject');
            setAllSubject(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch location suggestions based on input
    const handleLocationFetch = async (input) => {
        try {
            const res = await axios.get('https://place-autocomplete1.p.rapidapi.com/autocomplete/json', {
                params: {
                    input: input,
                    radius: '500'
                },
                headers: {
                    'x-rapidapi-key': '75ad2dad64msh17034f06cc47c06p18295bjsn18e367df005b',
                    'x-rapidapi-host': 'place-autocomplete1.p.rapidapi.com'
                }
            });
            setLocationSuggestions(res.data.predictions || []);
        } catch (error) {
            console.log(error);
        }
    };

    // Handle location input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdvanced((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'Location') {
            handleLocationFetch(value);
        }
    };

    // Handle location selection
    const handleLocationSelect = (location) => {
        setAdvanced((prevState) => ({
            ...prevState,
            Location: location.description,
        }));
        setLocationSuggestions([]); // Clear location suggestions
    };

    // Handle range changes with independent validation


    // Handle subject selection
    const handleSubjectChange = (e) => {
        const selectedSubject = e.target.value;
        setAdvanced((prevState) => {
            const updatedSubjects = prevState.Subject.includes(selectedSubject)
                ? prevState.Subject.filter(subject => subject !== selectedSubject)
                : [...prevState.Subject, selectedSubject];
            return {
                ...prevState,
                Subject: updatedSubjects,
            };
        });
    };

    // Handle search button click
    const handleSearchClick = async (e) => {
        const hasEmptyField = Object.values(Advanced).some(value => value === "" || value == null);

        if (hasEmptyField) {
            e.preventDefault(); 
             toast.error('Please Give Required Feilds')   
        } else {
            // Dispatch the advanced search action
            dispatch(AdvancedSearch({ Advanced, navigate }));
        }

    };

    const removeSubject = (subjectToRemove) => {
        setAdvanced((prevState) => ({
            ...prevState,
            Subject: prevState.Subject.filter(subject => subject !== subjectToRemove),
        }));
    };

    useEffect(() => {
        handleFetch();
    }, []);

    return (
        <div>
            <div className={`relative ${Show ? '' : 'hidden'} z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl py-5 px-4 transition-all sm:my-8 sm:w-full sm:max-w-5xl">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700"> <span className='text-red-500 text-lg'>*</span> Gender</label>
                                            <select
                                                name="Gender"
                                                value={Advanced.Gender}
                                                onChange={handleInputChange}
                                                className="mt-1 py-2 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900"
                                            >
                                                <option value="" disabled>Select a Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700"> <span className='text-red-500 text-lg'>*</span> Teaching Experience</label>
                                            <input
                                                type="text"
                                                name="TeachingExperience"
                                                value={Advanced.TeachingExperience}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700"> <span className='text-red-500 text-lg'>*</span> Range Of Tutor</label>
                                            <input
                                                type="text"
                                                name="RangeOftutor"
                                                value={Advanced.RangeOftutor}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700"> <span className='text-red-500 text-lg'>*</span> Vehicle Owned</label>
                                            <select
                                                name="VehicleOwned"
                                                value={Advanced.VehicleOwned}
                                                onChange={handleInputChange}
                                                className="mt-1 py-2 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-900"
                                            >
                                                <option value="">Select an option</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700"> <span className='text-red-500 text-lg'>*</span> Teaching Mode</label>
                                            <select
                                                name="TeachingMode"
                                                value={Advanced.TeachingMode}
                                                onChange={handleInputChange}
                                                className="mt-1 py-2 px-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm"
                                            >
                                                <option value="All">All</option>
                                                <option value="Home Tuition at Student's Home">Home Tuition at Student's Home</option>
                                                <option value="Home Tuition at Your Home">Home Tuition at Your Home</option>
                                                <option value="Institute or Group Tuition">Institute or Group Tuition</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700"> <span className='text-red-500 text-lg'>*</span> Location</label>
                                            <input
                                                type="text"
                                                name="Location"
                                                value={Advanced.Location}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                            />
                                            {locationSuggestions.length > 0 && (
                                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto max-h-48">
                                                    <ul className="list-none p-0 m-0">
                                                        {locationSuggestions.map((suggestion, index) => (
                                                            <li
                                                                key={index}
                                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                                                onClick={() => handleLocationSelect(suggestion)}
                                                            >
                                                                {suggestion.description}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 m-1">Subjects</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {Advanced.Subject.map((subject, index) => (
                                                    <span key={index} className="bg-red-500 text-white py-1 px-2 rounded-md">
                                                        {subject}
                                                        <button
                                                            type="button"
                                                            className="ml-2 text-white hover:text-gray-200"
                                                            onClick={() => removeSubject(subject)}
                                                        >
                                                            &times;
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <select
                                                name="Subject"
                                                value={Advanced.Subject}
                                                onChange={handleSubjectChange}
                                                className="block w-full py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm"
                                            >
                                                <option value="" disabled>Select Subjects</option>
                                                {allSubject.map((subject, index) => (
                                                    <option key={index} value={subject.SubjectName}>
                                                        {subject.SubjectName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700"> <span className='text-red-500 text-lg'>*</span> Min Range</label>
                                            <input
                                                type="text"
                                                name="MinRange"
                                                value={Advanced.MinRange}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"

                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700"> <span className='text-red-500 text-lg'>*</span> Max Range</label>
                                            <input
                                                type="text"
                                                name="MaxRange"
                                                value={Advanced.MaxRange}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"

                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isBestFaculty"
                                            id="isBestFaculty"
                                            checked={Advanced.isBestFaculty}
                                            onChange={(e) =>
                                                setAdvanced((prevState) => ({
                                                    ...prevState,
                                                    isBestFaculty: e.target.checked,
                                                }))
                                            }
                                            className="mr-2"
                                        />
                                        <label htmlFor="isBestFaculty" className="text-sm font-medium text-gray-700">
                                            Best Faculty
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto"
                                    onClick={handleSearchClick}
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    onClick={handleCloseAdvancedClick}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedSearchModel;
