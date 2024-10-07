import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card,Alert, Container, Row, Col } from 'react-bootstrap';
import './SubscribedStudent.css'; // Custom CSS for animations and styles

const SubscribedStudent = ({id}) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:7000/api/v1/uni/get-Request-teacher?id=${id}&page=1&limit=8`);
            const filteredData = response.data.data.filter(request => request.dealDone === true && request.teacherAcceptThis !== 'declined');
            setData(filteredData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <Container className="mt-4">
        {data.length === 0 ? (
            <Alert variant="warning">
                You have not subscribed to any student.
            </Alert>
        ) : (
            <Row>
            {data && data.length > 0 ? (
              data.map((item) => (
                <Col md={6} lg={4} key={item._id} className="mb-4">
                  <Card className={`custom-card ${item.teacherAcceptThis === 'accepted' ? 'accepted' : 'pending'}`}>
                    <Card.Body>
                      <Card.Title>{item.className}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Student: {item.studentInfo.studentName}
                      </Card.Subtitle>
                      <Card.Text>
                        <strong>Contact:</strong> {item.studentInfo.contactNumber}
                        <br />
                        <strong>Email:</strong> {item.studentInfo.emailAddress}
                        <br />
                        <strong>Class Type:</strong> {item.interestedInTypeOfClass}
                        <br />
                        <strong>Sessions:</strong> {item.numberOfSessions}
                        <br />
                        <strong>Budget:</strong> {item.minBudget} - {item.maxBudget}
                        <br />
                        <strong>Locality:</strong> {item.locality}
                        <br />
                        <strong>Start Date:</strong> {new Date(item.startDate).toLocaleDateString()}
                      </Card.Text>
                      <Card.Footer>
                        <span className={`badge ${item.dealDone ? 'badge-success' : 'badge-secondary'}`}>
                          {item.dealDone ? 'Deal Done' : 'Pending'}
                        </span>
                      </Card.Footer>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No data available</p>
            )}
          </Row>
          
        )}
    </Container>
    );
};

export default SubscribedStudent;
