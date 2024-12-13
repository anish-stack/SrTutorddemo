import React from 'react';
import { formatDate } from './dateUtils';

const TableRow = ({ lead }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="p-3 text-sm">{lead.leadtype || 'N/A'}</td>
    <td className="p-3 text-sm">
      <div className="font-medium">{lead.name || 'N/A'}</div>
      <div className="text-gray-500 text-xs">{lead.prefix}</div>
    </td>
    <td className="p-3 text-sm">
      <div>{lead.mobile || 'N/A'}</div>
      <div className="text-gray-500 text-xs">{lead.email}</div>
    </td>
    <td className="p-3 text-sm">
      <div>{formatDate(lead.date)}</div>
      <div className="text-gray-500 text-xs">{lead.time}</div>
    </td>
    <td className="p-3 text-sm">{lead.category || 'N/A'}</td>
    <td className="p-3 text-sm">
      <div>{lead.city || 'N/A'}</div>
      <div className="text-gray-500 text-xs">{lead.brancharea}</div>
      <div className="text-gray-500 text-xs">PIN: {lead.pincode}</div>
    </td>
    <td className="p-3 text-sm">{lead.company || 'N/A'}</td>
  </tr>
);

export default TableRow;