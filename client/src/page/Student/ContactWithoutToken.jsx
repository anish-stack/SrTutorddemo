
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import axios from "axios";
import Cookies from "js-cookie";
import { ClassSearch } from "../../Slices/Class.slice";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useGeolocated } from "react-geolocated";
import { Col, Form } from "react-bootstrap";
const ContactTeacherModalWithoutToken = ({ isOpen, isClose, teachersData }) => {
    const [loading, setLoading] = useState(false)
    const [teacherData, setTeacherData] = useState([]);
    const [studentToken, setStudentToken] = useState(null);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        Gender: "",
        TeachingExperience: "",
        VehicleOwned: "",
        TeachingMode: "All",
        Location: "",
        Subject: [],
        MinRange: 0,
        StartDate: "",
        MaxRange: 0,
        SpecificRequirement: "",
        HowManyClassYouWant: "",
        ClassId: '',
        className: '',
        teacherId: '',
        latitude: '',
        longitude: '',
        isBestFaculty: false,
    });
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [concatenatedData, setConcatenatedData] = useState([]);
    let FilterClassOption = teachersData.AcademicInformation
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.Class);
    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
    });


    useEffect(() => {
        if (coords) {
            setFormData(prevState => ({
                ...prevState,
                latitude: coords.latitude,
                longitude: coords.longitude,
            }));
        }
    }, [coords]);

    useEffect(() => {
        if (teachersData) {
            setTeacherData(teachersData);
            setFormData((prevFormData) => ({
                ...prevFormData,
                Gender: teachersData.Gender || prevFormData.Gender,
                TeachingExperience: teachersData.TeachingExperience || prevFormData.TeachingExperience,
                TeachingMode: teachersData.teachingMode || prevFormData.TeachingMode,
                Location: teachersData.location || prevFormData.Location,
                Subject: teachersData.UserSubject || prevFormData.Subject,
                teacherId: teachersData.TeacherId,

            }));
        }
    }, [teachersData]);

    useEffect(() => {
        const student = Cookies.get("studentToken");
        setStudentToken(student || null);
    }, []);

    useEffect(() => {
        dispatch(ClassSearch());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            const filterOutClasses = ['I-V', 'VI-X', 'X-XII'];
            const filteredClasses = data
                .filter(item => !filterOutClasses.includes(item.Class))
                .map(item => ({ class: item.Class, id: item._id }));

            const rangeClasses = data
                .filter(item => item.InnerClasses && item.InnerClasses.length > 0)
                .flatMap(item => item.InnerClasses.map(innerClass => ({
                    class: innerClass.InnerClass,
                    id: innerClass._id
                })));
            // console.log("Filter Options", FilterClassOption)


            const concatenatedData = rangeClasses.concat(filteredClasses);
            // console.log("concatenatedData", concatenatedData)
            const filterClassResults = FilterClassOption.map((filterClass) => {
                // console.log("filterClass", filterClass.ClassId)
                const matchClassId = concatenatedData.find((item) => item.id === filterClass.ClassId)
                return (
                    matchClassId
                )
            });



            setConcatenatedData(filterClassResults);

            const userClass = concatenatedData.find(item => item.id === teacherData.UserclassId);
            if (userClass) {
                setSelectedClass(userClass.id);
                fetchSubjects(userClass.id);
            }
        }
    }, [data, teacherData]);

    useEffect(() => {
        // console.log(formData)
        if (formData.ClassId) {
            const selectedClass = concatenatedData.find(item => item.id === formData.ClassId);
            if (selectedClass) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    className: selectedClass.class,
                }));
            }
        }
    }, [formData.ClassId, concatenatedData]);

    const fetchSubjects = async (classId) => {
        try {
            const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/admin/Get-Class-Subject/${classId}`);
            const fetchedSubjects = response.data.data.Subjects;

            if (fetchedSubjects) {
                setSubjects(fetchedSubjects);
                if (!formData.Subject.length) {
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        Subject: fetchedSubjects,
                    }));
                }
            } else {
                setSubjects([]);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    Subject: [],
                }));
            }
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };
    const handleSelectChange = (name) => (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: selectedOption ? selectedOption.value : "",
        }));
    }
    const ClasessOptions = [
        { value: 'Two Classes a Week', label: 'Two Classes a Week' },
        { value: 'Three Classes a Week', label: 'Three Classes a Week' },
        { value: 'Four Classes a Week', label: 'Four Classes a Week' },
        { value: 'Five Classes a Week', label: 'Five Classes a Week' },
        { value: 'Six Classes a Week', label: 'Six Classes a Week' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (name === "Location") {
            handleLocationFetch(value);
        }




    };

    
    const handleLocationFetch = async (input) => {
        try {
            const res = await axios.get(
                `https://api.srtutorsbureau.com/autocomplete?input=${input}`);

            setLocationSuggestions(res.data || []);
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code outside the 2xx range
                console.error("Error response from server:", error.response.data);
                console.error("Status code:", error.response.status);
                console.error("Headers:", error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
            } else {
                // Something happened in setting up the request that triggered an error
                console.error("Error in setting up request:", error.message);
            }
        }
    };



    const handleTeachingModeChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            TeachingMode: e.target.value,
        }));
    };

    const handleLocationSelect = (location) => {
        setFormData(prevState => ({
            ...prevState,
            Location: location.description,
        }));
        setLocationSuggestions([]);
    };

    const handleRangeChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: Number(value),
        }));
    };

    const handleBestFacultyChange = () => {
        setFormData(prevState => ({
            ...prevState,
            isBestFaculty: !prevState.isBestFaculty,
        }));
    };

    const handleSubjectChange = (selectedOptions) => {
        setFormData(prevState => ({
            ...prevState,
            Subject: selectedOptions ? selectedOptions.map(option => option.label) : [],
        }));
    };

    const handleClassChange = (e) => {
        const classId = e ? e.target.value : "";
        setSelectedClass(classId);
        setFormData(prevState => ({ ...prevState, Subject: [] }));
        fetchSubjects(classId);
    };

    const validateFields = () => {
        let isValid = true;
        if (step === 1) {
            if (!formData.Gender) {
                isValid = false;
                toast.error("Please fill out the Gender field.");
            }

        }
        if (step === 2) {
            if (!selectedClass) {
                isValid = false;
                toast.error("Please select a class.");
            }
            if (formData.Subject.length === 0) {
                isValid = false;
                toast.error("Please choose at least one subject.");
            }
        }
        if (step === 3) {
            if (!formData.StartDate) {
                isValid = false;
                toast.error("Please select a preferred start date.");
            }
            if (!formData.Location) {
                isValid = false;
                toast.error("Please enter your preferred location.");
            }
        }
        if (step === 4) {
            if (!formData.TeachingMode) {
                isValid = false;
                toast.error("Please select a teaching mode.");
            }
            if (formData.TeachingExperience <= 0) {
                isValid = false;
                toast.error("Please specify the teaching experience.");
            }
            if (formData.MinRange <= 0) {
                isValid = false;
                toast.error("Please specify the minimum budget range.");
            }
            if (formData.MaxRange <= 0) {
                isValid = false;
                toast.error("Please specify the maximum budget range.");
            }
        }
        return isValid;
    };

    const handleNextStep = () => {
        if (validateFields()) {
            setStep(prevStep => prevStep + 1);
        }
    };

    const handlePreviousStep = () => {
        setStep(prevStep => prevStep - 1);
    };

    const handleSubmit = async () => {
        if (!formData.latitude || !formData.longitude) {
            if (isGeolocationAvailable && isGeolocationEnabled) {

                // Trigger location update if not already available
                setFormData(prevState => ({
                    ...prevState,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                }));

            }
        }
        setLoading(true)
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/Make-Particular-request', formData, {
                headers: {
                    Authorization: `Bearer ${studentToken}`
                }
            })
            window.location.href = "/thankYou"
            // console.log(response.data)
            setLoading(false)

        } catch (error) {
            setLoading(false)

            console.log(error)
        }


    };




    const isAllSubjectsSelected =
        subjects.length > 0 &&
        subjects.every((subject) => formData.Subject.includes(subject._id));

    const subjectOptions = subjects.map((subject) => ({
        value: subject._id,
        label: subject.SubjectName,
    }));

    const classOptions = classes.map((cls) => ({
        value: cls.id,
        label: cls.label,
    }));

    // if (!studentToken) {
    //     return (
    //         <div className="unauthorized">
    //             <h3>Unauthorized Access</h3>
    //             <p>Please log in to access this page.</p>
    //         </div>
    //     );
    // }

    return (
        <div
            className={`modal fade ${isOpen ? "show d-block" : ""}`}
            style={{ display: isOpen ? "block" : "none" }}
            tabIndex="-1"
            aria-labelledby="contactTeacherModalLabel"
            aria-hidden={!isOpen}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="contactTeacherModalLabel">
                            Contact Teacher
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={isClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {step === 1 && (
                            <>
                                <h4>Step 1: Basic Details</h4>
                                <div className="mb-3">
                                    <label htmlFor="Gender" className="form-label">
                                        Gender <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="Gender"
                                        required
                                        name="Gender"
                                        value={formData.Gender}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="" disabled>
                                            Select Gender
                                        </option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Any">Any</option>
                                    </select>
                                </div>
                                {/* <div className="mb-3">
                                    <label htmlFor="VehicleOwned" className="form-label">
                                        Indicate if you own a vehicle{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="VehicleOwned"
                                        required
                                        name="VehicleOwned"
                                        value={formData.VehicleOwned}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="" disabled>
                                            Select Vehicle Ownership
                                        </option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div> */}
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleNextStep}
                                >
                                    Next
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <h4>Step 2: Academic Details</h4>
                                <div className="mb-3">
                                    <label htmlFor="Class" className="form-label">
                                        Select the class you are interested in{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="Class"
                                        value={selectedClass}
                                        onChange={handleClassChange}
                                        className="form-select"
                                    >
                                        <option value="" disabled>
                                            Select Class
                                        </option>
                                        {concatenatedData.map((cls, index) => (
                                            <option key={index} value={cls.id}>
                                                {cls.class}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Subject" className="form-label">
                                        Choose the subjects you want to learn{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                        isMulti
                                        required
                                        name="Subject"
                                        value={subjectOptions.filter((option) =>
                                            formData.Subject.includes(option.label)
                                        )}
                                        onChange={handleSubjectChange}
                                        options={subjectOptions}
                                        placeholder="Select Subjects"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                </div>
                                <Col md={6}>
                                    <Form.Group className="mb-3"
                                        required>
                                        <Form.Label>How Many Classes You Want  <b className="text-danger fs-5">*</b></Form.Label>
                                        <Select
                                            name="HowManyClassYouWant"
                                            options={ClasessOptions}
                                            onChange={handleSelectChange('HowManyClassYouWant')}
                                            value={ClasessOptions.find(option => option.value === formData.HowManyClassYouWant) || null}
                                        />

                                    </Form.Group>
                                </Col>
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={handlePreviousStep}
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleNextStep}
                                >
                                    Next
                                </button>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <h4>Step 3: Additional Information</h4>
                                <div className="mb-3">
                                    <label htmlFor="StartDate" className="form-label">
                                        Preferred Start Date <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="StartDate"
                                        required
                                        name="StartDate"
                                        value={formData.StartDate}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        min={new Date().toISOString().split("T")[0]} // This sets the minimum date to today's date

                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Location" className="form-label">
                                        Enter your preferred location{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="Location"
                                        required
                                        name="Location"
                                        value={formData.Location}
                                        onChange={handleInputChange}
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
                                <div className="mb-3">
                                    <label htmlFor="SpecificRequirement" className="form-label">
                                        Specific Requirement <span className="text-danger">(Optional)</span>
                                    </label>
                                    <textarea

                                        id="SpecificRequirement"

                                        name="SpecificRequirement"
                                        value={formData.SpecificRequirement}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={handlePreviousStep}
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleNextStep}
                                >
                                    Next
                                </button>
                            </>
                        )}

                        {step === 4 && (
                            <>
                                <h4>Step 4: Teaching Preferences</h4>
                                <div className="mb-3">
                                    <label htmlFor="TeachingMode" className="form-label">
                                        Choose your preferred teaching mode (e.g., online,
                                        in-person) <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="TeachingMode"
                                        required
                                        name="TeachingMode"
                                        value={formData.TeachingMode}
                                        onChange={handleTeachingModeChange}
                                        className="form-select"
                                    >
                                        <option value="" disabled>
                                            Select Teaching Mode
                                        </option>
                                        <option value="Online Class">Online Class</option>
                                        <option value="Home Tuition at My Home">
                                            Home Tuition at My Home
                                        </option>
                                        <option value="Willing to travel to Teacher's Home">
                                            Willing to travel to Teacher's Home
                                        </option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="TeachingExperience" className="form-label">
                                        Select the required teaching experience{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="TeachingExperience"
                                        required
                                        name="TeachingExperience"
                                        value={formData.TeachingExperience}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="MinRange" className="form-label">
                                        Specify the minimum budget range{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="MinRange"
                                        required
                                        name="MinRange"
                                        value={formData.MinRange}
                                        onChange={handleRangeChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="MaxRange" className="form-label">
                                        Specify the maximum budget range{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="MaxRange"
                                        required
                                        name="MaxRange"
                                        value={formData.MaxRange}
                                        onChange={handleRangeChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        id="isBestFaculty"
                                        checked={formData.isBestFaculty}
                                        onChange={handleBestFacultyChange}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="isBestFaculty" className="form-check-label">
                                        Check if you are looking for the best faculty
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={handlePreviousStep}
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleNextStep}
                                >
                                    Next
                                </button>
                            </>
                        )}

                        {step === 5 && (
                            <>
                                <h4>Step 5: Review Your Information</h4>
                                <ul className="list-group mb-3">
                                    <li className="list-group-item smallText">
                                        <strong>Gender:</strong> {formData.Gender}
                                    </li>
                                    <li className="list-group-item smallText">
                                        <strong>Vehicle Owned:</strong> {formData.VehicleOwned}
                                    </li>
                                    <li className="list-group-item smallText">
                                        <strong>Class:</strong> {formData.className}
                                    </li>
                                    <li className="list-group-item smallText">
                                        <strong>Subjects:</strong>{" "}
                                        {Array.isArray(formData.Subject)
                                            ? formData.Subject.length > 0
                                                ? formData.Subject.length === 1
                                                    ? formData.Subject[0] // Display single subject directly
                                                    : formData.Subject.join(", ") // Join multiple subjects with commas
                                                : "No Subject"
                                            : formData.Subject || "No Subject"}
                                    </li>


                                    <li className="list-group-item smallText">
                                        <strong>Preferred Start Date:</strong> {formData.StartDate}
                                    </li>
                                    <li className="list-group-item smallText">
                                        <strong>Classes You Want:</strong> {formData.HowManyClassYouWant}
                                    </li>
                                    <li className="list-group-item smallText">
                                        <strong>Location:</strong> {formData.Location}
                                    </li>
                                    <li className="list-group-item smallText">
                                        <strong>Teaching Mode:</strong> {formData.TeachingMode}
                                    </li>
                                    <li className="list-group-item smallText">
                                        <strong>Specific Requirement :</strong> {formData.SpecificRequirement || "No Specific Requirement"}
                                    </li>
                                    <li className="list-group-item smallText">
                                        <strong>Teaching Experience:</strong>{" "}
                                        {formData.TeachingExperience} years
                                    </li>
                                    <li className="list-group-item smallText">
                                        <strong>Minimum Range:</strong> {formData.MinRange}
                                    </li>
                                    <li className="list-group-item smallText">
                                        <strong>Maximum Range:</strong> {formData.MaxRange}
                                    </li>
                                    <li className="list-group-item smallText">
                                        <strong>Is Best Faculty:</strong>{" "}
                                        {formData.isBestFaculty ? "Yes" : "No"}
                                    </li>
                                </ul>
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={handlePreviousStep}
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={loading}
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                >
                                    {loading ? 'Please Wait...  ' : 'Submit'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ContactTeacherModalWithoutToken.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isClose: PropTypes.func.isRequired,
};

export default ContactTeacherModalWithoutToken;
