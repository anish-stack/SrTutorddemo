import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchTeacher = () => {
    const [formData, setFormData] = useState({
        Subject: '',
        Area: '',
        City: '',
        District: '',
        Class: '',
        ClassId: '',
        Pincode:'',
        Gender: '',
        TeachingMode: '',
    });

    const [selectedClass, setSelectedClass] = useState({ classid: '', classNameValue: '' });
    const [subjects, setSubjects] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [areas, setAreas] = useState([]);
    const [concatenatedData, setConcatenatedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [classData, setClassData] = useState([]);
    const [results, setResults] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        if (classData.length > 0) {
            const filterOutClasses = ["I-V", "VI-VIII", "IX-X", "XI-XII"];
            const filteredClasses = classData
                .filter(item => !filterOutClasses.includes(item.Class))
                .map(item => ({ class: item.Class, id: item._id }));

            const rangeClasses = classData
                .filter(item => item.InnerClasses && item.InnerClasses.length > 0)
                .flatMap(item => item.InnerClasses.map(innerClass => ({
                    class: innerClass.InnerClass,
                    id: innerClass._id
                })));

            setConcatenatedData([...rangeClasses, ...filteredClasses]);
        }
    }, [classData]);


    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [fetchClass] = await Promise.all([
                axios.get('https://api.srtutorsbureau.com/api/v1/admin/Get-Classes')
            ]);

            const classes = fetchClass.data.data.sort((a, b) => a.position - b.position);
            setClassData(classes);
        } catch (err) {
            setError("Error fetching initial data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);


    const fetchSubjects = async (classId) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/admin/Get-Class-Subject/${classId}`);
            console.log(response.data.data.Subjects)
            setSubjects(response.data.data.Subjects);
        } catch (err) {
            setError("Error fetching subjects");
        } finally {
            setLoading(false);
        }
    };

    const handleClassChange = (event) => {
        const selectedClassId = event.target.value;
        const selectedClassObj = concatenatedData.find(cls => cls.id === selectedClassId);
        if (selectedClassObj) {
            setSelectedClass({ classid: selectedClassObj.id, classNameValue: selectedClassObj.class });
            setFormData((prev) => ({
                ...prev,
                ClassId: selectedClassObj.id,
                Class: selectedClassObj.class,
            }));
            fetchSubjects(selectedClassId);
        }
    };

    const getCities = async () => {
        try {
            const { data } = await axios.get("http://localhost:7000/api/jd/getStates");
            setCities(data.map(City => ({ value: City, label: City })));
        } catch (error) {
            console.log(error);
        }
    };

    const getDistricts = async (city) => {
        try {
            const { data } = await axios.get(`http://localhost:7000/api/jd/getCitiesByState?state=${city}`);
            setDistricts(data.map(district => ({ value: district, label: district })));
        } catch (error) {
            console.log(error);
        }
    };

    const getAreasByDistrict = async (city) => {
        try {
            const { data } = await axios.get(`http://localhost:7000/api/jd/getAreasByCity?city=${city}`);
            setAreas(data.map(area => ({ value: area.placename, label: area.placename })));
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        console.log("Form Data:", formData); // Log form data to console
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:7000/api/v1/admin/make-search', formData);
            console.log(response.data.data)
            if (response.data.data.length > 0) {
                setResults(response.data.data);
      

            } else {
                setResults([]);
                setError("No results found for the search");
            }
        } catch (err) {
            setError("Error performing search");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCities();
    }, []);

    return (
        <>
            <div className="p-4 h-screen">
                {results ? (
                    results.length > 0 ? (
                        <>
                            <button onClick={() => setResults([])} className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-md">Search Again</button>
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="py-2 px-4 border-b">Full Name</th>
                                        <th className="py-2 px-4 border-b">Contact Number</th>
                                        <th className="py-2 px-4 border-b">Teaching Areas</th>
                                        <th className="py-2 px-4 border-b">Class Name</th>
                                        <th className="py-2 px-4 border-b">Subjects</th>
                                        <th className="py-2 px-4 border-b">address</th>
                                        <th className="py-2 px-4 border-b">Action</th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-100">
                                            <td className="py-2 px-4 border-b">{item.FullName}</td>
                                            <td className="py-2 px-4 border-b">{item.ContactNumber}</td>
                                            <td className="py-2 px-4 border-b">
                                                {item.TeachingLocation.Area.join(", ")}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {item.AcademicInformation.map(info => info.className).join(", ")}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {item.AcademicInformation.flatMap(info => info.SubjectNames).join(", ")}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {item.PermanentAddress.streetAddress}, {item.PermanentAddress.Area}, {item.PermanentAddress.City}, {item.PermanentAddress.Pincode}
                                            </td>
                                            <td>
                                                <button onClick={() => window.location.href = `/Manage-Teacher/${item.TeacherUserId}`} className="mb-4 py-2 px-4 whitespace-nowrap bg-green-500 text-white rounded-md">Show Profile</button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <form
                            className="max-w-3xl mx-auto h-full flex flex-col justify-center bg-white border rounded-lg shadow-md p-6"
                            onSubmit={handleSubmit} // Ensure this function is defined
                        >
                            {error && <p className="text-red-500 mb-2">{error}</p>} {/* Ensure error is defined */}
                            {loading && <p className="text-blue-500">Loading...</p>} {/* Ensure loading is defined */}

                            <div className="space-y-4">
                                {/* Class Selection */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Class</label>
                                    <select
                                        onChange={handleClassChange}
                                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-400"
                                    >
                                        <option value="">Select Class...</option>
                                        {concatenatedData.map((cls) => (
                                            <option key={cls.id} value={cls.id}>{cls.class}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subject Selection */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Subject</label>
                                    <select
                                        onChange={handleChange}
                                        name="Subject"
                                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-400"
                                    >
                                        <option value="">Select Subject...</option>
                                        {subjects.map((subject) => (
                                            <option key={subject._id} value={subject.SubjectName}>
                                                {subject.SubjectName}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* City Selection */}
                                    <div>
                                        <label className="block text-gray-700 font-medium">City</label>
                                        <select
                                            onChange={(e) => { handleChange(e); getDistricts(e.target.value); }} // Ensure functions are defined
                                            name="City"
                                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-400"
                                        >
                                            <option value="">Select City...</option>
                                            {cities.map((city, index) => (
                                                <option key={index} value={city.value}>{city.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* District Selection */}
                                    <div>
                                        <label className="block text-gray-700 font-medium">District</label>
                                        <select
                                            onChange={(e) => { handleChange(e); getAreasByDistrict(e.target.value); }} // Ensure functions are defined
                                            name="District"
                                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-400"
                                        >
                                            <option value="">Select District...</option>
                                            {districts.map((district, index) => (
                                                <option key={index} value={district.value}>{district.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Area Selection */}
                                    <div>
                                        <label className="block text-gray-700 font-medium">Area</label>
                                        <select
                                            onChange={handleChange} // Ensure this function is defined
                                            name="Area"
                                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-400"
                                        >
                                            <option value="">Select Area...</option>
                                            {areas.map((area) => (
                                                <option key={area.value} value={area.value}>{area.value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-semibold text-center my-4">Or</h3>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Search Via Pincode</label>
                                    <input
                                        type="text"
                                        onChange={handleChange} 
                                        name="Pincode"
                              
                                      
                                        placeholder="Enter Pincode"
                                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-400"
                                    />
                                </div>

                                {/* Gender Selection */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Gender</label>
                                    <select
                                        onChange={handleChange} // Ensure this function is defined
                                        name="Gender"
                                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-400"
                                    >
                                        <option value="">Select Gender...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                {/* Teaching Mode Selection */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Teaching Mode</label>
                                    <select
                                        onChange={handleChange} // Ensure this function is defined
                                        name="TeachingMode"
                                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-400"
                                    >
                                        <option value="">Select Teaching Mode...</option>
                                        <option value="Online">Online</option>
                                        <option value="Offline">Offline</option>
                                        <option value="Any">Any</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-6 w-full py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition duration-200"
                            >
                                Search
                            </button>
                        </form>
                    )
                ) : null}
            </div>
        </>
    );

};

export default SearchTeacher;
