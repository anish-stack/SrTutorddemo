import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ClassSearch } from "../../Slices/Class.slice";
import Cookies from "js-cookie";
import Select from 'react-select';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
            streetAddress: '',
            Area: '',
            City: '',
            LandMark: '',
            Pincode: '',
        },
        CurrentAddress: {
            streetAddress: '',
            Area: '',
            City: '',
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
    const [currentLocation, setCurrentLocation] = useState([28.687446456774957, 77.14151483304185]);

    const [allPoints, setAllPoints] = useState([]);

    const [errorMessage, setErrorMessage] = useState(null);

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        watchPosition: false,
        userDecisionTimeout: 5000,
    });

    const handleLocationClick = (lat, lng, setAllPoints, allPoints) => {
        setAllPoints((prevPoints) => {
            const existingIndex = prevPoints.findIndex(point => point.lat === lat && point.lng === lng);

            if (existingIndex > -1) {
                return prevPoints.filter((_, index) => index !== existingIndex);
            } else {
                return [...prevPoints, { lng, lat }];
            }
        });
    };

    const MapClickHandler = ({ handleMapClick }) => {
        const map = useMap();

        useEffect(() => {
            map.on('click', handleMapClick);

            return () => {
                map.off('click', handleMapClick);
            };
        }, [map, handleMapClick]);

        return null;
    };

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
    const [subjects, setSubjects] = useState();
    const [latitude, setLatitude] = useState(null);

    const [longitude, setLongitude] = useState(null);
    const [radius, setRadius] = useState('');
    const [places, setPlaces] = useState([]);

    const [selectedPlace, setSelectedPlace] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [initialConfirm, setInitialConfirm] = useState(false);

    const [user, setUser] = useState({
        TeacherName: '',
        DOB: '',
        Gender: '',
        ContactNumber: '',
        AlternateContact: '',
        PermanentAddress: {
            streetAddress: '',
            Area: '',
            LandMark: '',
            City: '',
            Pincode: '',
        },
        CurrentAddress: {
            streetAddress: '',
            Area: '',
            City: '',
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
            const filterOutClasses =["I-V", "VI-VIII", "IX-X", "XI-XII"];

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

    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng;
        handleLocationClick(lat, lng, setAllPoints, allPoints);

    };

    const handleDoubleClick = (lat, lng) => {
        handleLocationClick(lat, lng, setAllPoints, allPoints);
    };

    const requestLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setPermissionDenied(true);
                }
                console.error("Error getting location:", error);
            }
        );
    };

    useEffect(() => {
        if (allPoints.length < 2) {
            setErrorMessage('You must select at least 2 locations.');
        } else {
            setErrorMessage(null);
        }
    }, [allPoints]);

    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="color: red; font-size: 24px;">
            <i class="fas fa-map-marker-alt"></i>
          </div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
    });


    useEffect(() => {
        const confirmAccess = window.confirm("We would like to access your location to provide a better experience. Do you allow?");
        if (confirmAccess) {
            setInitialConfirm(true); // Mark that user clicked OK
            requestLocation();
        }
    }, []);

    // const handleAddressSame = () => {
    //     setFormData(prevState => ({
    //         ...prevState,
    //         isAddressSame: !prevState.isAddressSame,
    //         CurrentAddress: !prevState.isAddressSame ? prevState.PermanentAddress : {
    //             streetAddress: '',
    //             City: '',
    //             Area: '',
    //             LandMark: '',
    //             Pincode: ''
    //         }
    //     }));
    // };


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
    useEffect(() => {
        if (radius) {
            fetchNearbyPlaces();
        }
    }, [radius]);

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
            if (response.data.data) {

                setSubjects(response.data.data.Subjects);
            } else {
                setSubjects([]);
            }
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

    // const handleNestedChange = (e, addressType) => {
    //     const { name, value } = e.target;
    //     setFormData(prevState => ({
    //         ...prevState,
    //         [addressType]: {
    //             ...prevState[addressType],
    //             [name]: value
    //         }
    //     }));
    // };


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
                    streetAddress: user.PermanentAddress?.streetAddress || '',
                    City: user.PermanentAddress.City,
                    Area: user.PermanentAddress?.Area || '',
                    LandMark: user.PermanentAddress?.LandMark || '',
                    Pincode: user?.PermanentAddress?.Pincode || '',
                },
                CurrentAddress: {
                    streetAddress: user.PermanentAddress?.streetAddress || '',
                    Area: user.PermanentAddress?.Area || '',
                    City: user.PermanentAddress.City,
                    LandMark: user.PermanentAddress?.LandMark || '',
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
            if (!formData.PermanentAddress.streetAddress) newErrors.PermanentAddressstreetAddress = 'Street Address. is required';
            if (!formData.PermanentAddress.Area) newErrors.PermanentAddressArea = 'Area is required';
            if (!formData.PermanentAddress.LandMark) newErrors.PermanentAddressLandMark = 'Landmark is required';
            if (!formData.PermanentAddress.Pincode) newErrors.PermanentAddressPincode = 'Pincode is required';
            if (!formData.CurrentAddress.streetAddress) newErrors.CurrentAddressstreetAddress = 'Street Address. is required';
            if (!formData.CurrentAddress.Area) newErrors.CurrentAddressArea = 'Area is required';
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

    if (permissionDenied) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="alert alert-danger text-center p-4" role="alert" style={{ maxWidth: '500px' }}>
                    <h4 className="alert-heading">Location Access Denied</h4>
                    <p>
                        It looks like you have denied location access. Please enable it in your browser settings to continue.
                    </p>
                    <hr />
                    <p className="mb-3">
                        For the best experience, please allow location access or adjust your browser permissions.
                    </p>
                    {/* Button that opens a help page or provides guidance */}
                    <a href="https://support.google.com/chrome/answer/142065?hl=en" target="_blank" rel="noopener noreferrer">
                        <button className="btn btn-primary">Go to Location Settings</button>
                    </a>
                </div>
            </div>
        );
    }



    const handleSubmit = async (e, retry = false) => {
        e.preventDefault();

        if (validateForm()) {
            if (typeof allPoints !== 'undefined') {
                setFormData((prevData) => ({
                    ...prevData,
                    RangeWhichWantToDoClasses: [allPoints]
                }));
            } else {
                alert('Are You Sure');
                console.error("allPoints is not defined or is undefined");
                return; // Exit the function if allPoints is undefined
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
            toast.success("🎉 Profile submitted successfully! 📧");
            setLoading(false);

            setTimeout(() => {
                // window.location.href = `/Teacher-Profile-Verify?token=${tokenQuery}&id=${IdQuery}`;
                window.location.href = `/Teacher-dashboard`;


            }, 500);
        } catch (error) {
            console.log(error);
            setLoading(false);

            if (!loading) {
                setErrorModel(true)
            }

        }
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
                            <select className={`form-select p-1 p-half ${errors.VehicleOwned ? 'is-invalid' : ''}`} name={`VehicleOwned`} value={formData.VehicleOwned} onChange={handleChange}>
                                <option value="">Select Yes Or No</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>


                            </select>
                            {errors.VehicleOwned && <div className="text-danger">{errors.VehicleOwned}</div>}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-12">
                            <button type="button" className="btn btn-primary" onClick={handleAddClass}>Add Class</button>
                        </div>
                    </div>
                    {formData.AcademicInformation.map((info, index) => (
                        <div key={index} className="row mb-3">
                            <div className="col-md-5 mb-3">
                                <label className="form-label" htmlFor={`ClassId-${index}`}>Class</label>
                                <select className={`form-select mt-3 p-2 p-half ${errors.PermanentAddressPincode ? 'is-invalid' : ''}`} id={`ClassId-${index}`} name={`ClassId-${index}`} value={info.ClassId} onChange={(e) => handleClassChange(e, index)}>
                                    <option value="">Select Class</option>
                                    {concatenatedData.map((item, idx) => (
                                        <option key={idx} value={item.id}>{item.class}</option>
                                    ))}
                                </select>
                                {errors[`AcademicClassId-${index}`] && <div className="text-danger">{errors[`AcademicClassId-${index}`]}</div>}
                            </div>

                            <div style={{position:'relative',zIndex:'99'}} className="col-md-5  mb-3">
                                <label className="form-label" htmlFor={`SubjectNames-${index}`}>Subjects</label>
                                <Select
                                    id={`SubjectNames-${index}`}
                                    name={`SubjectNames-${index}`}
                                    isMulti
                                    options={subjects && subjects.map((item) => ({ label: item.SubjectName, value: item.SubjectName }))}
                                    value={info.SubjectNames.map((subject) => ({ label: subject, value: subject }))}
                                    onChange={(selectedOptions) => handleSubjectNameChange(selectedOptions, index)}
                                    className={`basic-multi-select p-half ${errors.PermanentAddressPincode ? 'is-invalid' : ''}`}
                                    classNamePrefix="select"
                                    placeholder="Select subjects" // Add placeholder here
                                    isClearable // Allows clearing the selection
                                />

                                {errors[`AcademicSubjectNames-${index}`] && <div className="text-danger">{errors[`AcademicSubjectNames-${index}`]}</div>}
                            </div>

                            <div className="col-md-2 mb-3">


                                <button type="button" style={{ marginTop: "35px" }} className="btn p-3 btn-primary" onClick={() => handleRemoveClass(index)}>Remove Class</button>

                            </div>
                        </div>
                    ))}

                    <div className="col-md-12 mb-3">
                        <label className="form-label" htmlFor="TeachingMode">Teaching Mode</label>
                        <select className={`form-select p-half ${errors.TeachingMode ? 'is-invalid' : ''}`} name={`TeachingMode`} value={formData.TeachingMode} onChange={handleChange}>
                            <option value="">Select Your's Teaching Mode</option>
                            <option value="Offline Class">Offline Class</option>
                            <option value="Online Class">Online Class</option>



                        </select>
                        {errors.TeachingMode && <div className="text-danger">{errors.TeachingMode}</div>}
                    </div>

                    {latitude && longitude && (
                        <div className="map-container" style={{ position: 'relative', zIndex: 1 }}>
                            <MapContainer
                                center={currentLocation}
                                zoom={12}
                                scrollWheelZoom={true}
                                style={{ height: '500px', width: '100%', borderRadius: '15px' }} // Adjust width to 100% for responsiveness
                            >
                                <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapClickHandler handleMapClick={handleMapClick} />
                                {currentLocation && (
                                    <Marker position={currentLocation} icon={customIcon}>
                                        <Popup>Your current location</Popup>
                                    </Marker>
                                )}
                                {allPoints.map((point, index) =>
                                    point.lat && point.lng ? (
                                        <Marker
                                            key={index}
                                            icon={customIcon}
                                            position={[point.lat, point.lng]}

                                        >


                                        </Marker>
                                    ) : null
                                )}
                            </MapContainer>

                            {errorMessage && (
                                <Alert variant="danger" className="mt-3">
                                    {errorMessage}
                                </Alert>
                            )}

                            <div className="mt-3">
                                <h5>Selected Locations ({allPoints.length})</h5>
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Latitude</th>
                                            <th>Longitude</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allPoints.map((point, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{point.lat.toFixed(6)}</td>
                                                <td>{point.lng.toFixed(6)}</td>
                                                <td>
                                                    <button
                                                        style={{
                                                            backgroundColor: 'red',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '5px 10px',
                                                            fontSize: '14px',
                                                            cursor: 'pointer',
                                                            borderRadius: '5px'// Rounded corners
                                                        }}
                                                        onClick={() => handleDoubleClick(point.lat, point.lng)}
                                                    >
                                                        Delete Location
                                                    </button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}

                </div>
            )}


            <div className="row mt-4 w-100">
                <div className="col-md-6 d-flex justify-content-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn btn-success ${loading ? 'disabled' : ''} `}
                        onClick={handleSubmit}
                    >
                        {loading ? "Please Wait ....." : "Submit"}
                    </button>



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
