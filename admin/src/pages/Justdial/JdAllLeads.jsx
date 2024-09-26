import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JdAllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(5);
  const [filter, setFilter] = useState('');

  // Fetch leads from API
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

  useEffect(() => {
    fetchLeads();
  }, []);

  // Pagination Logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads
  .filter(lead => 
    lead.name.toLowerCase().includes(filter.toLowerCase()) ||
    lead.category.toLowerCase().includes(filter.toLowerCase()) ||
    lead.brancharea.toLowerCase().includes(filter.toLowerCase()) ||
    lead.pincode.toLowerCase().includes(filter.toLowerCase())
  )
  .slice(indexOfFirstLead, indexOfLastLead);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(leads.filter(lead => 
    lead.name.toLowerCase().includes(filter.toLowerCase()) ||
    lead.category.toLowerCase().includes(filter.toLowerCase()) ||
    lead.brancharea.toLowerCase().includes(filter.toLowerCase()) ||
    lead.pincode.toLowerCase().includes(filter.toLowerCase())
  ).length / leadsPerPage);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Leads</h1>

      {/* Filter Input */}
      <input
        type="text"
        placeholder="Filter by name"
        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* Table */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {/* <th className="border border-gray-300 p-2">Lead ID</th> */}
            <th className="border border-gray-300 p-2">Lead Type</th>
            <th className="border border-gray-300 p-2">Prefix</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Mobile</th>
            <th className="border border-gray-300 p-2">Phone</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">City</th>
            <th className="border border-gray-300 p-2">Area</th>
            <th className="border border-gray-300 p-2">Branch Area</th>
            {/* <th className="border border-gray-300 p-2">DNC Mobile</th> */}
            {/* <th className="border border-gray-300 p-2">DNC Phone</th> */}
            <th className="border border-gray-300 p-2">Company</th>
            <th className="border border-gray-300 p-2">Pincode</th>
            <th className="border border-gray-300 p-2">Time</th>
            <th className="border border-gray-300 p-2">Branch Pin</th>
            {/* <th className="border border-gray-300 p-2">Parent ID</th> */}
          </tr>
        </thead>
        <tbody>
          {currentLeads.length === 0 ? (
            <tr>
              <td colSpan="19" className="text-center p-2">No leads found.</td>
            </tr>
          ) : (
            currentLeads.map((lead) => (
              <tr key={lead._id}>
                {/* <td className="border border-gray-300 p-2">{lead.leadid || "Not-available"}</td> */}
                <td className="border border-gray-300 p-2">{lead.leadtype || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{lead.prefix || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{lead.name || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{lead.mobile || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{lead.phone || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{lead.email || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{new Date(lead.date).toLocaleDateString() || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{lead.category || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{lead.city || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{lead.area || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{lead.brancharea || "Not-available"}</td>
                {/* <td className="border border-gray-300 p-2">{lead.dncmobile || "Not-available"}</td> */}
                {/* <td className="border border-gray-300 p-2">{lead.dncphone || "Not-available"}</td> */}
                <td className="border border-gray-300 p-2">{lead.company || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{lead.pincode || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{lead.time || "Not-available"}</td>
                <td className="border border-gray-300 p-2">{lead.branchpin || "Not-available"}</td>
                {/* <td className="border border-gray-300 p-2">{lead.parentid || "Not-available"}</td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JdAllLeads;
