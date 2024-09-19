import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import Select from "react-select";
import Cookies from 'js-cookie'
import LoginModal from "./LoginModel";
import useSessionStorageState from 'use-session-storage-state'
import toast from "react-hot-toast";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
const SubjectModel = ({ showModal, handleClose, subject }) => {
    console.log(subject)

    const token = Cookies.get('studentToken') || false
    const navigate = useNavigate();
    const [loginNumber, setLoginNumber] = useState()
    const [login, setLogin] = useState(false)

    const url = new URLSearchParams(window.location.search)
    const otpValue = url.get('otpSent')
    const [sessionData, setSessionData] = useState({
        otpSent: false,
        number: ''
    })
    const [isLoading, setLoading] = useState(false)
    const { Class, Subjects = [], isClass, id } = subject || {}; // Default Subjects to an empty array if it's not an array
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showOtp, setShowOtp] = useState(false)
    const [otp, setOtp] = useState()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        Subject: [],
        Class: "",
        Location: "",
        Interested: "",
        HowManyClassYouWant: "",
        experienceRequired: "",
        MinumBudegt: "",
        Maxmimu: "",
        StartDate: "",
        TeaherGender: "",
        currentAddress: '',
        userconetcIfo: {
            Name: "",
            email: "",
            contactnumver: "",
        },
        specificrequirement: ""
    });
    const [storedFormData, setStoredFormData] = useSessionStorageState('beforeLoginDataSubject', {
        defaultValue: formData,
    });
    const numberOfSessionsOptions = [
        { value: 'Two Classes a Week', label: 'Two Classes a Week' },
        { value: 'Three Classes a Week', label: 'Three Classes a Week' },
        { value: 'Four Classes a Week', label: 'Four Classes a Week' },
        { value: 'Five Classes a Week', label: 'Five Classes a Week' },
        { value: 'Six Classes a Week', label: 'Six Classes a Week' },
    ];

    const interestedInTypeOfClassOptions = [
        { value: 'Online Class', label: 'Online Class' },
        { value: 'Home Tuition at My Home', label: 'Home Tuition at My Home' },
        { value: 'Willing to travel to Teacher Home', label: 'Willing to travel to Teacher Home' },
        { value: 'Require Teacher to Travel to My Home', label: 'Require Teacher to Travel to My Home' },
    ];
    const [loginShow, setLoginShow] = useState(false)
    const [ClickLatitude, setClickLatitude] = useState(null);
    const [ClickLongitude, setClickLongitude] = useState(null);
    const [step, setStep] = useState(1);
    useEffect(() => {
        if (token) {
            setLogin(true)
        } else {
            setLogin(false)
        }
    }, [token])
    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            Class: Class || "",
            Subject: [], // Clear subject selection on new modal open
        }));
    }, [Class, Subjects]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "Location") {
            handleLocationFetch(value);
        }
    };

    const handleSelectChange = (name) => (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: selectedOption ? selectedOption.value : "",
        }));
    };
    const handleStepChange = (nextStep) => {
        let valid = true;

        // Validation based on the current step
        if (step === 1) {
            // Validate fields for step 1
            if (!formData.Location) {
                toast.error("Please fill all required fields.");
                valid = false;
            }
        } else if (step === 2) {
            // Validate fields for step 2
            if (!formData.HowManyClassYouWant) {
                toast.error("How many classes you want is required.");
                valid = false;
            }
            if (formData.MinumBudegt <= 499) {
                toast.error("Minimum budget must be at least 500.");
                valid = false;
            }

            if (!formData.StartDate) {
                toast.error("Start date is required.");
                valid = false;
            }
            if (!formData.TeaherGender) {
                toast.error("Choose teacher gender preference.");
                valid = false;
            }
        }

        // Change step if validation passes
        if (valid) {
            setStep(nextStep);
        }
    };
    const handleLocationLatAndLngFetch = async () => {
        const address = formData.Location
        const options = {
            method: 'GET',
            url: `https://api.srtutorsbureau.com/geocode?address=${address}`
        };

        try {
            const response = await axios.request(options);
            const result = response.data;
            console.log(result)
            if (result && result.length > 0) {
                setClickLatitude(result.latitude);
                setClickLongitude(result.longitude);
            }
        } catch (error) {
            console.error("Error fetching location coordinates:", error);
        }
    };


    const handleLocationFetch = async (input) => {
        try {
            const res = await axios.get(
                `https://api.srtutorsbureau.com/autocomplete?input=${input}`);

            setLocationSuggestions(res.data || []);
        } catch (error) {
            console.error("Error fetching location suggestions:", error);
        }
    };


    const handleLoginChange = (e) => {
        setLoginNumber(e.target.value); // Directly set the value
    };
    const handleLocationSelect = (location) => {
        setFormData(prevState => ({
            ...prevState,
            Location: location.description,
        }));
        handleLocationLatAndLngFetch(location.description)
        setLocationSuggestions([]);
    };
    const validateForm = () => {
        let valid = true;
        const errors = {};

        // Validate required fields
        Object.keys(formData).forEach((key) => {
            if (key !== "userconetcIfo" && key !== "specificrequirement" && !formData[key]) {
                valid = false;
                errors[key] = "This field is required.";
            }
        });


        return { valid, errors };
    };

    const resendOtp = async () => {
        try {

            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/resent-otp', { PhoneNumber: loginNumber });
            toast.success(response.data.message);

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const verifyOtp = async () => {
        try {

            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/Verify-Student', {
                PhoneNumber: loginNumber,
                otp
            });
            toast.success("Student Verified Successfully");
            const { token, user } = response.data;
            console.log(response.data)
            Cookies.set('studentToken', token, { expires: 1 });
            Cookies.set('studentUser', JSON.stringify(user), { expires: 1 });
            sessionStorage.removeItem('OtpSent')
            sessionStorage.removeItem('number')
            sessionStorage.removeItem('verified')

            setLogin(true)
            setStep(1);

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };


    const handleLoginNumberCheck = async (e) => {
        e.preventDefault()



        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/checkNumber-request', {
                userNumber: loginNumber
            })
            console.log(response.data)
            setShowOtp(true)
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('otpSent', 'true');
            newUrl.searchParams.set('number', loginNumber);
            newUrl.searchParams.set('verified', 'false');

            sessionStorage.setItem('OtpSent', true)
            sessionStorage.setItem('number', loginNumber)
            sessionStorage.setItem('verified', false)


            navigate(`${window.location.pathname}?${newUrl.searchParams.toString()}`, { replace: true });
        } catch (error) {
            console.log(error.response)

            if (error.response?.data?.success === false &&
                error.response?.data?.message === "User with this phone number already exists.") {
                setShowOtp(true)
                setStep(1); // Correctly set the state
            }
        }
    }




    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)

        const submitedData = {
            requestType: "Subject Teacher",
            classId: null,
            className: formData.Class,
            subjects: isClass ? [formData.Subject] : [Subjects],
            interestedInTypeOfClass: formData.Interested,
            teacherGenderPreference: formData.TeaherGender,
            numberOfSessions: formData.HowManyClassYouWant,
            experienceRequired: formData.experienceRequired,
            minBudget: formData.MinumBudegt,
            maxBudget: formData.Maxmimu || '1000',
            locality: formData.Location,
            startDate: formData.StartDate,
            specificRequirement: formData.specificrequirement,
            currentAddress: formData.currentAddress || null,
            location: {
                type: 'Point',
                coordinates: [ClickLongitude || 0, ClickLatitude || 0]
            },
            studentInfo: {
                studentName: formData.userconetcIfo.Name,
                contactNumber: formData.userconetcIfo.contactnumver,
                emailAddress: formData.userconetcIfo.email
            }
        };

        setLoading(true)
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/universal-request', submitedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data)
            setLoading(false);
            toast.success("Request Submited Successful")
            window.location.href = "/thankYou";
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Server Error, Please try again later.");
        }


    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);

    };
    // Ensure Subjects is an array and generate options for the subjects dropdown
    const subjectOptions = Array.isArray(Subjects)
        ? [
            { value: "All", label: "All" },
            ...Subjects.map((sub) => ({
                value: sub.SubjectName,
                label: sub.SubjectName,
            })),
        ]
        : [{ value: "All", label: "All" }];


    return (
        <div>

            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Subject Request Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                        {!login ? (
                            <div className="container-fluid">
                                <Form.Group>
                                    <label htmlFor="">Enter Your Contact Number </label>
                                    <Form.Control
                                        type="text"
                                        name="loginNumber"
                                        value={showOtp ? (loginNumber || sessionStorage.getItem('number')) : loginNumber} // Ternary condition for showing value
                                        onChange={handleLoginChange}
                                        required
                                    />

                                </Form.Group>
                                {showOtp && (
                                    <Form.Group>
                                        <label htmlFor="">Enter Otp </label>
                                        <Form.Control
                                            type="text"
                                            name="otp"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                )}
                                <div className="mt-4 d-flex align-item-center justify-content-between">
                                    {showOtp ? (
                                        <Button onClick={() => verifyOtp(otp)} variant="success" type="button">
                                            {isLoading ? 'Please Wait....' : 'Verify Number'}
                                        </Button>
                                    ) : (
                                        <Button onClick={handleLoginNumberCheck} variant="success" type="button">
                                            {isLoading ? 'Please Wait....' : 'Submit'}
                                        </Button>
                                    )}


                                    <Button onClick={resendOtp} variant="success" type="button">
                                        Resend Otp
                                    </Button>
                                </div>

                            </div>
                        ) : <>
                            {step === 1 && (
                                <Container>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-1"
                                                required>
                                                {/* <Form.Label>Subject</Form.Label> */}
                                                <label className="mb-1" htmlFor="">Subject</label>
                                                <Form.Control
                                                    type="text"
                                                    name="Subject"
                                                    readOnly
                                                    value={formData.Subject.join(", ") || Subjects}
                                                    placeholder="Enter Subject"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-1"
                                                required>
                                                <label className="mb-1" htmlFor="">Class</label>

                                                <Form.Control
                                                    type="text"
                                                    name="Class"
                                                    onChange={handleChange}
                                                    value={formData.Class}
                                                    placeholder="Enter Class in Which You Learn"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-1"
                                                required>
                                                <label className="mb-1" htmlFor="">Current Address</label>


                                                <Form.Control
                                                    type="text"
                                                    name="currentAddress"
                                                    onChange={handleChange}
                                                    value={formData.currentAddress}
                                                    placeholder="Enter Your Current Address Where You Want Teacher"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-md-3">
                                        <Col xs={12}>
                                            <div className="mb-1"
                                                required>
                                                <label htmlFor="Location" className="form-label">
                                                    Enter your Near By  location{" "}
                                                    <b className="text-danger fs-5">*</b>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="Location"
                                                    required
                                                    name="Location"
                                                    value={formData.Location}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    placeholder="Search Location"
                                                />
                                                {locationSuggestions.length > 0 && (
                                                    <ul className="list-group mt-2">
                                                        {locationSuggestions.map((location) => (
                                                            <li
                                                                key={location.place_id}
                                                                className="list-group-item"
                                                                onClick={() => handleLocationSelect(location)}
                                                            >
                                                                {location.description}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>

                                </Container>
                            )}

                            {step === 2 && (
                                <Container>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-1"
                                                required>
                                                <label className="mb-1" htmlFor="">Interested In <b className="text-danger fs-5">*</b> </label>


                                                <Select
                                                    name="Interested"
                                                    options={interestedInTypeOfClassOptions}
                                                    onChange={handleSelectChange('Interested')}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-1"
                                                required>
                                                <label className="mb-1" htmlFor="">How Many Classes You Want  <b className="text-danger fs-5">*</b></label>

                                                <Select
                                                    name="HowManyClassYouWant"
                                                    options={numberOfSessionsOptions}
                                                    onChange={handleSelectChange('HowManyClassYouWant')}

                                                />

                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-1"
                                                required>
                                                <label className="mb-1" htmlFor="">Budget (Min)  <b className="text-danger fs-5">*</b></label>
                                                <Form.Control
                                                    type="number"
                                                    name="MinumBudegt"
                                                    value={formData.MinumBudegt}
                                                    onChange={handleChange}
                                                    placeholder="Enter Minimum Budget"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-1"
                                                required>
                                                <label className="mb-1" htmlFor="">Budget (Max)  <b className="text-danger fs-5">*</b></label>

                                                <Form.Control
                                                    type="number"
                                                    name="Maxmimu"
                                                    value={formData.Maxmimu}
                                                    onChange={handleChange}
                                                    placeholder="Enter Maximum Budget"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-1"
                                                required>
                                                <label className="mb-1" htmlFor="">Preferred Start Date   <b className="text-danger fs-5">*</b></label>
                                                <Form.Control
                                                    type="date"
                                                    name="StartDate"
                                                    value={formData.StartDate}
                                                    onChange={handleChange}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-1"
                                            required>
                                            <label className="mb-1" htmlFor="">Teacher Experience   <b className="text-danger fs-5">*</b></label>
                                            <Form.Control
                                                type="number"
                                                name="experienceRequired"
                                                value={formData.experienceRequired}
                                                onChange={handleChange}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-1"
                                                required>
                                                <label className="mb-1" htmlFor="">Teacher Gender Preference  <b className="text-danger fs-5">*</b></label>
                                                <Select
                                                    options={[
                                                        { value: "Male", label: "Male" },
                                                        { value: "Female", label: "Female" },
                                                        { value: "Any", label: "Any" },
                                                    ]}
                                                    onChange={handleSelectChange("TeaherGender")}
                                                    value={{
                                                        value: formData.TeaherGender,
                                                        label: formData.TeaherGender,
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Container>
                            )}
                            {step === 3 && (
                                <Container>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-1"
                                                required>
                                                <Form.Label>User Contact Info  <b className="text-danger fs-5">*</b></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="Name"
                                                    className="mb-3"
                                                    required
                                                    value={formData.userconetcIfo.Name}
                                                    onChange={(e) =>
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            userconetcIfo: {
                                                                ...prevData.userconetcIfo,
                                                                Name: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                    placeholder="Enter Name"
                                                />
                                                <Form.Control
                                                    type="email"
                                                    className="mb-3"
                                                    required
                                                    name="email"
                                                    value={formData.userconetcIfo.email}
                                                    onChange={(e) =>
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            userconetcIfo: {
                                                                ...prevData.userconetcIfo,
                                                                email: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                    placeholder="Enter Email"
                                                />
                                                <Form.Control
                                                    type="text"
                                                    className="mb-3"
                                                    required
                                                    name="contactnumver"
                                                    value={formData.userconetcIfo.contactnumver}
                                                    onChange={(e) =>
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            userconetcIfo: {
                                                                ...prevData.userconetcIfo,
                                                                contactnumver: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                    placeholder="Enter Contact Number"
                                                />
                                                <Form.Control
                                                    as="textarea"
                                                    className="mb-1"
                                                    required
                                                    name="specificrequirement"
                                                    value={formData.specificrequirement}
                                                    onChange={(e) =>
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            specificrequirement: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Specific Requirement"
                                                />

                                            </Form.Group>

                                        </Col>
                                    </Row>
                                </Container>
                            )}
                        </>
                        }
                    </Form>
                </Modal.Body>
                {login && (

                    <Modal.Footer>
                        {step === 1 && (
                            <Button variant="secondary" onClick={() => handleStepChange(2)}>
                                Next
                            </Button>
                        )}
                        {step === 2 && (
                            <>
                                <Button variant="secondary" onClick={() => handleStepChange(1)}>
                                    Back
                                </Button>
                                <Button variant="primary" onClick={() => handleStepChange(3)}>
                                    Next
                                </Button>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <Button variant="secondary" onClick={() => handleStepChange(2)}>
                                    Back
                                </Button>
                                <Button disabled={isLoading} variant="primary" onClick={handleSubmit}>
                                    {isLoading ? "Please wait..." : "Submit"}
                                </Button>
                            </>
                        )}
                    </Modal.Footer>
                )}

            </Modal>



        </div>
    )
}

export default SubjectModel