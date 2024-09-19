import React, { useEffect, useState } from 'react';
import { MdVerified } from 'react-icons/md';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios'; // Make sure axios is imported
import toast from 'react-hot-toast';

const UploadDocuments = ({ Document, Profile }) => {

    const [TeacherProfile, setTeacherProfile] = useState(null);
    const [formData, setFormData] = useState({
        DocumentType: 'Aadhaar',
        DocumentImage: null, // file for identity document
        QualificationDocument: null // file for qualification document
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [identityPreview, setIdentityPreview] = useState(null);
    const [qualificationPreview, setQualificationPreview] = useState(null);

    useEffect(() => {
        if (Profile) {
            setTeacherProfile(Profile);
        } else {
            setTeacherProfile(null);
        }
    }, [Profile]);

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
                `https://api.srtutorsbureau.com/api/v1/teacher/teacher-document/${Profile?.TeacherUserId}?DocumentType=${formData.DocumentType}`,
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
        <Card className="p-4 shadow-sm">
            {TeacherProfile && TeacherProfile?.DocumentId ? (
               <div className="container my-4">
               <h2 className="mb-4">My Documents</h2>
               <div className="row">
                 <div className="col-12 mb-3">
                   <h6 className={`tags p-2 rounded-pill ${Document?.status ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                     {Document?.status ? 'Verified' : 'Pending Verification'}
                   </h6>
                 </div>
                 <div className="col-12">
                   <div className="row">
                     <div className="col-md-6 mb-4">
                       <h5 className="mb-2">Identity Document</h5>
                       <p>{Document?.identityDocument?.DocumentType}</p>
                       <img className="img-fluid w-75 img-thumbnail" src={Document?.identityDocument?.DocumentImageUrl} alt="Identity Document" />
                     </div>
                     <div className="col-md-6 mb-4">
                       <h5 className="mb-2">Qualification Document</h5>
                       <p>Qualification Document</p>
                       <img className="img-fluid w-75 img-thumbnail" src={Document?.QualificationDocument?.QualificationImageUrl} alt="Qualification Document" />
                     </div>
                   </div>
                 </div>
               </div>
             </div>
             
            ) : (
                <div className="w-100">
                    <h4>
                        Upload Documents Here In Just 2 Min and Get Verified{' '}
                        <span><MdVerified /></span>
                    </h4>
                    <div className="mt-4">
                        <Form onSubmit={handleSubmit}>
                            <Card className="mb-4 p-3">
                                <h5>For Identical Verification</h5>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Check
                                            type="radio"
                                            label="Aadhaar"
                                            name="documentType"
                                            value="Aadhaar"
                                            checked={formData.DocumentType === 'Aadhaar'}
                                            onChange={(e) => setFormData({ ...formData, DocumentType: e.target.value })}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Check
                                            type="radio"
                                            label="Pan"
                                            name="documentType"
                                            value="Pan"
                                            checked={formData.DocumentType === 'Pan'}
                                            onChange={(e) => setFormData({ ...formData, DocumentType: e.target.value })}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Check
                                            type="radio"
                                            label="Voter Card"
                                            name="documentType"
                                            value="Voter Card"
                                            checked={formData.DocumentType === 'Voter Card'}
                                            onChange={(e) => setFormData({ ...formData, DocumentType: e.target.value })}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Check
                                            type="radio"
                                            label="Passport"
                                            name="documentType"
                                            value="Passport"
                                            checked={formData.DocumentType === 'Passport'}
                                            onChange={(e) => setFormData({ ...formData, DocumentType: e.target.value })}
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
                                        <img src={identityPreview} alt="Identity Preview" className="mt-3" style={{ width: '100px', height: '100px' }} />
                                    )}
                                </Form.Group>
                            </Card>

                            <Card className="mb-4 p-3">
                                <h5>For Qualification Verification</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Upload a Higher Education Qualification Document</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={handleQualificationFileChange}
                                    />
                                    {qualificationPreview && (
                                        <img src={qualificationPreview} alt="Qualification Preview" className="mt-3" style={{ width: '100px', height: '100px' }} />
                                    )}
                                </Form.Group>
                            </Card>

                            <Button type="submit" className="mt-3" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                            {error && <p className="text-danger mt-3">Error uploading documents. Please try again.</p>}
                        </Form>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default UploadDocuments;
