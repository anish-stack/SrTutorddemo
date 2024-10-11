import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Container, Col } from "react-bootstrap";
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
        ClassLangUage: '',
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
    const [resendButtonClick, setResendButtonClick] = useState(0);
    const [resendError, setResendError] = useState('');
    const maxResendAttempts = 3;
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
                `https://api.srtutorsbureau.com/autocomplete?input=${input}`);

            setLocationSuggestions(res.data || []);
        } catch (error) {
            console.error("Error fetching location suggestions:", error);
        }
    };

    // Fetch location coordinates
    const handleLocationLatAndLngFetch = async (address) => {
        const options = {
            method: 'GET',
            url: `https://api.srtutorsbureau.com/geocode?address=${address}`
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
        console.log(step);
        switch (step) {
            case 1:
                return formData.studentInfo.contactNumber.length === 10;
            case 2:
                return formData.classId && formData.subjects.length > 0;
            case 3:
                return (
                    formData.interestedInTypeOfClass &&
                    formData.teacherGenderPreference &&
                    formData.experienceRequired &&
                    formData.maxBudget
                );
            case 4:
                return formData.currentAddress && formData.startDate;
            default:
                return false;
        }
    };

    const handleStepChange = (stepChange) => {
        // Check if we're moving forward
        if (stepChange === 1) {
            if (!validateStep()) {
                toast.error("Please complete the current step before proceeding.");
                return;
            }
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

    useEffect(() => {
        const storedResendCount = localStorage.getItem('resendButtonClickCheckTeacher');
        if (storedResendCount) {
            setResendButtonClick(Number(storedResendCount));
        }
    }, []);

    useEffect(() => {
        console.log('Resend Button Click Count:', resendButtonClick); // Log the count
        localStorage.setItem('resendButtonClickCheckTeacher', resendButtonClick);
    }, [resendButtonClick]);

    const handleSelectChange = (selectedOption, action) => {
        setFormData({ ...formData, [action.name]: selectedOption });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();


        const errorMessages = [];


        if (!formData.classId || !formData.classId.value) {
            errorMessages.push("Class is required.");
        }
        if (!formData.subjects || formData.subjects.length === 0) {
            errorMessages.push("At least one subject is required.");
        }
        if (!formData.interestedInTypeOfClass || !formData.interestedInTypeOfClass.value) {
            errorMessages.push("Type of class is required.");
        }
        if (!formData.teacherGenderPreference) {
            errorMessages.push("Teacher gender preference is required.");
        }
        if (!formData.numberOfSessions || !formData.numberOfSessions.value) {
            errorMessages.push("Number of sessions is required.");
        }
        if (!formData.experienceRequired) {
            errorMessages.push("Experience required is needed.");
        }

        if (!formData.maxBudget) {
            errorMessages.push(" Budget is required.");
        }

        if (!formData.startDate) {
            errorMessages.push("Start date is required.");
        }
        if (!formData.currentAddress) {
            errorMessages.push("Current address is required.");
        }

        if (!formData.studentInfo.contactNumber) {
            errorMessages.push("Contact number is required.");
        }



        if (errorMessages.length > 0) {
            // Show all error messages using toast
            toast.error(errorMessages.join(" "));
            return; // Stop the form submission
        }

        const submittedData = {
            requestType: "Teacher Request For School Classes",
            classId: formData.classId.value,
            className: formData.classId.label,
            subjects: formData.subjects.map(subject => subject.label),
            interestedInTypeOfClass: formData.interestedInTypeOfClass.value,
            teacherGenderPreference: formData.teacherGenderPreference,
            numberOfSessions: formData.numberOfSessions.value,
            ClassLangUage: formData.ClassLangUage,
            experienceRequired: formData.experienceRequired,
            minBudget: "500",
            maxBudget: formData.maxBudget || '1000',
            locality: formData.locality,
            startDate: formData.startDate,
            specificRequirement: "no",
            currentAddress: formData.currentAddress,
            location: formData.location || {
                type: 'Point',
                coordinates: [ClickLongitude || 0, ClickLatitude || 0]
            },
            studentInfo: {
                studentName: formData.studentInfo.studentName,
                contactNumber: formData.studentInfo.contactNumber,
                emailAddress: formData.studentInfo.emailAddress
            }
        };
        console.log(submittedData)
        setLoading(true);

        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/universal-request', submittedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data);
            setLoading(false);
            toast.success("Request Submitted Successfully");
            window.location.href = "/thankYou";
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Server Error, Please try again later.");
        }
    };

    const fetchLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const { data } = await axios.post('https://api.srtutorsbureau.com/Fetch-Current-Location', {
                            lat: latitude,
                            lng: longitude
                        });
    
                        const address = data?.data?.address;
                        console.log(address);
                        if (address) {
                            setFormData((prev) => ({
                                ...prev,
                                currentAddress: address?.completeAddress,
                                location: {
                                    type: 'Point',
                                    coordinates: [address.lat, address.lng]
                                }
                            }))
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    };

    useEffect(() => {
        fetchLocation()
    }, [])

    // const resendOtp = async () => {
    //     try {
    //         if (sessionData.number || sessionData.otpSent) {
    //             const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/resent-otp', { PhoneNumber: sessionData.number });
    //             toast.success(response.data.message);
    //         } else {
    //             toast.error("Unauthorized Action")
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         toast.error(error.response?.data?.message || "An error occurred");
    //     }
    // };

    // const verifyOtp = async () => {
    //     try {

    //         const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/Verify-Student', {
    //             PhoneNumber: loginNumber,
    //             otp
    //         });
    //         toast.success("Student Verified Successfully");
    //         const { token, user } = response.data;
    //         console.log(response.data)
    //         Cookies.set('studentToken', token, { expires: 1 });
    //         Cookies.set('studentUser', JSON.stringify(user), { expires: 1 });
    //         sessionStorage.removeItem('OtpSent')
    //         sessionStorage.removeItem('number')
    //         sessionStorage.removeItem('verified')

    //         setLogin(true)
    //         setStep(1);

    //     } catch (error) {
    //         toast.error(error.response?.data?.message || "An error occurred");
    //     }
    // };


    // const handleLoginNumberCheck = async (e) => {
    //     e.preventDefault()



    //     try {
    //         const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/checkNumber-request', {
    //             userNumber: loginNumber
    //         })
    //         console.log(response.data)
    //         setShowOtp(true)
    //         const newUrl = new URL(window.location.href);
    //         newUrl.searchParams.set('otpSent', 'true');
    //         newUrl.searchParams.set('number', loginNumber);
    //         newUrl.searchParams.set('verified', 'false');

    //         sessionStorage.setItem('OtpSent', true)
    //         sessionStorage.setItem('number', loginNumber)
    //         sessionStorage.setItem('verified', false)


    //         navigate(`${window.location.pathname}?${newUrl.searchParams.toString()}`, { replace: true });
    //     } catch (error) {
    //         console.log(error.response)

    //         if (error.response?.data?.success === false &&
    //             error.response?.data?.message === "User with this phone number already exists.") {
    //             setShowOtp(true)
    //             setStep(1); // Correctly set the state
    //         }
    //     }
    // }
    const updateUrlParams = (params) => {
        const newUrl = new URL(window.location.href);
        Object.keys(params).forEach(key => {
            newUrl.searchParams.set(key, params[key]);
        });
        navigate(`${window.location.pathname}?${newUrl.searchParams.toString()}`, { replace: true });
    };
    const clearSessionStorage = () => {
        sessionStorage.removeItem('OtpSent');
        sessionStorage.removeItem('number');
        sessionStorage.removeItem('verified');
    };



    const resendOtp = async () => {
        console.log(loginNumber);
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/resent-otp', {
                PhoneNumber: loginNumber,
                HowManyHit: resendButtonClick
            });
            console.log(response.data);
            toast.success(response.data.message);
            setResendButtonClick((prev) => prev + 1); // Increment resend counter
        } catch (error) {
            console.log(error);
            setShowOtp(false);
            clearSessionStorage()
            updateUrlParams({ otpSent: 'false', number: '', verified: 'false' });
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
            console.log(response.data);
            Cookies.set('studentToken', token, { expires: 1 });
            Cookies.set('studentUser', JSON.stringify(user), { expires: 1 });
            clearSessionStorage();
            updateUrlParams({ otpSent: 'false', number: '', verified: 'false' });
            setLogin(true);
            setStep(1);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
            clearSessionStorage();
            updateUrlParams({ otpSent: 'false', number: '', verified: 'false' });
        }
    };

    const handleLoginNumberCheck = async (e) => {
        e.preventDefault();

        if (!loginNumber) {
            setResendError('Please enter a valid phone number.');
            return;
        }

        if (resendButtonClick >= maxResendAttempts) {
            toast.error('Maximum resend attempts reached. You are blocked for 24 hours.');
            clearSessionStorage();
            updateUrlParams({ otpSent: 'false', number: '', verified: 'false' });
            return;
        }

        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/checkNumber-request', {
                userNumber: loginNumber,
                HowManyHit: resendButtonClick
            });

            if (response.data && response.data.success) {
                setResendError('');
                setShowOtp(true);
                updateUrlParams({ otpSent: 'true', number: loginNumber, verified: 'false' });
                sessionStorage.setItem('OtpSent', true);
                sessionStorage.setItem('number', loginNumber);
                sessionStorage.setItem('verified', false);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error(error.response);
            clearSessionStorage()
            setShowOtp(false);
            if (error.response?.data?.success === false &&
                error.response?.data?.message === "User with this phone number already exists.") {
                setShowOtp(false);

                setStep(1);
            } else {
                toast.error(error.response?.data?.message || "An error occurred");
            }
        }
    };

    const handleContactNumberChange = (value) => {
        // Allow only digits and limit to 10
        if (/^\d*$/.test(value) && value.length <= 10) {
            setFormData({
                ...formData,
                studentInfo: {
                    ...formData.studentInfo,
                    contactNumber: value,
                },
            });
        } else {
            // Show an error if the value is not valid
            toast.error('Please enter a valid 10-digit phone number');
        }
    };

    const numberOfSessionsOptions = [
        { value: 'Two Classes a Week', label: 'Two Classes a Week' },
        { value: 'Three Classes a Week', label: 'Three Classes a Week' },
        { value: 'Four Classes a Week', label: 'Four Classes a Week' },
        { value: 'Five Classes a Week', label: 'Five Classes a Week' },
        { value: 'Six Classes a Week', label: 'Six Classes a Week' },
    ];

    const interestedInTypeOfClassOptions = [
        { value: 'Online Class', label: 'Online Class' },
        { value: 'Offline Class', label: 'Offline Class' },

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
                                        <label htmlFor="">Enter Your Whatsapp Number </label>
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
                                <form>

                                    {step === 1 && (
                                        <div>
                                            <h4>Step 1: Student Information</h4>
                                            <Form.Group>
                                                <Form.Label>Student Name (Optional)</Form.Label>
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

                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Contact Number <span className="text-danger fs-5">*</span> </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="contactNumber"
                                                    value={formData.studentInfo.contactNumber}
                                                    onChange={(e) => handleContactNumberChange(e.target.value)}
                                                    onKeyPress={(e) => {

                                                        if (!/[0-9]/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    required
                                                />
                                            </Form.Group>


                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div>
                                            <h4>Step 2: Class & Subject Information</h4>
                                            <Form.Group>
                                                <Form.Label>Class <span className="text-danger fs-5">*</span></Form.Label>
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
                                                <Form.Label>Subjects <span className="text-danger fs-5">*</span></Form.Label>
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
                                            {/* <Col md={12}>
                                                <Form.Group className="mb-3"
                                                    required>
                                                    <Form.Label>In Which Language You Want To Do Class <b className="text-danger fs-5">*</b></Form.Label>
                                                    <input
                                                        type="text"
                                                        id="Contact"
                                                        required
                                                        name="ClassLangUage"
                                                        value={formData.ClassLangUage}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        placeholder="Enter Your Language For Classe"
                                                    />

                                                </Form.Group>
                                            </Col> */}
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div>
                                            <h4>Step 3: Preferences & Budget</h4>
                                            <Form.Group>
                                                <Form.Label>Type of Class <span className="text-danger fs-5">*</span></Form.Label>
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
                                                <Form.Label>Teacher Gender Preference <span className="text-danger fs-5">*</span></Form.Label>
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
                                                <Form.Label>Number of Sessions <span className="text-danger fs-5">*</span></Form.Label>
                                                <Select
                                                    name="numberOfSessions"
                                                    options={numberOfSessionsOptions}
                                                    onChange={(selectedOption) =>
                                                        handleSelectChange(selectedOption, { name: "numberOfSessions" })
                                                    }
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label> Budget <span className="text-danger fs-5">*</span></Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="maxBudget"
                                                    min={'100'}
                                                    value={formData.maxBudget}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Experience Required (Optional) </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="experienceRequired"
                                                    value={formData.experienceRequired}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>

                                        </div>
                                    )}

                                    {step === 4 && (
                                        <div>
                                            <h4>Step 4: Location & Requirements</h4>

                                            <Form.Group>
                                                <Form.Label>Current Address <span className="text-danger fs-5">*</span> </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="currentAddress"
                                                    value={formData.currentAddress}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group className="mt-2 mb-2">
                                                <Form.Label>Nearby Place (Optional)</Form.Label>
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
                                                    min={`${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? '0' : ''}${new Date().getMonth() + 1}-01`} // First day of current month
                                                    max={`${new Date().getFullYear()}-12-31`}
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
                                        {step < 4 && (
                                            <Button variant="primary" onClick={() => handleStepChange(1)}>
                                                Next
                                            </Button>
                                        )}
                                        {step === 4 && (
                                            <Button onClick={handleFormSubmit} variant="success" type="submit">
                                                {loading ? 'Please Wait....' : 'Submit'}
                                            </Button>
                                        )}
                                    </div>
                                </form>

                            }



                        </Form>
                    </Container>
                </Modal.Body>
            </Modal>
        </div >
    );
};

export default TeacherPost;
