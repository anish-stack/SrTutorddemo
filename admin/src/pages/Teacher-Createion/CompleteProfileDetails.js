import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import toast from 'react-hot-toast'; // Assuming you are using react-toastify for notifications

const CompleteProfileDetails = () => {
  const { id } = useParams();

  const [user, setUser] = useState({});
  const [fetchClasses, setFetchClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
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
    TeachingLocation: { State: '', City: '', Area: [], lat: '', lng: '' },
    AcademicInformation: [],
  });

  const fetchUser = async () => {
    try {
      const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/teacher/Teacher-details/${id}`);
      
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        FullName: user?.TeacherName || '',
        DOB: user?.DOB || '',
        Gender: user?.gender || '',
        ContactNumber: user?.PhoneNumber || '',
        AlternateContact: user.AltNumber || '',
        PermanentAddress: {
          streetAddress: user?.PermanentAddress?.streetAddress || '',
          City: user?.PermanentAddress?.City,
          Area: user?.PermanentAddress?.Area || '',
          LandMark: user?.PermanentAddress?.LandMark || '',
          Pincode: user?.PermanentAddress?.Pincode || '',
        },
        CurrentAddress: {
          streetAddress: user?.PermanentAddress?.streetAddress || '',
          Area: user?.PermanentAddress?.Area || '',
          City: user?.PermanentAddress?.City,
          LandMark: user?.PermanentAddress?.LandMark || '',
          Pincode: user?.PermanentAddress?.Pincode || '',
        },
        isAddressSame: user?.isAddressSame || false,
        Qualification: user?.Qualification || '',
        TeachingExperience: user?.TeachingExperience || '',
        ExpectedFees: user?.ExpectedFees || '',
        VehicleOwned: user?.VehicleOwned || '',
        TeachingMode: user?.TeachingMode || '',
        AcademicInformation: user?.AcademicInformation || [{
          ClassId: '',
          SubjectNames: ['']
        }],
      }));
    }


  }, [user]);
  console.log(formData)
  const handleFetchClasses = async () => {
    try {
      const response = await axios.get('https://api.srtutorsbureau.com/api/v1/admin/Get-Classes');
      const data = response.data.data;

      if (data) {
        const filterOutClasses = ["I-V", "VI-VIII", "IX-X", "XI-XII"];
        const filteredClasses = data


          .filter(item => !filterOutClasses.includes(item.Class))
          .map(item => ({ class: item.Class, id: item._id }));
        const rangeClasses = data
          .filter(item => item.InnerClasses && item.InnerClasses.length > 0)
          .flatMap(item => item.InnerClasses.map(innerClass => ({
            class: innerClass.InnerClass,
            id: innerClass._id
          })));
        const concatenatedData = rangeClasses.concat(filteredClasses);
        console.log(concatenatedData)
        setFetchClasses(concatenatedData);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSubjects = async (classId) => {
    try {
      const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/admin/Get-Class-Subject/${classId}`);
      setSubjects(response.data.data ? response.data.data.Subjects : []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };
  const handleClassChange = (event, index) => {
    const [id, className] = event.target.value.split('|');
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

  const handleSubjectChange = (selectedSubjects, index) => {
    const updatedAcademicInformation = [...formData.AcademicInformation];
    updatedAcademicInformation[index].SubjectNames = selectedSubjects.map(subject => subject.value);
    setFormData({ ...formData, AcademicInformation: updatedAcademicInformation });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddClass = () => {
    setFormData({
      ...formData,
      AcademicInformation: [...formData.AcademicInformation, { ClassId: '', className: '', SubjectNames: [] }],
    });
  };

  const handleRemoveClass = (index) => {
    const updatedAcademicInformation = formData.AcademicInformation.filter((_, i) => i !== index);
    setFormData({ ...formData, AcademicInformation: updatedAcademicInformation });
  };

  const getState = async () => {
    try {
      const { data } = await axios.get('https://api.srtutorsbureau.com/api/jd/getStates');
      setStates(data.map(state => ({ value: state, label: state })));
    } catch (error) {
      console.log('Error fetching states:', error);
    }
  };

  const getCity = async (state) => {
    try {
      const { data } = await axios.get(`https://api.srtutorsbureau.com/api/jd/getCitiesByState?state=${state}`);
      setCities(data.map(city => ({ value: city, label: city })));
    } catch (error) {
      console.log('Error fetching cities:', error);
    }
  };

  const getAreasByCity = async (city) => {
    try {
      const { data } = await axios.get(`https://api.srtutorsbureau.com/api/jd/getAreasByCity?city=${city}`);
      setAreas(data.map(area => ({ value: `${area.placename}|${area.lat}|${area.lng}`, label: area.placename })));
    } catch (error) {
      console.log('Error fetching areas:', error);
    }
  };

  const handleStateChange = (selectedState) => {
    setFormData({ ...formData, TeachingLocation: { ...formData.TeachingLocation, State: selectedState.value, City: '', Area: [] } });
    setCities([]);
    setAreas([]);
    getCity(selectedState.value);
  };

  const handleCityChange = (selectedCity) => {
    setFormData({ ...formData, TeachingLocation: { ...formData.TeachingLocation, City: selectedCity.value, Area: [] } });
    setAreas([]);
    getAreasByCity(selectedCity.value);
  };

  const handleAreaChange = (selectedAreas) => {
    const selectedAreaData = selectedAreas.map(option => {
      const [placename, lat, lng] = option.value.split('|');
      return { placename, lat, lng };
    });
    setFormData({ ...formData, TeachingLocation: { ...formData.TeachingLocation, Area: selectedAreaData } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      await axios.post(`https://api.srtutorsbureau.com/api/v1/teacher/teacher-profile-By-Admin?id=${id}`, formData);
      toast.success('🎉 Profile submitted successfully! 📧');
      setTimeout(() => {
        window.location.href = `/Manage-Teacher/${id}`
      }, 2000);

    } catch (error) {
      toast.error(error?.response?.data?.message);
      // setTimeout(() => {
      //   window.location.reload()
      // }, 2000);
      console.error('Error submitting profile:', error);
    }
  };

  useEffect(() => {
    getState();
    handleFetchClasses();
    fetchUser();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl text-center font-semibold mb-6">Complete Your Profile</h2>


        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="FullName"
            value={formData.FullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <h6 className="text-2xl font-bold mb-2">Other Details (*) </h6>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="Qualification" className="block text-sm font-medium text-gray-700 mb-2">
              Qualification
            </label>
            <input
              type="text"
              name="Qualification"
              id="Qualification"
              placeholder="Enter Qualification"
              value={formData.Qualification}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="TeachingExperience" className="block text-sm font-medium text-gray-700 mb-2">
              Teaching Experience
            </label>
            <input
              type="text"
              name="TeachingExperience"
              id="TeachingExperience"
              placeholder="Enter Teaching Experience"
              value={formData.TeachingExperience}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="ExpectedFees" className="block text-sm font-medium text-gray-700 mb-2">
              Expected Fees
            </label>
            <input
              type="text"
              name="ExpectedFees"
              id="ExpectedFees"
              placeholder="Enter Expected Fees"
              value={formData.ExpectedFees}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="VehicleOwned" className="block text-sm font-medium text-gray-700 mb-2">
              Do You Have a Vehicle?
            </label>
            <select
              name="VehicleOwned"
              id="VehicleOwned"
              value={formData.VehicleOwned}
              onChange={handleChange}
              className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 `}
            >
              <option value="">Select Yes or No</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>

          </div>
        </div>
        <div className="mb-4 mt-5">
          <label htmlFor="TeachingMode" className="block text-sm font-medium text-gray-700 mb-2">
            Teaching Mode
          </label>
          <select
            name="TeachingMode"
            id="TeachingMode"
            value={formData.TeachingMode}
            onChange={(event) => handleChange(event)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Your Teaching Mode</option>
            <option value="Offline Class">Offline Class</option>
            <option value="Online Class">Online Class</option>
            <option value="Both">Both</option>
          </select>
        </div>

        {/* State, City, and Area */}

        <button
          type="button"
          onClick={handleAddClass}
          className="py-2 px-4 mt-4 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Class
        </button>

        {formData.AcademicInformation.map((academic, index) => (
          <div key={index} className="mb-4 mt-3 bg-white rounded-lg ">
            <div className="flex flex-wrap items-center gap-4">
              {/* Class Dropdown */}
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor={`ClassId-${index}`}
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Class
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id={`ClassId-${index}`}
                  name={`ClassId-${index}`}
                  value={academic.classid}
                  onChange={(e) => handleClassChange(e, index)}
                >
                  <option value="">Select Class</option>
                  {fetchClasses.map((item, idx) => (
                    <option key={idx} value={`${item.id}|${item.class}`}>
                      {item.class}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subjects Multi-Select */}
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor={`Subjects-${index}`}
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Subjects
                </label>
                <Select
                  id={`Subjects-${index}`}
                  isMulti
                  options={
                    subjects &&
                    subjects.map((item) => ({
                      label: item.SubjectName,
                      value: item.SubjectName,
                    }))
                  }
                  onChange={(selected) => handleSubjectChange(selected, index)}
                  value={academic.SubjectNames.map((sub) => ({
                    value: sub,
                    label: sub,
                  }))}
                  className="w-full"
                />
              </div>

              {/* Remove Class Button */}
              <div className="mt-4 sm:mt-0">
                <button
                  type="button"
                  onClick={() => handleRemoveClass(index)}
                  className="py-2 px-4 mt-5 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                >
                  <svg
                    className="w-4 h-4 inline-block mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>

                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">State</label>
            <Select options={states} onChange={handleStateChange} />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <Select options={cities} onChange={handleCityChange} />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Area</label>
            <Select isMulti options={areas} onChange={handleAreaChange} />
          </div>
        </div>
        <div className="mt-6">
          <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
            Submit Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfileDetails;
