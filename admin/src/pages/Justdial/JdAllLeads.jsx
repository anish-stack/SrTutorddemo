import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { isDateInRange } from './dateUtils';
import FilterBar from './FilterBar';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import Pagination from './Pagination';


const JdAllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const leadsPerPage = 10;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get('https://api.srtutorsbureau.com/api/jd/get-Alllead');
        if (response.data.success) {
          setLeads(response.data.data);
        } else {
          setError('Failed to fetch leads.');
        }
      } catch (error) {
        setError('Error fetching leads: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const handleDateChange = (type, value) => {
    if (type === 'clear') {
      setStartDate('');
      setEndDate('');
      setCurrentPage(1);
    } else if (type === 'start') {
      setStartDate(value);
      setCurrentPage(1);
    } else {
      setEndDate(value);
      setCurrentPage(1);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(filter.toLowerCase()) ||
      lead.category.toLowerCase().includes(filter.toLowerCase()) ||
      lead.brancharea.toLowerCase().includes(filter.toLowerCase()) ||
      lead.pincode.toLowerCase().includes(filter.toLowerCase());
    
    const matchesDate = isDateInRange(lead.date, startDate, endDate);
    
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const currentLeads = filteredLeads.slice(
    (currentPage - 1) * leadsPerPage,
    currentPage * leadsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-2 lg:p-3">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Leads</h1>
        
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <TableHeader />
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLeads.map(lead => (
                  <TableRow key={lead._id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onJumpToPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default JdAllLeads;