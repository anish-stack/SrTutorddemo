import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Eye, Info, X, Loader2 } from 'lucide-react';



const Modal= ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const AllContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalType, setModalType] = useState(null);
  const contactsPerPage = 10;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('https://api.srtutorsbureau.com/api/v1/uni/get-all-contacts');
        if (response.data.success) {
          setContacts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`https://api.srtutorsbureau.com/api/v1/uni/delete-contact/${id}`);
        setContacts(contacts.filter((contact) => contact._id !== id));
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const openModal = (contact ,type) => {
    setSelectedContact(contact);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedContact(null);
    setModalType(null);
  };

  // Pagination
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);
  const pageCount = Math.ceil(contacts.length / contactsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">All Contacts</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Query From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentContacts.map((contact) => (
              <tr key={contact._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{contact.Name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-500">{contact.QueryType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-sm text-gray-500">{contact.Email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm text-gray-500">{contact.Phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(contact, 'message')}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Message"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openModal(contact, 'details')}
                      className="text-green-600 hover:text-green-800"
                      title="View Details"
                    >
                      <Info className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === index + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Message Modal */}
      <Modal
        isOpen={modalType === 'message'}
        onClose={closeModal}
        title="Message Details"
      >
        <p className="text-gray-700 whitespace-pre-wrap">{selectedContact?.Message}</p>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={modalType === 'details'}
        onClose={closeModal}
        title="Contact Details"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900">Basic Information</h4>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Name:</span> {selectedContact?.Name}</p>
              <p><span className="font-medium">Email:</span> {selectedContact?.Email}</p>
              <p><span className="font-medium">Phone:</span> {selectedContact?.Phone}</p>
              <p><span className="font-medium">Subject:</span> {selectedContact?.Subject}</p>
            </div>
          </div>

          {selectedContact?.StudentId && (
            <div>
              <h4 className="font-semibold text-gray-900">Student Details</h4>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Alt Phone:</span> {selectedContact.StudentId.AltPhoneNumber}</p>
                <p><span className="font-medium">Role:</span> {selectedContact.StudentId.Role}</p>
                <p><span className="font-medium">Verified:</span> {selectedContact.StudentId.isStudentVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AllContact;