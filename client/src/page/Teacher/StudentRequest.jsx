import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Pagination, Card } from 'react-bootstrap';
import toast from 'react-hot-toast';

const StudentRequest = ({ id }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const fetchData = async (page) => {
        try {
            const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/uni/get-Request-teacher?id=${id}&page=${page}&limit=8`);
            const filteredData = response.data.data.filter(request => request.teacherAcceptThis === 'pending');
            setData(filteredData);
            console.log(filteredData)
            setTotalPages(Math.ceil((response.data.total || 0) / 8)); // Ensure total is valid
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAcceptOrDecline = async (requestId, status) => {
        try {
            await axios.post(`https://api.srtutorsbureau.com/api/v1/uni/Accept-Request`, {
                requestId,
                status,
                requestType: "teacher"
            });
            toast.success(`Request ${status === 'accepted' ? 'Accepted' : 'Declined'}`);
            fetchData(currentPage);
        } catch (error) {
            console.error('Error handling request:', error);
            toast.error("Error handling request");
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="container mt-4">
            {data.length > 0 ? (
                <>
                    <div className="d-none d-md-block">
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th>Class Name</th>
                                    <th>Interested In</th>
                                    <th>Subjects </th>
                                    <th>Sessions</th>
                                    <th>Budget</th>
                                    <th>Locality</th>
                                    <th>Start Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(request => (
                                    <tr key={request._id}>
                                        <td>{request.className}</td>

                                        <td>{request.interestedInTypeOfClass}</td>
                                        <td>{request.subjects.join(',') || 'Not-Available'}</td>
                                        <td>{request.numberOfSessions}</td>
                                        <td>{request.minBudget} - {request.maxBudget}</td>
                                        <td>{request.locality}</td>
                                        <td>{new Date(request.startDate).toLocaleDateString()}</td>
                                        <td>{request.teacherAcceptThis}</td>
                                        <td className='d-flex'>
                                            {request.teacherAcceptThis === 'pending' && (
                                                <>
                                                    <Button onClick={() => handleAcceptOrDecline(request._id, 'accepted')} variant="success" size="sm" className="me-2">Accept</Button>
                                                    <Button onClick={() => handleAcceptOrDecline(request._id, 'declined')} variant="danger" size="sm">Decline</Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Pagination>
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>

                    <div className="d-md-none">
                        {data.map(request => (
                            <Card key={request._id} className="mb-3">
                                <Card.Body>
                                    <Card.Title>{request.className}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Interested In: {request.interestedInTypeOfClass}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Sessions:</strong> {request.numberOfSessions}<br />
                                        <strong>Budget:</strong> {request.minBudget} - {request.maxBudget}<br />
                                        <strong>Locality:</strong> {request.locality}<br />
                                        <strong>Start Date:</strong> {new Date(request.startDate).toLocaleDateString()}
                                    </Card.Text>
                                    {request.teacherAcceptThis === 'pending' && (
                                        <div>
                                            <Button onClick={() => handleAcceptOrDecline(request._id, 'accepted')} variant="success" size="sm" className="me-2">Accept</Button>
                                            <Button onClick={() => handleAcceptOrDecline(request._id, 'declined')} variant="danger" size="sm">Decline</Button>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        ))}
                        <Pagination>
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                </>
            ) : (
                <div className="no-requests-container text-center mt-5">
                    <div className="alert alert-info py-4">
                        <h4 className="alert-heading">No Requests Found</h4>
                        <p className="mb-4">
                            Currently, there are no requests available. Please check back later.
                        </p>

                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentRequest;
