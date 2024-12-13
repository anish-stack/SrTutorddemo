import React from 'react';

const TableHeader = () => (
  <thead className="bg-gray-100 sticky top-0">
    <tr>
      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Lead Type</th>
      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Contact</th>
      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date & Time</th>
      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
      <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Company</th>
    </tr>
  </thead>
);

export default TableHeader;