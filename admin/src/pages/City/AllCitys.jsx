import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { CiLocationArrow1 } from 'react-icons/ci';

const AllCitys = () => {
    const [cities, setCities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    const [formData, setFormData] = useState({
        CityName: '',
        file: null
    });
    const [loading,setLoading] = useState(false)

    const fetchData = async () => {
        try {
            const response = await axios.get('https://api.srtutorsbureau.com/api/v1/admin/get-City');
            if (response.data.success) {
                setCities(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
            toast.error("Failed to fetch cities.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            file: e.target.files[0]
        }));
    };

    const createCity = async () => {
        const data = new FormData();
        data.append('CityName', formData.CityName);
        if (formData.file) data.append('image', formData.file);
        setLoading(true)
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/admin/Create-City', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                fetchData();
                setIsCreateModalOpen(false);
                toast.success("City created successfully.");
                setLoading(false)
            }
        } catch (error) {
            console.error("Error creating city:", error);
            toast.error("Failed to create city.");
            setLoading(false)
        }
    };

    const deleteCity = async () => {
        if (!selectedCity) return;
        setLoading(true)
        try {
            await axios.delete(`https://api.srtutorsbureau.com/api/v1/admin/delete-City/${selectedCity._id}`);
            fetchData();
            setIsConfirmModalOpen(false);
            toast.success("City deleted successfully.");
            setLoading(false)
        } catch (error) {
            console.error("Error deleting city:", error);
            toast.error("Failed to delete city.");
            setLoading(false)
        }
    };

    const updateCity = async () => {
        if (!selectedCity) return;

        const data = new FormData();
        data.append('CityName', formData.CityName);
        if (formData.file) data.append('image', formData.file);
        setLoading(true)
        try {
            await axios.put(`https://api.srtutorsbureau.com/api/v1/admin/update-City/${selectedCity._id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchData();
            setIsEditModalOpen(false);
            setLoading(false)
            toast.success("City updated successfully.");
        } catch (error) {
            console.error("Error updating city:", error);
            toast.error("Failed to update city.");
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastCity = currentPage * itemsPerPage;
    const indexOfFirstCity = indexOfLastCity - itemsPerPage;
    const currentCities = cities.slice(indexOfFirstCity, indexOfLastCity);

    return (
        <div className="p-6">
            <div className='flex items-center justify-between'>
                <h1 className="text-2xl font-bold mb-4">All Cities</h1>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-4 py-1 font-semibold text-red-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                >
                    Add City <CiLocationArrow1 />
                </button>
            </div>

            {/* Create City Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Create City</h2>
                        <form onSubmit={(e) => { e.preventDefault(); createCity(); }}>
                            <input
                                type="text"
                                name="CityName"
                                placeholder="City Name"
                                className="mb-4 p-2 border border-gray-300 rounded w-full"
                                onChange={handleInputChange}
                            />
                            <input
                                type="file"
                                name="image"
                                className="mb-4 p-2 border border-gray-300 rounded w-full"
                                onChange={handleFileChange}
                            />
                            <div className='flex gap-2'>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >
                                   {loading ? 'Please Wait.....':'Create-City'}
                                </button>
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-4 py-1 font-semibold text-red-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit City Modal */}
            {isEditModalOpen && selectedCity && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Edit City</h2>
                        <form onSubmit={(e) => { e.preventDefault(); updateCity(); }}>
                            <input
                                type="text"
                                name="CityName"
                                placeholder="City Name"
                                className="mb-4 p-2 border border-gray-300 rounded w-full"
                                defaultValue={selectedCity.CityName}
                                onChange={handleInputChange}
                            />
                            <input
                                type="file"
                                name="image"
                                className="mb-4 p-2 border border-gray-300 rounded w-full"
                                onChange={handleFileChange}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                 {loading ? 'Please Wait.....':'  Update City'}
                              
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this city?</p>
                        <div className="mt-4">
                            <button
                                onClick={deleteCity}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* City Table */}
            <table className="w-full bg-white border border-gray-200 rounded">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="p-2 text-left">City Name</th>
                        <th className="p-2 text-left">Image</th>
                        <th className="p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCities.map((city) => (
                        <tr key={city._id} className="border-b">
                            <td className="p-2">{city.CityName}</td>
                            <td className="p-2">
                                <img
                                    src={city.CityImage.url}
                                    alt={city.CityName}
                                    className="w-16 h-16 object-cover"
                                />
                            </td>
                            <td className="flex gap-3 p-2">
                                <button
                                    onClick={() => {
                                        setSelectedCity(city);
                                        setIsEditModalOpen(true);
                                    }}
                                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"

                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedCity(city);
                                        setIsConfirmModalOpen(true);
                                    }}
                                    className="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-4 py-1 font-semibold text-red-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:opacity-100 transition duration-150"

                                >
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex justify-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300"
                >
                    Previous
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={indexOfLastCity >= cities.length}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllCitys;
