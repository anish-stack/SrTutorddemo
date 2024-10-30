import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ClassSearch } from "../../Slices/Class.slice";
import Cookies from "js-cookie";
import Select from 'react-select';
import toast from "react-hot-toast";
import CreatableSelect from 'react-select/creatable';

const ProfilePage = () => {


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
        TeachingLocation: {
            State: '',
            City: '',
            Area: '',
            lat: '',
            lng: ''
        },
        AcademicInformation: [{
            classid: '',
            className: '',
            SubjectNames: ['']
        }],


    });
    const location = new URLSearchParams(window.location.search)
    const tokenQuery = location.get('token')
    const IdQuery = location.get('encoded')
    const [concatenatedData, setConcatenatedData] = useState([]);
    const { data } = useSelector((state) => state.Class);
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [subjects, setSubjects] = useState();
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);


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
            // Step 1: Filter out specific classes
            // const classRanges = ["I-V", "VI-VIII", "IX-X", "XI-XII"];
            const filterOutClasses = ["I-V", "VI-VIII", "IX-X", "XI-XII"];
            const filteredClasses = data


                .filter(item => !filterOutClasses.includes(item.Class))
                .map(item => ({ class: item.Class, id: item._id }));


            // Step 2: Map inner classes
            const rangeClasses = data


                .filter(item => item.InnerClasses && item.InnerClasses.length > 0)
                .flatMap(item => item.InnerClasses.map(innerClass => ({
                    class: innerClass.InnerClass,
                    id: innerClass._id
                })));


            // Step 3: Concatenate filtered classes and inner classes
            const concatenatedData = rangeClasses.concat(filteredClasses);


            // Update state with concatenated data
            setConcatenatedData(concatenatedData);
        }
    }, [data]);




    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `http://localhost:7000/api/v1/teacher/Teacher-details/${IdQuery}`
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
                `http://localhost:7000/api/v1/admin/Get-Class-Subject/${classId}`
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
        const [id, className] = event.target.value.split('|');
        console.log(id, className);


        setFormData(prevState => {
            const updatedAcademicInformation = [...prevState.AcademicInformation];
            updatedAcademicInformation[index] = {
                ...updatedAcademicInformation[index],
                ClassId: id,
                className: className,
            };


            return {
                ...prevState,
                AcademicInformation: updatedAcademicInformation,
            };
        });


        fetchSubjects(id);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
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
                { ClassId: '', className: '', SubjectNames: [] }
            ]
        }));
    };


    const handleRemoveClass = (index) => {
        setFormData(prevState => ({
            ...prevState,
            AcademicInformation: prevState.AcademicInformation.filter((_, i) => i !== index)
        }));
    };


    const getState = async () => {
        try {
            const { data } = await axios.get("http://localhost:7000/api/jd/getStates");
            setStates(data.map(state => ({ value: state, label: state }))); // Format for react-select
        } catch (error) {
            console.log(error);
        }
    };


    const getCity = async (state) => {
        try {
            const { data } = await axios.get(`http://localhost:7000/api/jd/getCitiesByState?state=${state}`);
            setCities(data.map(city => ({ value: city, label: city }))); // Format for react-select
        } catch (error) {
            console.log(error);
        }
    };


    const getAreasByCity = async (city) => {
        try {
            const { data } = await axios.get(`http://localhost:7000/api/jd/getAreasByCity?city=${city}`);
            setAreas(data.map(area => ({ value: `${area.placename}|${area.lat}|${area.lng}`, label: area.placename })));
        } catch (error) {
            console.log(error);
        }
    };


    // Handle changes in the state selector
    const handleStateChange = (selectedOption) => {
        console.log(selectedOption)
        const selectedState = selectedOption.value;
        setFormData({
            ...formData,
            TeachingLocation: { ...formData.TeachingLocation, State: selectedState, City: '', Area: [] },
        });
        setCities([]);
        setAreas([]);
        getCity(selectedState);
    };


    const handleCityChange = (selectedOption) => {
        const selectedCity = selectedOption.value;
        setFormData({
            ...formData,
            TeachingLocation: { ...formData.TeachingLocation, City: selectedCity, Area: [] },
        });
        setAreas([]);
        getAreasByCity(selectedCity);
    };

    const handleAreaChange = (selectedOptions) => {
        console.log(selectedOptions); // For debugging purposes
    
        // Initialize an array to hold the selected area details
        const selectedAreas = selectedOptions.map(option => {
            const [placename, lat, lng] = option.value.split('|');
            return {
                placename,
                lat: lat || 0,
                lng: lng || 0
            };
        });
    
        // Update form data with selected areas
        setFormData({
            ...formData,
            TeachingLocation: {
                ...formData.TeachingLocation,
                Area: selectedAreas,
            },
        });
    
        // Check for newly created options
        selectedOptions.forEach(option => {
            if (option.__isNew__) {
                // Call to add new area
                handleAddNewArea(option.value);
            }
        });
    };
    
    // console.log(formData)



    const handleSubmit = async (e, retry = false) => {
        e.preventDefault();


        console.log(formData)


        try {
            setLoading(true);


            await axios.post('http://localhost:7000/api/v1/teacher/teacher-profile', formData, {
                headers: {
                    Authorization: `Bearer ${tokenQuery}`
                }
            });


            toast.success("🎉 Profile submitted successfully! 📧");
            setLoading(false);
            const userPrefix = "teacher";


            Cookies.set(`${userPrefix}Token`, tokenQuery, { expires: 1 });
            setTimeout(() => {
                window.location.href = `/Teacher-dashboard`;
            }, 500);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const handleAddNewArea = async (inputValue) => {
        const newOption = { value: inputValue, label: inputValue };
        // console.log(newOption.value); 
        const data = {
            state: formData.TeachingLocation?.State,
            district: formData.TeachingLocation?.City,
            areas: newOption.value
        };
        
        try {
           await axios.post('http://localhost:7000/api/v1/admin/AddNewArea', data);
            // console.log("New Area:", addNewArea.data); // Log the response data
            getAreasByCity(formData.TeachingLocation.City)
        } catch (error) {
            console.error("Error adding new area:", error); // Log any errors
        }
    };
    

    useEffect(() => {
        getState()
    }, [])


    return (
        <>
            <div className="container w-100 mt-5 p-5">
                <div className="mb-4">
                    <h1>Teacher Profile</h1>
                </div>
                <div>
                    <h6 className=" fw-bold">Other Details (*) </h6>


                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="Qualification">Qualification</label>
                            <input type="text" className={`form-control`} name="Qualification" id="Qualification" placeholder="Enter Qualification" value={formData.Qualification} onChange={handleChange} />


                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="TeachingExperience">Teaching Experience</label>
                            <input type="text" className={`form-control`} name="TeachingExperience" id="TeachingExperience" placeholder="Enter Teaching Experience" value={formData.TeachingExperience} onChange={handleChange} />


                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="ExpectedFees">Expected Fees</label>
                            <input type="text" className={`form-control `} name="ExpectedFees" id="ExpectedFees" placeholder="Enter Expected Fees" value={formData.ExpectedFees} onChange={handleChange} />


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
                        <div key={index} className="row position-relative mb-3">
                            <div className="col-md-5 mb-3">
                                <label className="form-label" htmlFor={`ClassId-${index}`}>Class</label>
                                <select
                                    className={`form-select mt-3 p-2 p-half`}
                                    id={`ClassId-${index}`}
                                    name={`ClassId-${index}`}
                                    value={info.classid}
                                    onChange={(e) => handleClassChange(e, index)}
                                >
                                    <option value="">Select Class</option>
                                    {concatenatedData.map((item, idx) => (
                                        <option key={idx} value={`${item.id}|${item.class}`}>
                                            {item.class}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className="col-md-5 mb-3">
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
                                    placeholder="Select subjects"
                                    isClearable
                                    styles={{
                                        menu: (base) => ({
                                            ...base,
                                            zIndex: 9999 // Ensure menu has high z-index
                                        })
                                    }}
                                />
                            </div>


                            <div className="col-md-2 mb-3">
                                <button
                                    type="button"
                                    style={{ marginTop: "35px" }}
                                    className="btn p-3 btn-primary"
                                    onClick={() => handleRemoveClass(index)}
                                >
                                    Remove Class
                                </button>
                            </div>
                        </div>
                    ))}




                    <div className="col-md-12 mb-3">
                        <label className="form-label" htmlFor="TeachingMode">Teaching Mode</label>
                        <select className={`form-select p-half `} name={`TeachingMode`} value={formData.TeachingMode} onChange={(event) => {
                            handleChange(event);


                        }}>
                            <option value="">Select Your's Teaching Mode</option>
                            <option value="Offline Class">Offline Class</option>
                            <option value="Online Class">Online Class</option>
                            <option value="Both">Both</option>

                        </select>
                    </div>
                    <h2>Please choose location where you want to teach</h2>


                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label" htmlFor="state">Select Your State</label>
                            <Select
                                options={states}
                                onChange={handleStateChange}
                                placeholder="Select Your State"
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label" htmlFor="city">Select Your Teshil (जिला)</label>
                            <Select
                                options={cities}
                                onChange={handleCityChange}
                                placeholder="Select Your City"
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label" htmlFor="area">Select Your Area (multiple)</label>
                            <CreatableSelect
                                isMulti
                                options={areas}
                                onChange={handleAreaChange}
                                placeholder="Select Your Area For Teaching"
                            />

                        </div>
                    </div>


                </div>






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






            </div>
        </>
    );
};


export default ProfilePage;



