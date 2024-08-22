import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { ClassSearch } from "../../Slices/Class.slice";
import "./PostRequirement.css"; // Ensure to include your CSS file

const PostRequirement = () => {
  const [studentToken, setStudentToken] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [advanced, setAdvanced] = useState({
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
    isBestFaculty: false,
  });
  useEffect(() => {
    const student = Cookies.get("studentToken");
    setStudentToken(student || null);

  
  }, [studentToken]);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isBoxVisible, setIsBoxVisible] = useState(true);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.Class);

  useEffect(() => {
    dispatch(ClassSearch()); // Fetch classes on component mount
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      const romanNumerals = [
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
        "X",
        "XI",
        "XII",
      ];

      const parseClassRange = (range) => {
        const [start, end] = range.split("-").map((s) => s.trim());
        const startIndex = romanNumerals.indexOf(start);
        const endIndex = romanNumerals.indexOf(end);

        if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
          return [];
        }

        return romanNumerals.slice(startIndex, endIndex + 1);
      };

      const rangeClasses = data.flatMap((item) => {
        if (item.Class && item.Class.includes("-")) {
          return parseClassRange(item.Class).map((cls) => ({
            id: item._id,
            label: cls,
            value: cls,
          }));
        }
        return [];
      });

      const otherClasses = data.flatMap((item) => {
        if (item.Class && !item.Class.includes("-")) {
          return [
            {
              id: item._id,
              label: item.Class,
              value: item.Class,
            },
          ];
        }
        return [];
      });

      const uniqueClasses = Array.from(
        new Map(
          [...rangeClasses, ...otherClasses].map((cls) => [cls.value, cls])
        ).values()
      );

      setClasses(uniqueClasses);
    }
  }, [data]);

  const fetchSubjects = async (classId) => {
    console.log(classId);
    try {
      const response = await axios.get(
        `https://www.sr.apnipaathshaala.in/api/v1/admin/Get-Class-Subject/${classId}`
      );
      setSubjects(response.data.data.Subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleLocationFetch = async (input) => {
    try {
      const res = await axios.get(
        "https://place-autocomplete1.p.rapidapi.com/autocomplete/json",
        {
          params: { input, radius: "500" },
          headers: {
            "x-rapidapi-key":
              "75ad2dad64msh17034f06cc47c06p18295bjsn18e367df005b",
            "x-rapidapi-host": "place-autocomplete1.p.rapidapi.com",
          },
        }
      );
      setLocationSuggestions(res.data.predictions || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdvanced((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "Location") {
      handleLocationFetch(value);
    }
  };

  const handleLocationSelect = (location) => {
    setAdvanced((prevState) => ({
      ...prevState,
      Location: location.description,
    }));
    setLocationSuggestions([]);
  };

  const handleSubjectChange = (selectedOptions) => {
    console.log("subject", selectedOptions);
    setAdvanced((prevState) => ({
      ...prevState,
      Subject: selectedOptions
        ? selectedOptions.map((option) => option.label)
        : [],
    }));
  };

  const handleClassChange = (e) => {
    console.log(selectedClass);
    const classId = e ? e.target.value : "";
    setSelectedClass(classId);
    setAdvanced((prevState) => ({ ...prevState, Subject: [] }));
    fetchSubjects(classId);
  };

  const handleSelectAllSubjects = (e) => {
    const isChecked = e.target.checked;
    setAdvanced((prevState) => ({
      ...prevState,
      Subject: isChecked ? subjects.map((subject) => subject._id) : [],
    }));
  };

  const handleSearchClick = async (e) => {
    console.log(advanced);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 200) {
        // Adjust the scroll threshold as needed
        setIsBoxVisible(false);
      } else {
        setIsBoxVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAllSubjectsSelected =
    subjects.length > 0 &&
    subjects.every((subject) => advanced.Subject.includes(subject._id));

  const subjectOptions = subjects.map((subject) => ({
    value: subject._id,
    label: subject.SubjectName,
  }));

  const classOptions = classes.map((cls) => ({
    value: cls.id,
    label: cls.label,
  }));
  if (!studentToken) {
    return (
      <div className="unauthorized">
        <h3>Unauthorized Access</h3>
        <p>Please log in to access this page.</p>
      </div>
    );
  }
  return (
    <div className="container my-5">
      <h2 className="form-title mb-4 text-center">Post Your Requirement</h2>
      <p className="text-muted mb-4 text-center form-description">
        Fill out the form below to specify your requirements for finding the
        right tutor.
      </p>
      <form>
        <div className="col-md-6 col-12 mb-2">
          <div className="form-check">
            <input
              type="checkbox"
              id="isBestFaculty"
              name="isBestFaculty"
              checked={advanced.isBestFaculty}
              onChange={(e) =>
                setAdvanced((prevState) => ({
                  ...prevState,
                  isBestFaculty: e.target.checked,
                }))
              }
              className="form-check-input"
            />
            <label htmlFor="isBestFaculty" className="form-check-label">
              Check if you are looking for the best faculty
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-12 mb-2">
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
              {classes.map((cls) => (
                <>
                  {/* { console.log(cls)} */}
                  <option key={cls.id} value={cls.id}>
                    {cls.label}
                  </option>
                </>
              ))}
            </select>
          </div>
          <div className="col-md-6 col-12">
            <label
              htmlFor="Subject"
              className="form-label d-flex align-items-center justify-content-between"
            >
              Choose the subjects you want to learn{" "}
              <span className="text-danger">*</span>
              <div className=" ">
                <input
                  type="checkbox"
                  checked={isAllSubjectsSelected}
                  onChange={handleSelectAllSubjects}
                  className="form-check-input me-2"
                  id="select-all"
                />
                <label htmlFor="select-all" className="form-check-label">
                  Select All
                </label>
              </div>
            </label>
            <div
              className={`box ${!isBoxVisible ? "" : ""}   rounded  bg-white`}
            >
              <div className="row">
                <Select
                  isMulti
                  name="Subject"
                  value={subjectOptions.filter((option) =>
                    advanced.Subject.includes(option.label)
                  )}
                  onChange={handleSubjectChange}
                  options={subjectOptions}
                  placeholder="Select Subjects"
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 mb-2">
            <label htmlFor="Gender" className="form-label">
              Gender <span className="text-danger">*</span>
            </label>
            <select
              id="Gender"
              name="Gender"
              value={advanced.Gender}
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

          <div className="col-md-6 col-12 mb-2">
            <label htmlFor="VehicleOwned" className="form-label">
              Indicate if you own a vehicle{" "}
              <span className="text-danger">*</span>
            </label>
            <select
              id="VehicleOwned"
              name="VehicleOwned"
              value={advanced.VehicleOwned}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="" disabled>
                Select Vehicle
              </option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="col-md-6 col-12 mb-2">
            <label htmlFor="TeachingExperience" className="form-label">
              Select the required teaching experience{" "}
              <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="TeachingExperience"
              name="TeachingExperience"
              value={advanced.TeachingExperience}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter years of experience"
            />
          </div>
          <div className="col-md-6 col-12 mb-2">
            <label htmlFor="Location" className="form-label">
              Enter your preferred location{" "}
              <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="Location"
              name="Location"
              value={advanced.Location}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter location"
            />
            {locationSuggestions.length > 0 && (
              <ul className="location-suggestions">
                {locationSuggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    onClick={() => handleLocationSelect(suggestion)}
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="col-md-6 col-12 mb-2">
            <label htmlFor="TeachingMode" className="form-label">
              Choose your preferred teaching mode (e.g., online, in-person){" "}
              <span className="text-danger">*</span>
            </label>
            <select
              id="TeachingMode"
              name="TeachingMode"
              value={advanced.TeachingMode}
              onChange={handleInputChange}
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
          <div className="col-md-6 col-12 mb-2">
            <label htmlFor="TeachingMode" className="form-label">
              Choose your preferred teaching mode (e.g., online, in-person){" "}
              <span className="text-danger">*</span>
            </label>
            <select
              id="StartDate"
              name="StartDate"
              value={advanced.StartDate}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="Immediately"> Which date You Want Teacher</option>
              <option value="Immediately">Immediately</option>
              <option value="Within next 2 weeks">Within next 2 weeks</option>
              <option value="Not sure, right now just checking prices">
                Willing to travel to Teacher's Home
              </option>
            </select>
          </div>
          <div className="col-md-6 col-12 mb-2">
            <label htmlFor="MinRange" className="form-label">
              Specify the minimum budget range{" "}
              <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              id="MinRange"
              name="MinRange"
              value={advanced.MinRange}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter minimum range"
            />
          </div>
          <div className="col-md-6 col-12 mb-2">
            <label htmlFor="MaxRange" className="form-label">
              Specify the maximum budget range
              <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              id="MaxRange"
              name="MaxRange"
              value={advanced.MaxRange}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter maximum range"
            />
          </div>
        </div>
        <div className="col-md-12 col-12 mb-4">
          <label htmlFor="SpecificRequirement" className="form-label">
            Specific Requirements
            <span className="text-danger">*</span>
          </label>
          <textarea
            id="SpecificRequirement"
            name="SpecificRequirement"
            onChange={handleInputChange}
            value={advanced.SpecificRequirement}
            className="form-control custom-textarea"
            placeholder="Please describe any specific requirements or preferences you have."
          ></textarea>
        </div>

        <button
          type="button"
          onClick={handleSearchClick}
          className="btn btn-primary"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default PostRequirement;
