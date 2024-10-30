import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Leads from './Leads';

const TeacherWithLead = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 8;
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [open, setOpen] = useState(false)
    const [selectedlead, setSelectedLead] = useState([])

    // Fetch data from the server
const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:7000/api/v1/teacher/Get-Teacher-With-Lead');
            if (data.data) {
                setData(data.data);

                setFilteredData(data.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
};

const handleOpen = (lead) => {
        setOpen(true)
        setSelectedLead(lead)
}

    const handleClose = () => {
        setOpen(false)
        setSelectedLead([])
    }
    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        filterData(e.target.value, startDate, endDate);
    };

    // Filter data based on search and date range
    const filterData = (searchTerm, start, end) => {
        let tempData = data;

        // Filter by search term
        if (searchTerm) {
            tempData = tempData.filter(item =>
                item.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.TeachingMode.toLowerCase().includes(searchTerm.toLowerCase()) ||

                item.ContactNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.Gender.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date range
        if (start && end) {
            tempData = tempData.filter(item => {
                const joiningDate = new Date(item.createdAt);
                const startDateObj = new Date(start);
                const endDateObj = new Date(end);
                return joiningDate >= startDateObj && joiningDate <= endDateObj;
            });
        }

        setFilteredData(tempData);
    };

    // Handle date filter
    const handleDateFilter = (e) => {
        console.log("handleDateFilter")
        e.preventDefault();
        filterData(search, startDate, endDate);
    };

    // Pagination
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='w-full'>
            <div className='mt-4 py-4'>
                <h2 className='text-lg md:text-xl'>Teacher With Lead</h2>
            </div>

            {/* Search and Date Filter Form */}
            <div>
                <form className="max-w-full flex flex-col md:flex-row items-center justify-between mx-auto p-4 bg-white rounded-lg " >
                    <div className="mb-4 w-full ">
                        <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <input
                            type="search"
                            id="search"
                            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search Teacher Via Name, Number, Gender,Teaching Mode ..."
                            value={search}
                            onChange={handleSearch} 
                        />
                    </div>


                </form>
                <div className="flex space-x-4 mb-4 w-full ">
                    <div className="relative w-full ">
                        <label htmlFor="startDate" className="text-sm font-medium text-gray-900">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full ">
                        <label htmlFor="endDate" className="text-sm font-medium text-gray-900">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={endDate}

                            onChange={(e) => {
                                setEndDate(e.target.value);
                                handleDateFilter(e); // Passing the event if needed
                            }}
                        />
                    </div>




                </div>
            </div>
            {/* Loading Spinner */}
            {loading ? (
                <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className='mt-4'>
                    <div className="relative overflow-x-auto sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Gender</th>
                                    <th scope="col" className="px-6 py-3">Contact Number</th>
                                    <th scope="col" className="px-6 py-3">Teaching Experience</th>
                                    <th scope="col" className="px-6 py-3">Teaching Mode</th>
                                    <th scope="col" className="px-6 py-3">Leads</th>
                                    <th scope="col" className="px-6 py-3">Date Of Join</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems && currentItems.length > 0 ? (
                                    currentItems.map((item, index) => (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.FullName}
                                            </th>
                                            <td className="px-6 py-4">{item.Gender}</td>
                                            <td className="px-6 py-4">{item.ContactNumber}</td>
                                            <td className="px-6 py-4">{item.TeachingExperience}</td>
                                            <td className="px-6 py-4">{item.TeachingMode}</td>
                                            <td className="px-6 py-4">{item.LeadIds.length || "0"}</td>
                                            <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString('en-US')}</td>
                                            <td className="flex items-center px-6 py-4">
                                                <a href="#" onClick={() => handleOpen(item.LeadIds)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Check leads</a>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4">No Data Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4">
                        <nav>
                            <ul className="flex justify-center space-x-2">
                                {Array.from({ length: Math.ceil(filteredData.length / itemPerPage) }, (_, i) => (
                                    <li key={i} className={`inline-block ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} border border-blue-600 rounded`}>
                                        <a
                                            onClick={() => paginate(i + 1)}
                                            className={`block px-4 py-2 transition-colors duration-300 ease-in-out ${currentPage === i + 1 ? 'hover:bg-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`}
                                            href="#"
                                        >
                                            {i + 1}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                </div>
            )}
            <Leads isOpen={open} onClose={handleClose} leads={selectedlead} />
        </div>
    );
};

export default TeacherWithLead;
