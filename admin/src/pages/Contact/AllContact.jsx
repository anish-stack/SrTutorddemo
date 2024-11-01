import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

const AllContact = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [contactsPerPage] = useState(10);
    const [openMessageModal, setOpenMessageModal] = useState(false);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('https://api.srtutorsbureau.com/api/v1/uni/get-all-contacts');
                if (response.data.success) {
                    console.log(response.data.data);
                    setContacts(response.data.data);
                } else {
                    toast.error('Failed to fetch contacts.');
                }
            } catch (error) {
                console.error('Error fetching contacts:', error);
                toast.error('An error occurred while fetching contacts.');
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
                toast.success('Contact deleted successfully.');
            } catch (error) {
                console.error('Error deleting contact:', error);
                toast.error('Failed to delete contact.');
            }
        }
    };

    const handleViewMessage = (contact) => {
        setSelectedContact(contact);
        setOpenMessageModal(true);
    };

    const handleViewDetails = (contact) => {
        setSelectedContact(contact);
        setOpenDetailsModal(true);
    };

    // Get current contacts
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-semibold mb-4">All Contacts</h2>
            {loading ? (
                <p>Loading contacts...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">Name</th>
                                <th className="border border-gray-300 p-2">Query From</th>
                                <th className="border border-gray-300 p-2">Email</th>
                                <th className="border border-gray-300 p-2">Phone</th>
                                <th className="border border-gray-300 p-2">Subject</th>
                                <th className="border border-gray-300 p-2">Message</th>
                                <th className="border border-gray-300 p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentContacts.map((contact) => (
                                <tr key={contact._id}>
                                    <td className="border border-gray-300 p-2">{contact.Name}</td>
                                    <td className="border border-gray-300 p-2">{contact.QueryType}</td>
                                    <td className="border border-gray-300 p-2">{contact.Email}</td>
                                    <td className="border border-gray-300 p-2">{contact.Phone}</td>
                                    <td className="border border-gray-300 p-2">{contact.Subject}</td>
                                    <td className="border border-gray-300 p-2 truncate max-w-xs">{contact.Message}</td>
                                    <td className="border border-gray-300 p-2">
                                        <button
                                            onClick={() => handleDelete(contact._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mr-2"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        <button
                                            onClick={() => handleViewMessage(contact)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                                        >
                                            <FontAwesomeIcon icon={faEye} /> View
                                        </button>
                                        <button
                                            onClick={() => handleViewDetails(contact)}
                                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                        >
                                            <FontAwesomeIcon icon={faInfoCircle} /> See
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: Math.ceil(contacts.length / contactsPerPage) }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {/* Message Modal */}
                    <Modal open={openMessageModal} onClose={() => setOpenMessageModal(false)} center>
                        <h2 className="text-xl font-semibold mb-4">Message Details</h2>
                        <p>{selectedContact?.Message}</p>
                    </Modal>

                    {/* Full Details Modal */}
                    <Modal open={openDetailsModal} onClose={() => setOpenDetailsModal(false)} center>
                        <h2 className="text-xl font-semibold mb-4">Full Contact Details</h2>
                        <p><strong>Name:</strong> {selectedContact?.Name}</p>
                        <p><strong>Email:</strong> {selectedContact?.Email}</p>
                        <p><strong>Phone:</strong> {selectedContact?.Phone}</p>
                        <p><strong>Subject:</strong> {selectedContact?.Subject}</p>
                        <p><strong>Message:</strong> {selectedContact?.Message}</p>
                       
                        {
    selectedContact?.StudentId ? (
        <div>
             <h2 className='text-xl font-bold mt-4 mb-2'>Student Details From Db</h2>
            <p><strong>Alt Phone Number:</strong> {selectedContact?.StudentId?.AltPhoneNumber}</p>
            {/* <p><strong>Email:</strong> {selectedContact?.StudentId?.Email}</p> */}
            <p><strong>Role:</strong> {selectedContact?.StudentId?.Role}</p>
            <p><strong>Student Verified:</strong> {selectedContact?.StudentId?.isStudentVerified ? 'Yes' : 'No'}</p>
        </div>
    ) : null
}

                    </Modal>
                </div>
            )}
        </div>
    );
};

export default AllContact;
