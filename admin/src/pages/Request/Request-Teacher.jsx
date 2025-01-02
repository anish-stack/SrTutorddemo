import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Modal Component
const MessageModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <h3 className="text-xl mb-4">Message</h3>
        <p>{message}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

const RequestTeacherContact = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Set the number of items per page
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    className: '',
    email: ''
  });
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [selectedMessage, setSelectedMessage] = useState(''); // Selected message content

  useEffect(() => {
    // Fetch the data from API
    axios.get('https://api.srtutorsbureau.com/api/v1/uni/class-requests')  // Replace with your actual API endpoint
      .then((response) => {
        const responseData = response.data.data.reverse();
        setData(responseData);
        setFilteredData(responseData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Filter data based on filters
  useEffect(() => {
    let filtered = data;

    if (filters.startDate) {
      filtered = filtered.filter(item =>
        new Date(item.request_id.startDate) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(item =>
        new Date(item.request_id.startDate) <= new Date(filters.endDate)
      );
    }

    if (filters.className) {
      filtered = filtered.filter(item =>
        item.request_id.className.toLowerCase().includes(filters.className.toLowerCase())
      );
    }

    if (filters.email) {
      filtered = filtered.filter(item =>
        item.Name.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);  // Reset to first page after filtering
  }, [filters, data]);

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle showing the message modal
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage('');
  };

  return (
    <div>
      

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Student Name</th>
            <th className="border border-gray-300 px-4 py-2">Contact Number</th>
            <th className="border border-gray-300 px-4 py-2">Class Name</th>
            <th className="border border-gray-300 px-4 py-2">Teacher Gender Preference</th>
            <th className="border border-gray-300 px-4 py-2">Number of Sessions</th>
            <th className="border border-gray-300 px-4 py-2">Teacher Name</th>
            <th className="border border-gray-300 px-4 py-2">Teacher Email</th>
            <th className="border border-gray-300 px-4 py-2">Teacher Contact Number</th>
            <th className="border border-gray-300 px-4 py-2">Message</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item._id}>
              <td className="border border-gray-300 px-4 py-2">{item.request_id.studentInfo.studentName}</td>
              <td className="border border-gray-300 px-4 py-2">{item.request_id.studentInfo.contactNumber}</td>
              <td className="border border-gray-300 px-4 py-2">{item.request_id.className}</td>
              <td className="border border-gray-300 px-4 py-2">{item.request_id.teacherGenderPreference}</td>
              <td className="border border-gray-300 px-4 py-2">{item.request_id.numberOfSessions}</td>
              <td className="border border-gray-300 px-4 py-2">{item.Name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.Email}</td>
              <td className="border border-gray-300 px-4 py-2">{item.Contact}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleViewMessage(item.message)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination mt-3">
        <button
          className="px-4 py-2 bg-blue-500 text-white"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="px-4 py-2 bg-blue-500 text-white"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Show modal when message is clicked */}
      {showModal && <MessageModal message={selectedMessage} onClose={closeModal} />}
    </div>
  );
};

export default RequestTeacherContact;
