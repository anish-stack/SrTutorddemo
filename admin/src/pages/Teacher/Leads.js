import React, { useState } from 'react';

const Leads = ({ leads = [], isOpen, onClose }) => {
    const itemsPerPage = 5; // Number of leads per page
    const [currentPage, setCurrentPage] = useState(1);
    const [searchLeadId, setSearchLeadId] = useState("");
    const [searchTeacherId, setSearchTeacherId] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const filteredLeads = leads.filter(lead =>
        lead.LeadId.toLowerCase().includes(searchLeadId.toLowerCase())
    );

    const indexOfLastLead = currentPage * itemsPerPage;
    const indexOfFirstLead = indexOfLastLead - itemsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

    const extractParametersFromUrl = (url) => {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        return {
            ClassNameValue: urlParams.get('ClassNameValue'),
            locationParam: urlParams.get('locationParam'),
            Subject: urlParams.get('Subject')
        };
    };

    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl overflow-hidden">
                    <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-teal-400 text-white p-4">
                        <h2 className="text-lg font-semibold">Leads ({filteredLeads.length})</h2>
                        <button onClick={onClose} className="text-white font-bold text-lg">&times;</button>
                    </div>

                    {/* Search Inputs */}
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <input
                                type="text"
                                placeholder="Search by Lead ID"
                                value={searchLeadId}
                                onChange={(e) => setSearchLeadId(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                    </div>

                    {/* Leads Data Table */}
                    <div className="p-6 max-h-96 overflow-y-auto">
                        {currentLeads.length > 0 ? (
                            <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Lead ID</th>
                                        <th className="px-4 py-2 text-left">Contact</th>
                                        <th className="px-4 py-2 text-left">Location</th>
                                        <th className="px-4 py-2 text-left">Class</th>
                                        <th className="px-4 py-2 text-left">Subject</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Send Time</th>
                                        <th className="px-4 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentLeads.map((lead, index) => {
                                        const { ClassNameValue, locationParam, Subject } = extractParametersFromUrl(lead.SearchUrl);

                                        return (
                                            <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                                <td className="px-4 py-2">{lead.LeadId}</td>
                                                <td className="px-4 py-2">{lead.UserInfo.ContactNumber}</td>
                                                <td className="px-4 py-2">{locationParam}</td>
                                                <td className="px-4 py-2">{ClassNameValue}</td>
                                                <td className="px-4 py-2">{Subject}</td>
                                                <td className={`px-4 py-2 ${lead.LeadSendStatus === 'sent' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {lead.LeadSendStatus}
                                                </td>
                                                <td className="px-4 py-2">{new Date(lead.LeadSendTime).toLocaleString('en-US')}</td>
                                                <td className="px-4 py-2">
                                                    <a href={lead.SearchUrl} target="_blank" className="text-blue-500 underline">
                                                        View Search
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-gray-500">No leads found</p>
                        )}
                    </div>

                    {/* Pagination Section */}
                    <div className="flex justify-center items-center p-4 border-t">
                        <ul className="flex space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i}>
                                    <button
                                        onClick={() => paginate(i + 1)}
                                        className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-blue-200'}`}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    );
};

export default Leads;
