import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Container } from "react-bootstrap";
import Select from "react-select";
import Cookies from 'js-cookie';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"
const TeacherPost = ({ item, isOpen, OnClose }) => {

    const initialFormData = {
        classId: null,  // Fixed to store classId as an object
        className: '',
        subjects: [],
        interestedInTypeOfClass: '',
        studentInfo: {
            studentName: '',
            contactNumber: '',
            emailAddress: ''
        },
        teacherGenderPreference: 'Male', // default
        numberOfSessions: '',
        experienceRequired: '',
        minBudget: '500', // default
        maxBudget: '',
        locality: '',
        startDate: '',
        specificRequirement: '',
        currentAddress: '',
        location: {
            type: 'Point',
            coordinates: []
        }
    };

    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('formData');
        return savedData ? JSON.parse(savedData) : initialFormData;
    });
    const navigate = useNavigate();
    const [loginNumber, setLoginNumber] = useState()
    const [login, setLogin] = useState(false)
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [ClickLatitude, setClickLatitude] = useState(null);
    const [ClickLongitude, setClickLongitude] = useState(null);
    const [step, setStep] = useState(1);
    const url = new URLSearchParams(window.location.search)
    const otpValue = url.get('otpSent')
    const [sessionData, setSessionData] = useState({
        otpSent: false,
        number: ''
    })

    const [showOtp, setShowOtp] = useState(false)
    const [otp, setOtp] = useState()
    const [loading, setLoading] = useState(false);
    const token = Cookies.get('studentToken') || false;

    useEffect(() => {
        if (token) {
            setLogin(true)
        } else {
            setLogin(false)
        }
    }, [token])


    // Save form data to localStorage
    useEffect(() => {
        const sessionItemsOtp = sessionStorage.getItem('OtpSent');
        const sessionItemsNumber = sessionStorage.getItem('number');

        // Update state with session data
        setSessionData((prevData) => ({
            ...prevData,
            otpSent: sessionItemsOtp || false,
            number: sessionItemsNumber || ''
        }));



        // Show OTP if otpValue or sessionData.otpSent is true
        if (otpValue || sessionItemsOtp) {
            setShowOtp(true);
        } else {
            setShowOtp(false);
        }


        localStorage.setItem('formData', JSON.stringify(formData));
    }, [formData, otpValue, token, otpValue]);

    // Handle reload confirmation

    // Fetch location suggestions
    const handleLocationFetch = async (input) => {
        try {
            const res = await axios.get(
                `https://sr.apnipaathshaala.in/autocomplete?input=${input}`);

            setLocationSuggestions(res.data || []);
        } catch (error) {
            console.error("Error fetching location suggestions:", error);
        }
    };

    // Fetch location coordinates
    const handleLocationLatAndLngFetch = async (address) => {
        const options = {
            method: 'GET',
            url: `https://sr.apnipaathshaala.in/geocode?address=${address}`
          };

        try {
            const response = await axios.request(options);
            const result = response.data;
            // console.log("result", result)
            if (result && result.length > 0) {
                setClickLatitude(result.latitude);
                setClickLongitude(result.longitude);
                setFormData({
                    ...formData,
                    location: {
                        type: 'Point',
                        coordinates: [ClickLatitude, ClickLatitude]
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching location coordinates:", error);
        }
    };

    const handleLocationSelect = (location) => {
        setFormData(prevState => ({
            ...prevState,
            locality: location.description,
        }));
        handleLocationLatAndLngFetch(location.description);
        setLocationSuggestions([]);
    };

    // Step-wise validation function
    const validateStep = () => {
        switch (step) {
            case 1:
                return formData.studentInfo.studentName && formData.studentInfo.contactNumber.length === 10 && formData.studentInfo.emailAddress;
            case 2:
                return formData.classId && formData.subjects.length > 0;
            case 3:
                return formData.interestedInTypeOfClass && formData.teacherGenderPreference;
            case 4:
                return formData.experienceRequired && formData.minBudget;
            case 5:
                return formData.locality && formData.currentAddress && formData.startDate;
            default:
                return false;
        }
    };

    const handleStepChange = (stepChange) => {
        if (stepChange === 1 && !validateStep()) {
            toast.error("Please complete the current step before proceeding.");
            return;
        }
        setStep(step + stepChange);
    };

    const handleLoginChange = (e) => {
        setLoginNumber(e.target.value); // Directly set the value
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'locality') {
            handleLocationFetch(value);
        }
    };



    const handleSelectChange = (selectedOption, action) => {
        setFormData({ ...formData, [action.name]: selectedOption });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();


        // Final submission data preparation
        const submittedData = {
            requestType: "Teacher Request For School Classes",
            classId: formData.classId.value,
            className: formData.classId.label,
            subjects: formData.subjects.map(subject => subject.label),
            interestedInTypeOfClass: formData.interestedInTypeOfClass.value,
            teacherGenderPreference: formData.teacherGenderPreference,
            numberOfSessions: formData.numberOfSessions.value,
            experienceRequired: formData.experienceRequired,
            minBudget: formData.minBudget,
            maxBudget: formData.maxBudget || '1000',
            locality: formData.locality,
            startDate: formData.startDate,
            specificRequirement: formData.specificRequirement,
            currentAddress: formData.currentAddress,
            location: {
                type: 'Point',
                coordinates: [ClickLongitude || 0, ClickLatitude || 0]
            },
            studentInfo: {
                studentName: formData.studentInfo.studentName,
                contactNumber: formData.studentInfo.contactNumber,
                emailAddress: formData.studentInfo.emailAddress
            }
        };
        setLoading(true);

        try {
            const response = await axios.post('https://sr.apnipaathshaala.in/api/v1/student/universal-request', submittedData, {
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


    const resendOtp = async () => {
        try {
            if (sessionData.number || sessionData.otpSent) {
                const response = await axios.post('https://sr.apnipaathshaala.in/api/v1/student/resent-otp', { PhoneNumber: sessionData.number });
                toast.success(response.data.message);
            } else {
                toast.error("Unauthorized Action")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const verifyOtp = async () => {
        try {

            const response = await axios.post('https://sr.apnipaathshaala.in/api/v1/student/Verify-Student', {
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
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };


    const handleLoginNumberCheck = async (e) => {
        e.preventDefault()



        try {
            const response = await axios.post('https://sr.apnipaathshaala.in/api/v1/student/checkNumber-request', {
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

    return (
        <div className={'scrollable'}>

            <Modal show={isOpen} onHide={OnClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Post a Teaching Requirement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form >

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
                                                {loading ? 'Please Wait....' : 'Verify Number'}
                                            </Button>
                                        ) : (
                                            <Button onClick={handleLoginNumberCheck} variant="success" type="button">
                                                {loading ? 'Please Wait....' : 'Submit'}
                                            </Button>
                                        )}


                                        <Button onClick={resendOtp} variant="success" type="button">
                                            Resend Otp
                                        </Button>
                                    </div>

                                </div>
                            ) :
                                <>

                                    {step === 1 && (
                                        <div>
                                            <h4>Step 1: Student Information</h4>
                                            <Form.Group>
                                                <Form.Label>Student Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="studentName"
                                                    value={formData.studentInfo.studentName}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            studentInfo: { ...formData.studentInfo, studentName: e.target.value }
                                                        })
                                                    }
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Contact Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="contactNumber"
                                                    value={formData.studentInfo.contactNumber}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            studentInfo: { ...formData.studentInfo, contactNumber: e.target.value }
                                                        })
                                                    }
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Email Address</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="emailAddress"
                                                    value={formData.studentInfo.emailAddress}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            studentInfo: { ...formData.studentInfo, emailAddress: e.target.value }
                                                        })
                                                    }
                                                    required
                                                />
                                            </Form.Group>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div>
                                            <h4>Step 2: Class & Subject Information</h4>
                                            <Form.Group>
                                                <Form.Label>Class</Form.Label>
                                                <Select
                                                    name="classId"
                                                    options={item.InnerClasses.map((cls) => ({
                                                        value: cls._id, label: cls.InnerClass
                                                    }))}
                                                    onChange={(selectedOption) =>
                                                        handleSelectChange(selectedOption, { name: "classId" })
                                                    }
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Subjects</Form.Label>
                                                <Select
                                                    name="subjects"
                                                    options={item.Subjects.map((sub) => ({ value: sub._id, label: sub.SubjectName }))}
                                                    onChange={(selectedOption) =>
                                                        handleSelectChange(selectedOption, { name: "subjects" })
                                                    }
                                                    isMulti
                                                    required
                                                />
                                            </Form.Group>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div>
                                            <h4>Step 3: Preferences & Budget</h4>
                                            <Form.Group>
                                                <Form.Label>Type of Class</Form.Label>
                                                <Select
                                                    name="interestedInTypeOfClass"
                                                    options={interestedInTypeOfClassOptions}
                                                    onChange={(selectedOption) =>
                                                        handleSelectChange(selectedOption, { name: "interestedInTypeOfClass" })
                                                    }
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Teacher Gender Preference</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="teacherGenderPreference"
                                                    value={formData.teacherGenderPreference}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="No Preference">No Preference</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Number of Sessions</Form.Label>
                                                <Select
                                                    name="numberOfSessions"
                                                    options={numberOfSessionsOptions}
                                                    onChange={(selectedOption) =>
                                                        handleSelectChange(selectedOption, { name: "numberOfSessions" })
                                                    }
                                                    required
                                                />
                                            </Form.Group>

                                        </div>
                                    )}
                                    {step === 4 && (
                                        <div>
                                            <Form.Group>
                                                <Form.Label>Experience Required (in years)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="experienceRequired"
                                                    value={formData.experienceRequired}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Min Budget</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="minBudget"
                                                    value={formData.minBudget}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Max Budget</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="maxBudget"
                                                    value={formData.maxBudget}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </div>
                                    )}
                                    {step === 5 && (
                                        <div>
                                            <h4>Step 5: Location & Requirements</h4>
                                            <Form.Group>
                                                <Form.Label>Specific Requirement</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    name="specificRequirement"
                                                    value={formData.specificRequirement}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Current Address</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="currentAddress"
                                                    value={formData.currentAddress}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Location</Form.Label>
                                                <input
                                                    type="text"
                                                    id="locality"
                                                    required
                                                    name="locality"
                                                    value={formData.locality}
                                                    onChange={handleChange}  // Handles typing and updates formData
                                                    className="form-control"
                                                    placeholder="Search Location"
                                                />
                                                {locationSuggestions.length > 0 && (
                                                    <ul className="list-group mt-2">
                                                        {locationSuggestions.map((location) => (
                                                            <li
                                                                key={location.place_id}
                                                                className="list-group-item"
                                                                onClick={() => handleLocationSelect(location)}  // Handles selection from suggestions
                                                            >
                                                                {location.description}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Start Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="startDate"
                                                    value={formData.startDate}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-between mt-4">
                                        {step > 1 && (
                                            <Button variant="secondary" onClick={() => handleStepChange(-1)}>
                                                Previous
                                            </Button>
                                        )}
                                        {step < 5 && (
                                            <Button variant="primary" onClick={() => handleStepChange(1)}>
                                                Next
                                            </Button>
                                        )}
                                        {step === 5 && (
                                            <Button onClick={handleFormSubmit} variant="success" type="submit">
                                                {loading ? 'Please Wait....' : 'Submit'}
                                            </Button>
                                        )}
                                    </div>
                                </>

                            }



                        </Form>
                    </Container>
                </Modal.Body>
            </Modal>
        </div >
    );
};

export default TeacherPost;
