import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ClassSearch } from "../../Slices/Class.slice";
import Cookies from "js-cookie";
import Select from 'react-select';
import { GoogleMap, LoadScript, Marker, Circle, InfoWindow } from "@react-google-maps/api";

import { Alert, Table } from 'react-bootstrap';
import { useGeolocated } from 'react-geolocated';
import toast from "react-hot-toast";

const ProfilePage = () => {
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        FullName: '',
        DOB: '',
        Gender: '',
        ContactNumber: '',
        AlternateContact: '',
        PermanentAddress: {
            HouseNo: '',
            District: '',
            LandMark: '',
            Pincode: '',
        },
        CurrentAddress: {
            HouseNo: '',
            District: '',
            LandMark: '',
            Pincode: '',
        },
        isAddressSame: false,
        Qualification: '',
        TeachingExperience: '',
        ExpectedFees: '',
        VehicleOwned: '',
        TeachingMode: '',
        RangeWhichWantToDoClasses: '',
        AcademicInformation: [{
            classid: '',
            SubjectNames: ['']
        }],
        ranges: []
    });
    const [isAddressSame, setIsAddressSame] = useState(false);
    const [currentLocation, setCurrentLocation] = useState([28.687446456774957, 77.14151483304185]);  //Default location
    const [allPoints, setAllPoints] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const { coords } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
    });

    useEffect(() => {
        if (coords) {
            setCurrentLocation([coords.latitude, coords.longitude]);
        }
    }, [coords]);


    const location = new URLSearchParams(window.location.search)
    const tokenQuery = location.get('token')
    const IdQuery = location.get('encoded')

    const [concatenatedData, setConcatenatedData] = useState([]);
    const { data } = useSelector((state) => state.Class);
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [errorModel, setErrorModel] = useState(false)
    const [subjects, setSubjects] = useState([]);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [radius, setRadius] = useState(5); // Radius in kilometers
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const [user, setUser] = useState({
        TeacherName: '',
        DOB: '',
        Gender: '',
        ContactNumber: '',
        AlternateContact: '',
        PermanentAddress: {
            HouseNo: '',
            District: '',
            LandMark: '',
            Pincode: '',
        },
        CurrentAddress: {
            HouseNo: '',
            District: '',
            LandMark: '',
            Pincode: '',
        },
        isAddressSame: false,
        Qualification: '',
        TeachingExperience: '',
        ExpectedFees: '',
        VehicleOwned: '',
        TeachingMode: '',
        AcademicInformation: [{
            classid: '',
            SubjectNames: ['']
        }],
    });

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

            const combinedData = rangeClasses.concat(filteredClasses);
            setConcatenatedData(combinedData);
        }
    }, [data]);

    useEffect(() => {
        // Get user's current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    }, []);

    const handleAddressSame = (e) => {
        const { checked } = e.target;
        setIsAddressSame(checked);

        if (checked) {

            setFormData((prevData) => ({
                ...prevData,
                CurrentAddress: { ...prevData.PermanentAddress },
                isAddressSame: true
            }));
        } else {

            setFormData((prevData) => ({
                ...prevData,
                CurrentAddress: {
                    HouseNo: '',
                    District: '',
                    LandMark: '',
                    Pincode: ''
                },
                isAddressSame: false
            }));
        }
    };

    const fetchNearbyPlaces = async () => {
        if (latitude && longitude) {
            const url = `https://api.srtutorsbureau.com/nearby-places?lat=${latitude}&lng=${longitude}&radius=${radius * 1000}`;// Convert km to meters

            try {
                const response = await axios.get(url);
                // console.log(response.data)
                const data = response.data.FilterData;
                console.log(data)
                const nextPageToken = response.data.next_page_token;
                setPlaces(
                    data.map((place) => ({
                        // name: place.name,
                        lat: place.lat,
                        lng: place.lng,
                    }))
                );

            } catch (error) {
                console.error("Error fetching nearby places:", error);
            }
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `https://api.srtutorsbureau.com/api/v1/teacher/Teacher-details/${IdQuery}`
            );
            console.log(response.data)
            setUser(response.data.data)
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };



    useEffect(() => {
        fetchUser()
    }, [IdQuery])



    const fetchSubjects = async (classId) => {
        try {
            const response = await axios.get(
                `https://api.srtutorsbureau.com/api/v1/admin/Get-Class-Subject/${classId}`
            );
            console.log(response.data)

            setSubjects(response.data.data.Subjects || []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const handleSubjectNameChange = (selectedOptions, index) => {
        const selectedSubjects = selectedOptions.map(option => option.value); // Extract values from selected options
        const updatedAcademicInformation = [...formData.AcademicInformation];
        updatedAcademicInformation[index].SubjectNames = selectedSubjects; // Update SubjectNames with selected values
        setFormData({
            ...formData,
            AcademicInformation: updatedAcademicInformation
        });
    };

    const handleClassChange = (event, index) => {
        const { value } = event.target;

        setFormData(prevState => {
            const updatedAcademicInformation = [...prevState.AcademicInformation];
            updatedAcademicInformation[index].ClassId = value;

            return {
                ...prevState,
                AcademicInformation: updatedAcademicInformation,
            };
        });

        fetchSubjects(value);
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleNestedChange = (e, addressType) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [addressType]: {
                ...prevState[addressType],
                [name]: value
            }
        }));
    };


    useEffect(() => {
        if (user) {
            setFormData(prevState => ({
                ...prevState,
                FullName: user.TeacherName || '',
                DOB: user.DOB || '',
                Gender: user.gender || '',
                ContactNumber: user.PhoneNumber || '',
                AlternateContact: user.AltNumber || '',
                PermanentAddress: {
                    HouseNo: user.PermanentAddress?.HouseNo || '',
                    District: user.PermanentAddress?.District || '',
                    LandMark: user.PermanentAddress?.LandMark || '',
                    Pincode: user?.PermanentAddress?.Pincode || '',
                },
                CurrentAddress: {
                    HouseNo: user.CurrentAddress?.HouseNo || '',
                    District: user.CurrentAddress?.District || '',
                    LandMark: user.CurrentAddress?.LandMark || '',
                    Pincode: user?.PermanentAddress?.Pincode || '',
                },
                isAddressSame: user.isAddressSame || false,
                Qualification: user.Qualification || '',
                TeachingExperience: user.TeachingExperience || '',
                ExpectedFees: user.ExpectedFees || '',
                VehicleOwned: user.VehicleOwned || '',
                TeachingMode: user.TeachingMode || '',
                AcademicInformation: user.AcademicInformation || [{
                    ClassId: '',
                    SubjectNames: ['']
                }],
            }));
        }

    }, [user]);

    const handleAddClass = () => {
        setFormData(prevState => ({
            ...prevState,
            AcademicInformation: [
                ...prevState.AcademicInformation,
                { ClassId: '', SubjectNames: [] }
            ]
        }));
    };



    const handleRemoveClass = (index) => {
        setFormData(prevState => ({
            ...prevState,
            AcademicInformation: prevState.AcademicInformation.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.PermanentAddress.HouseNo) newErrors.PermanentAddressHouseNo = 'House No. is required';
            if (!formData.PermanentAddress.District) newErrors.PermanentAddressDistrict = 'District is required';
            if (!formData.PermanentAddress.LandMark) newErrors.PermanentAddressLandMark = 'Landmark is required';
            if (!formData.PermanentAddress.Pincode) newErrors.PermanentAddressPincode = 'Pincode is required';
            if (!formData.CurrentAddress.HouseNo) newErrors.CurrentAddressHouseNo = 'House No. is required';
            if (!formData.CurrentAddress.District) newErrors.CurrentAddressDistrict = 'District is required';
            if (!formData.CurrentAddress.LandMark) newErrors.CurrentAddressLandMark = 'Landmark is required';
            if (!formData.CurrentAddress.Pincode) newErrors.CurrentAddressPincode = 'Pincode is required';
            if (!formData.Qualification) newErrors.Qualification = 'Qualification is required';
            if (!formData.TeachingExperience) newErrors.TeachingExperience = 'Experience is required';
            if (!formData.ExpectedFees) newErrors.ExpectedFees = 'Fees are required';
            if (!formData.VehicleOwned) newErrors.VehicleOwned = 'Vehicle info is required';
            formData.AcademicInformation.forEach((info, index) => {
                if (!info.ClassId) {
                    newErrors[`AcademicClassId-${index}`] = 'Class ID is required';
                    console.log(`Academic Class ID at index ${index} is missing`);
                }
                if (info.SubjectNames.length === 0) {
                    newErrors[`AcademicSubjectNames-${index}`] = 'Subject names are required';
                    console.log(`Academic Subject Names at index ${index} are missing`);
                }
            });
        } else {

            if (!formData.TeachingMode) newErrors.TeachingMode = 'Teaching mode is required';
        }

        Object.values(newErrors).forEach((error) => toast.error(error));
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e, retry = false) => {
        e.preventDefault();
        console.log(places)
        if (validateForm()) {
            if (typeof places !== 'undefined') {
                setFormData((prevData) => ({
                    ...prevData,
                    RangeWhichWantToDoClasses: [places]
                }));
            } else {
                alert('Are You Sure');
                console.error("places is not defined or is undefined");
                return;
            }
        } else {
            console.log("Form validation failed. Errors:", errors);
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/teacher/teacher-profile', formData, {
                headers: {
                    Authorization: `Bearer ${tokenQuery}`
                }
            });

            console.log(response.data);
            toast.success("🎉 Profile submitted successfully! Please verify it with the OTP sent to your registered email. 📧");
            setLoading(false);

            setTimeout(() => {
                window.location.href = `/Teacher-Profile-Verify?token=${tokenQuery}&id=${IdQuery}`;
            }, 500);
        } catch (error) {
            console.log(error);
            setLoading(false);

            if (!loading) {
                setErrorModel(true)
            }

        }
    };



    const handleNext = (e) => {
        e.preventDefault();

        if (validateForm()) {
            setStep(prevStep => prevStep + 1);
        }
    };


    const handlePrevious = () => {
        setStep(prevStep => prevStep - 1);
    };



    return (
        <div className="container w-100 mt-5 p-5">
            <div className="mb-4">
                <h1>Teacher Profile</h1>
            </div>

            {step === 1 && (
                <div>
                    {/* Full Name, DOB, Gender */}
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label" htmlFor="FullName">Full Name</label>
                            <input type="text" readOnly className={`form-control `} name="FullName" id="FullName" placeholder="Enter Your Full Name" value={formData.FullName} onChange={handleChange} />

                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label" htmlFor="DOB">DOB (Date-Of-Birth)</label>
                            <input type="date" className={`form-control `} id="DOB" name="DOB" placeholder="Enter Date Of Birth" value={formData.DOB} onChange={handleChange} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label" htmlFor="Gender">Gender</label>
                            <select disabled className={`form-select p-half `} id="Gender" name="Gender" value={formData.Gender} onChange={handleChange}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Contact Numbers */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="ContactNumber">Contact Number <span className="text-danger">*</span></label>
                            <input type="text" className={`form-control`} name="ContactNumber" id="ContactNumber" placeholder="Enter Your Contact Number" value={formData.ContactNumber} onChange={handleChange} />

                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="AlternateContact">Alternate Contact Number (optional)</label>
                            <input type="text" className={`form-control`} name="AlternateContact" id="AlternateContact" placeholder="Enter Your Alternate Contact Number" value={formData.AlternateContact} onChange={handleChange} />

                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className=" fw-bold">Teacher Communication Address</h3>
                        <hr className="border-2 border-danger mt-0" />
                    </div>

                    {/* Permanent Address */}
                    <h6 className=" fw-bold">Permanent Address (*) </h6>
                    <div className="row">
                        {/* House No. Input Field */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="HouseNo">House No.</label>
                            <input
                                type="text"
                                className={`form-control ${errors.PermanentAddressHouseNo ? 'is-invalid' : ''}`}
                                name="HouseNo"
                                id="HouseNo"
                                placeholder="Enter House No"
                                value={formData.PermanentAddress.HouseNo}
                                onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                            />
                            {errors.PermanentAddressHouseNo && <div className="invalid-feedback">{errors.PermanentAddressHouseNo}</div>}
                        </div>

                        {/* District Input Field */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="District">District</label>
                            <input
                                type="text"
                                className={`form-control ${errors.PermanentAddressDistrict ? 'is-invalid' : ''}`}
                                name="District"
                                id="District"
                                placeholder="Enter District"
                                value={formData.PermanentAddress.District}
                                onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                            />
                            {errors.PermanentAddressDistrict && <div className="invalid-feedback">{errors.PermanentAddressDistrict}</div>}
                        </div>

                        {/* Landmark Input Field */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="LandMark">LandMark</label>
                            <input
                                type="text"
                                className={`form-control ${errors.PermanentAddressLandMark ? 'is-invalid' : ''}`}
                                name="LandMark"
                                id="LandMark"
                                placeholder="Enter Landmark"
                                value={formData.PermanentAddress.LandMark}
                                onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                            />
                            {errors.PermanentAddressLandMark && <div className="invalid-feedback">{errors.PermanentAddressLandMark}</div>}
                        </div>

                        {/* Pincode Input Field */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="Pincode">Pincode</label>
                            <input
                                type="text"
                                className={`form-control ${errors.PermanentAddressPincode ? 'is-invalid' : ''}`}
                                name="Pincode"
                                id="Pincode"
                                placeholder="Enter Pincode"
                                value={formData.PermanentAddress.Pincode}
                                onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                            />
                            {errors.PermanentAddressPincode && <div className="invalid-feedback">{errors.PermanentAddressPincode}</div>}
                        </div>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={isAddressSame}
                                onChange={handleAddressSame}
                            />
                            Same as Permanent Address
                        </label>
                    </div>

                    {/* Current Address */}
                    <h6 className=" fw-bold">Current Address (*) </h6>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="HouseNo">House No.</label>
                            <input type="text" className={`form-control ${errors.CurrentAddressHouseNo ? 'is-invalid' : ''}`} name="HouseNo" id="HouseNo" placeholder="Enter House No" value={formData.CurrentAddress.HouseNo} onChange={(e) => handleNestedChange(e, 'CurrentAddress')} />
                            {errors.CurrentAddressHouseNo && <div className="invalid-feedback">{errors.CurrentAddressHouseNo}</div>}

                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="District">District</label>
                            <input type="text" className={`form-control ${errors.CurrentAddressDistrict ? 'is-invalid' : ''}`} name="District" id="District" placeholder="Enter District" value={formData.CurrentAddress.District} onChange={(e) => handleNestedChange(e, 'CurrentAddress')} />
                            {errors.CurrentAddressDistrict && <div className="invalid-feedback">{errors.CurrentAddressDistrict}</div>}

                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="LandMark">LandMark</label>
                            <input type="text" className={`form-control ${errors.CurrentAddressLandMark ? 'is-invalid' : ''}`} name="LandMark" id="LandMark" placeholder="Enter Landmark" value={formData.CurrentAddress.LandMark} onChange={(e) => handleNestedChange(e, 'CurrentAddress')} />
                            {errors.CurrentAddressLandMark && <div className="invalid-feedback">{errors.CurrentAddressLandMark}</div>}

                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="Pincode">Pincode</label>
                            <input type="text" className={`form-control ${errors.CurrentAddressPincode ? 'is-invalid' : ''}`} name="Pincode" id="Pincode" placeholder="Enter Pincode" value={formData.CurrentAddress.Pincode} onChange={(e) => handleNestedChange(e, 'CurrentAddress')} />
                            {errors.CurrentAddressPincode && <div className="invalid-feedback">{errors.CurrentAddressPincode}</div>}
                        </div>
                    </div>

                    {/* Qualification, Teaching Experience, Expected Fees */}
                    <h6 className=" fw-bold">Other Details (*) </h6>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="Qualification">Qualification</label>
                            <input type="text" className={`form-control ${errors.Qualification ? 'is-invalid' : ''}`} name="Qualification" id="Qualification" placeholder="Enter Qualification" value={formData.Qualification} onChange={handleChange} />
                            {errors.Qualification && <div className="text-danger">{errors.Qualification}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="TeachingExperience">Teaching Experience</label>
                            <input type="text" className={`form-control ${errors.TeachingExperience ? 'is-invalid' : ''}`} name="TeachingExperience" id="TeachingExperience" placeholder="Enter Teaching Experience" value={formData.TeachingExperience} onChange={handleChange} />
                            {errors.TeachingExperience && <div className="text-danger">{errors.TeachingExperience}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="ExpectedFees">Expected Fees</label>
                            <input type="text" className={`form-control ${errors.ExpectedFees ? 'is-invalid' : ''}`} name="ExpectedFees" id="ExpectedFees" placeholder="Enter Expected Fees" value={formData.ExpectedFees} onChange={handleChange} />
                            {errors.ExpectedFees && <div className="text-danger">{errors.ExpectedFees}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="VehicleOwned">Do You have Vehicle ?</label>
                            <select className={`form-select p-half ${errors.VehicleOwned ? 'is-invalid' : ''}`} name={`VehicleOwned`} value={formData.VehicleOwned} onChange={handleChange}>
                                <option value="">Select True Or False</option>
                                <option value="true">True</option>
                                <option value="false">False</option>


                            </select>
                            {errors.VehicleOwned && <div className="text-danger">{errors.VehicleOwned}</div>}
                        </div>
                    </div>

                    {/* Dynamic Academic Information Section */}
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <button type="button" className="btn btn-primary" onClick={handleAddClass}>Add Class</button>
                        </div>
                    </div>
                    {formData.AcademicInformation.map((info, index) => (
                        <div key={index} className="row mb-3">
                            <div className="col-md-5 mb-3">
                                <label className="form-label" htmlFor={`ClassId-${index}`}>Class</label>
                                <select className={`form-select p-half ${errors.PermanentAddressPincode ? 'is-invalid' : ''}`} id={`ClassId-${index}`} name={`ClassId-${index}`} value={info.ClassId} onChange={(e) => handleClassChange(e, index)}>
                                    <option value="">Select Class</option>
                                    {concatenatedData.map((item, idx) => (
                                        <option key={idx} value={item.id}>{item.class}</option>
                                    ))}
                                </select>
                                {errors[`AcademicClassId-${index}`] && <div className="text-danger">{errors[`AcademicClassId-${index}`]}</div>}
                            </div>

                            <div className="col-md-5 mb-3">
                                <label className="form-label" htmlFor={`SubjectNames-${index}`}>Subjects</label>
                                <Select
                                    id={`SubjectNames-${index}`}
                                    name={`SubjectNames-${index}`}
                                    isMulti // Enable multiple selections
                                    options={subjects.map((item) => ({ label: item.SubjectName, value: item.SubjectName }))} // Convert subjects to options format
                                    value={info.SubjectNames.map((subject) => ({ label: subject, value: subject }))} // Map selected subjects to react-select format
                                    onChange={(selectedOptions) => handleSubjectNameChange(selectedOptions, index)} // Update function to handle react-select format

                                    className={`basic-multi-select p-half ${errors.PermanentAddressPincode ? 'is-invalid' : ''}`}
                                    classNamePrefix="select"
                                />

                                {errors[`AcademicSubjectNames-${index}`] && <div className="text-danger">{errors[`AcademicSubjectNames-${index}`]}</div>}
                            </div>
                            <div className="col-md-3 mb-3">
                                <button type="button" className="btn btn-primary" onClick={() => handleRemoveClass(index)}>Remove Class</button>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {step === 2 && (
                <div>


                    <div className="col-md-6 mb-3">
                        <label className="form-label" htmlFor="TeachingMode">Teaching Mode</label>
                        <select className={`form-select p-half ${errors.TeachingMode ? 'is-invalid' : ''}`} name={`TeachingMode`} value={formData.TeachingMode} onChange={handleChange}>
                            <option value="">Select Your's Teaching Mode</option>
                            <option value="Home Tuition at Student\'s Home">Home Tuition at Student's Home</option>
                            <option value="Home Tuition at Your Home">Home Tuition at Your Home</option>
                            <option value="Institute or Group Tuition">Institute or Group Tuition</option>

                            <option value="Online Class">Online Class</option>



                        </select>
                        {errors.TeachingMode && <div className="text-danger">{errors.TeachingMode}</div>}
                    </div>

                    <div className=" mb-2 mt-4">

                        <div className="form-group">
                            <label htmlFor="radiusSelect">Select Radius (in km): </label>
                            <select
                                id="radiusSelect"
                                className="form-control"
                                value={radius}
                                onChange={(e) => {
                                    setRadius(e.target.value);
                                    fetchNearbyPlaces(); // Call on change
                                }}
                            >
                                {/* Options from 5 to 80 km in increments of 5 km */}
                                {[...Array(16)].map((_, index) => {
                                    const value = (index + 1) * 5; // 5, 10, ..., 80
                                    return (
                                        <option key={value} value={value}>
                                            {value} km
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    {latitude && longitude && (
                        <LoadScript googleMapsApiKey={"AIzaSyBQ-6XL1bXfYt7_7inMBOFXLg5Zmram81o"}>
                            <GoogleMap
                                center={{ lat: latitude, lng: longitude }}
                                zoom={12}
                                mapContainerStyle={{ width: "100%", height: "500px" }}
                            >

                                <Marker position={{ lat: latitude, lng: longitude }} />


                                <Circle
                                    center={{ lat: latitude, lng: longitude }}
                                    radius={radius * 1000}
                                    options={{
                                        fillColor: "rgba(0, 123, 255, 0.2)",
                                        strokeColor: "#007bff",
                                        strokeWeight: 2,
                                    }}
                                />


                            </GoogleMap>
                        </LoadScript>
                    )}
                </div>
            )}

            <div className="row mt-4 w-100">
                <div className="col d-flex justify-content-between">
                    {step > 1 && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handlePrevious}
                        >
                            Previous
                        </button>
                    )}

                    {step < 2 && (
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    )}

                    {step === 2 && (
                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn btn-success ${loading ? 'disabled' : ''} `}
                            onClick={handleSubmit}
                        >
                            {loading ? "Please Wait ....." : "Submit"}
                        </button>
                    )}
                </div>
            </div>

            {errorModel && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Submission Review</h5>
                                <button type="button" className="close" onClick={() => setErrorModel(false)} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to submit this information?</p>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProfilePage;
