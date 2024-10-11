
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClassSearch } from "../Slices/Class.slice";
import axios from "axios";
import bannerShape03 from "./banner/banner_shape03.png";
import backSvg from './back.svg'
import bannerImg01 from "./banner/banner_img01.png";
import bannerImg02 from "./banner/pngwing.com (11).png";
import bannerImg03 from "./banner/banner_img03.png";
import { useGeolocated } from "react-geolocated";

const Slider = () => {
  const { data, loading, error } = useSelector((state) => state.Class);
  const dispatch = useDispatch();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState({
    classid: '',
    classNameValue: ''
  });
  const [subjects, setSubjects] = useState([]);
  const [locationInput, setLocationInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [concatenatedData, setConcatenatedData] = useState([]);
  const [locationData, setLocationData] = useState({
    lng: '',
    lat: '',
  })
  useEffect(() => {
    dispatch(ClassSearch());
  }, [dispatch]);

  const [selectedRole, setSelectedRole] = useState('student');
  const handleRoleChange = (role) => {
    setSelectedRole(role);

  };
  useEffect(() => {
    if (data) {
      // Step 1: Filter out specific classes
      const filterOutClasses = ['I-V', 'VI-X', 'X-XII'];
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

  const fetchSubjects = async (classId) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/v1/admin/Get-Class-Subject/${classId}`
      );
      setSubjects(response.data.data.Subjects || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleSubjectChange = (event) => {
    const selectedSubjectId = event.target.value;
    const selectedSubjectObj = subjects.find(
      (subject) => subject._id === selectedSubjectId
    );
    setSelectedSubject(selectedSubjectObj ? selectedSubjectObj.SubjectName : "");
  };

  const handleLocationFetch = async (input) => {
    setLocationInput(input);

    if (input.length > 2) {
      try {



        const res = await axios.get(
          `http://localhost:7000/autocomplete?input=${input}`);
        console.log("Google", res.data)
        setLocationSuggestions(res.data || []);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        setLocationSuggestions([]);
      }
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    const selectedClassObj = concatenatedData.find(cls => cls.id === selectedClassId);
    console.log(selectedClassObj)
    if (selectedClassObj) {
      setSelectedClass({
        classid: selectedClassObj.id,
        classNameValue: selectedClassObj.class
      });
      fetchSubjects(selectedClassId);
    }
  };

  const handleLocationSelect = (suggestion) => {
    setLocationInput(suggestion);
    setLocationSuggestions([]);
    handleLocationLatAndLngFetch(suggestion)
  };
  const [ClickLatitude, setClickLatitude] = useState(null)
  const [ClickLongitude, setClickLongitude] = useState(null)

  const handleLocationLatAndLngFetch = async (address) => {
    const options = {
      method: 'GET',
      url: `http://localhost:7000/geocode?address=${address}`
    };

    try {
      const response = await axios.request(options);
      const result = response.data
      if (result) {
        setClickLatitude(result ? result.latitude : null);
        setClickLongitude(result ? result.longitude : null)
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }


  }


  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });
  useEffect(() => {
    // Check if coords is defined
    if (coords) {
      setLocationData({
        lng: coords.longitude,
        lat: coords.latitude
      });
    }
  }, [coords]);
  const handlePassQuery = () => {
    const cleanAndEncode = (str) => {
      return encodeURIComponent(
        str.replace(/,\s*/g, "-").replace(/\s+/g, "-") // Replace commas and spaces with dashes
      );
    };

    // Encode parameters for the URL
    const locationParam = cleanAndEncode(locationInput);
    const classParam = encodeURIComponent(selectedClass.classid);
    const classNameParam = encodeURIComponent(selectedClass.classNameValue);
    const subjectParam = encodeURIComponent(selectedSubject);

    // Default coordinates for emergency if not available
    const latEmergency = 28.6909129;
    const lngEmergency = 77.1518306;

    // Construct the URL with parameters
    window.location.href = `/Search-result?role=${selectedRole}&SearchPlaceLat=${ClickLatitude || locationData.lat || latEmergency}&SearchPlaceLng=${ClickLongitude || locationData.lng || lngEmergency}&via-home-page&Location=${locationParam}&ClassId=${classParam}&ClassNameValue=${classNameParam}&Subject=${subjectParam}&lat=${locationData.lat || latEmergency}&lng=${locationData.lng || lngEmergency}`;
  };


  return (
    <section className="banner-area-two banner-bg-two" data-background={bannerImg01}>
      <div className="container-fluid center">
        <div className="row px-4 align-items-center">
          <div className="col-lg-6 center">
            <div className="banner__content-two hero-contact-left">
              <img
                src={bannerShape03}
                alt="shape"
                className="shape"
                data-aos="zoom-in-right"
                data-aos-delay={1200}
              />
              <h3 className="title tg-svg">
                What Are You {''}
                <span className="position-relative">
                  <span
                    className="svg-icon"
                    id="svg-2"
                    data-svg-icon="/icons/title_shape.svg"
                  />
                  looking
                </span>{" "}
                for
              </h3>
              <div className="col-12 my-3">
                <div className="row">
                 

                  <div class="form-check col-md-6 px-5 col-lg-6">
                    <input onChange={() => handleRoleChange('student')} class="form-check-input" type="radio" name="flexRadioDefault" value={'student'} id="flexRadioDefault1" checked={selectedRole === 'student'} />
                    <label class="form-check-label text-white" for="flexRadioDefault1">
                      Tutor
                    </label>
                  </div>
                  <div class="form-check col-md-6 px-5 col-lg-6">
                    <input onChange={() => handleRoleChange('tutor')} class="form-check-input" type="radio" value={'tutor'} name="flexRadioDefault" id="flexRadioDefault2" checked={selectedRole === 'tutor'} />
                    <label class="form-check-label text-white" for="flexRadioDefault2">
                      Student
                    </label>
                  </div>
                </div>
              </div>
              <div className="banner__search-form w-100">
                <form action="#" className="search-form">

                  <div className="search-form__container d-flex gap-2 justify-content-between">

                    <div className="row col-12 col-lg-12 col-md-12">



                      <div className="col-md-4 col-lg-4 mb-2">
                        <div className="position-relative">


                          <input
                            type="text"
                            name="Location"
                            value={locationInput}
                            placeholder="Location . . ."
                            onChange={(e) => handleLocationFetch(e.target.value)}
                            className="form-control py-3"
                          />

                          {locationSuggestions.length > 0 && (
                            <div
                              className="position-absolute top-100 start-0 mt-2 w-100 bg-white border border-secondary rounded shadow-lg overflow-auto"
                              style={{ maxHeight: "200px" }}
                            >
                              <ul className="list-unstyled mb-0">
                                {locationSuggestions.map((suggestion, index) => (
                                  <li
                                    key={index}
                                    className="p-2 hover:bg-light cursor-pointer"
                                    onClick={() => handleLocationSelect(suggestion.description)}
                                  >
                                    {suggestion.description}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                          }





                        </div>
                      </div>



                      <div className="col-md-4 col-lg-4 mb-2">
                        <select
                          className="search-form__input form-select py-3 select w-100 class-select"
                          onChange={handleClassChange}
                          value={selectedClass.classid}
                        >
                          <option value="" >Select Class...</option>
                          {concatenatedData.map((classItem) => (
                            <option key={classItem.id} value={classItem.id}>
                              {classItem.class}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-4 col-lg-4">
                        <select
                          className="search-form__input form-select py-3 select w-100 subject-select"
                          placeholder="Subject . . ."
                          onChange={handleSubjectChange}
                        >
                          <option value="" >Select Subject...</option>
                          {subjects.map((subject) => (
                            <option key={subject._id} value={subject._id}>
                              {subject.SubjectName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
                <button
                  type="button"
                  onClick={handlePassQuery}
                  style={{ width: "95%" }}
                  className="search-form__button mb-3 btn btn-primary container"
                >
                  Submit Your Request
                </button>
                <p className="search-form__info">
                  <a href="#!">You can access 7,900+ different courses</a>
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 center">



            <img src={backSvg} alt="img" />



          </div>
        </div>
      </div>
      <img src="assets/img/banner/banner_shape01.png" alt="shape" class="banner__two-shape alltuchtopdown" />
    </section>
  );
};

export default Slider;
