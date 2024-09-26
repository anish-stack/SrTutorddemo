import React, { useEffect, useState } from 'react';
import { MdVerified } from 'react-icons/md';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios'; // Make sure axios is imported
import toast from 'react-hot-toast';

const Upload = ({ teacherId }) => {
    console.log(teacherId)
    const [formData, setFormData] = useState({
        DocumentType: 'Aadhaar',
        DocumentImage: null, // file for identity document
        QualificationDocument: null // file for qualification document
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [identityPreview, setIdentityPreview] = useState(null);
    const [qualificationPreview, setQualificationPreview] = useState(null);



    const handleIdentityFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIdentityPreview(URL.createObjectURL(file));
            setFormData({ ...formData, DocumentImage: file });
        }
    };

    const handleQualificationFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setQualificationPreview(URL.createObjectURL(file));
            setFormData({ ...formData, QualificationDocument: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('Document', formData.DocumentImage);
        data.append('Qualification', formData.QualificationDocument);
        data.append('DocumentType', formData.DocumentType);

        setLoading(true);
        try {
            const response = await axios.post(
                `https://api.srtutorsbureau.com/api/v1/teacher/teacher-document/${teacherId?.TeacherUserId?._id}?DocumentType=${formData.DocumentType}`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Response:', response.data);
            toast.success("Document Upload Successful Please Wait 24 Hours For Complete Verification")
        } catch (error) {
            console.error('Error uploading documents:', error);
            setError(true);
        } finally {
            setLoading(false);
        }

        console.log('Form Data:', formData); // Console log all form data
    };

    return (
        <div className="mt-4">
            
            {teacherId.TeacherUserId?.QualificationDocument?.QualificationImageUrl ? (
              <div className="container mt-4">
             
             <div className="text-center ">
                  {teacherId.TeacherUserId?.DocumentStatus ? (
                      <span className="badge bg-success p-2">Verified</span>
                  ) : (
                      <span className="badge bg-danger p-2">Not Verified</span>
                  )}
              </div>
              <h5 className="">Uploaded Documents:</h5>
          
              <div className="row postion-absolute ">
                  {/* Qualification Document Section */}
                  <div className="col-md-6 mb-4">
                      <div className="card p-3">
                          <h6 className="card-title">Qualification Document</h6>
                          {teacherId.TeacherUserId?.QualificationDocument?.QualificationImageUrl ? (
                              <img
                                  src={teacherId.TeacherUserId.QualificationDocument.QualificationImageUrl}
                                  alt="Qualification Document"
                                  className="img-thumbnail"
                                  style={{ width: "150px", height: "auto" }}
                              />
                          ) : (
                              <p className="text-muted">No Qualification Document Uploaded</p>
                          )}
                      </div>
                  </div>
          
                  {/* Identity Document Section */}
                  <div className="col-md-6 mb-4">
                      <div className="card p-3">
                          <h6 className="card-title">Identity Document</h6>
                          {teacherId.TeacherUserId?.identityDocument?.DocumentImageUrl ? (
                              <>
                                  <img
                                      src={teacherId.TeacherUserId.identityDocument?.DocumentImageUrl}
                                      alt="Identity Document"
                                      className="img-thumbnail"
                                      style={{ width: "150px", height: "auto" }}
                                  />
                                  <p className="mt-2">{teacherId.TeacherUserId.identityDocument?.DocumentType}</p>
                              </>
                          ) : (
                              <p className="text-muted">No Identity Document Uploaded</p>
                          )}
                      </div>
                  </div>
              </div>
            
              {/* Document Status Badge */}
             
          </div>
          
            
            ) : (
                /* Show Form to Upload Documents */
                <Form onSubmit={handleSubmit}>
                    <Card className="mb-4 p-3">
                        <h5>For Identity Verification</h5>
                        <Row className="mb-3">
                            <Col>
                                <Form.Check
                                    type="radio"
                                    label="Aadhaar"
                                    name="documentType"
                                    value="Aadhaar"
                                    checked={formData.DocumentType === "Aadhaar"}
                                    onChange={(e) =>
                                        setFormData({ ...formData, DocumentType: e.target.value })
                                    }
                                />
                            </Col>
                            <Col>
                                <Form.Check
                                    type="radio"
                                    label="Pan"
                                    name="documentType"
                                    value="Pan"
                                    checked={formData.DocumentType === "Pan"}
                                    onChange={(e) =>
                                        setFormData({ ...formData, DocumentType: e.target.value })
                                    }
                                />
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Upload Identity Document</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleIdentityFileChange}
                            />
                            {identityPreview && (
                                <img
                                    src={identityPreview}
                                    alt="Identity Preview"
                                    className="mt-3 img-thumbnail"
                                    style={{ width: "100px", height: "100px" }}
                                />
                            )}
                        </Form.Group>
                    </Card>

                    <Card className="mb-4 p-3">
                        <h5>For Qualification Verification</h5>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Upload a Higher Education Qualification Document
                            </Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleQualificationFileChange}
                            />
                            {qualificationPreview && (
                                <img
                                    src={qualificationPreview}
                                    alt="Qualification Preview"
                                    className="mt-3 img-thumbnail"
                                    style={{ width: "100px", height: "100px" }}
                                />
                            )}
                        </Form.Group>
                    </Card>

                    <Button type="submit" className="mt-3" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                    {error && <p className="text-danger mt-3">Error uploading documents. Please try again.</p>}
                </Form>
            )}
        </div>

    );
};

export default Upload;
