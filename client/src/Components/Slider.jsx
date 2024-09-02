import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClassSearch } from "../Slices/Class.slice";
import axios from "axios";
import bannerShape03 from "./banner/banner_shape03.png";

import bannerImg01 from "./banner/banner_img01.png";
import bannerImg02 from "./banner/banner_img02.png";
import bannerImg03 from "./banner/banner_img03.png";

const Slider = () => {
  const { data, loading, error } = useSelector((state) => state.Class);
  const dispatch = useDispatch();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [locationInput, setLocationInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [concatenatedData, setConcatenatedData] = useState([]);

  useEffect(() => {
    dispatch(ClassSearch());
  }, [dispatch]);

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
        `https://sr.apnipaathshaala.in/api/v1/admin/Get-Class-Subject/${classId}`
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
          "https://place-autocomplete1.p.rapidapi.com/autocomplete/json",
          {
            params: {
              input: input,
              radius: "500",
            },
            headers: {
              'x-rapidapi-key': '75ad2dad64msh17034f06cc47c06p18295bjsn18e367df005b',
              "x-rapidapi-host": "place-autocomplete1.p.rapidapi.com",
            },
          }
        );
        setLocationSuggestions(res.data.predictions || []);
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
    setSelectedClass(selectedClassId);
    fetchSubjects(selectedClassId);
  };

  const handleLocationSelect = (suggestion) => {
    setLocationInput(suggestion);
    setLocationSuggestions([]);
  };

  const handlePassQuery = () => {
    // Function to clean and encode the location input
    const cleanAndEncode = (str) => {
      return encodeURIComponent(
        str.replace(/,\s*/g, "-").replace(/\s+/g, "-")
      );
    };

    const locationParam = cleanAndEncode(locationInput);
    const classParam = encodeURIComponent(selectedClass);
    const subjectParam = encodeURIComponent(selectedSubject);

    window.location.href = `/Search-result?via-home-page&Location=${locationParam}&ClassId=${classParam}&Subject=${subjectParam}`;
  };

  return (
    <section className="banner-area-two banner-bg-two" data-background={bannerImg01}>
      <div className="container-fluid">
        <div className="row px-4 align-items-center">
          <div className="col-lg-6">
            <div className="banner__content-two hero-contact-left">
              <img
                src={bannerShape03}
                alt="shape"
                className="shape"
                data-aos="zoom-in-right"
                data-aos-delay={1200}
              />
              <h3 className="title tg-svg">
                Explore Your{" "}
                <span className="position-relative">
                  <span
                    className="svg-icon"
                    id="svg-2"
                    data-svg-icon="/icons/title_shape.svg"
                  />
                  Skills
                </span>{" "}
                With Varieties of Tutors
              </h3>
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
                          )}
                        </div>
                      </div>
                      <div className="col-md-4 col-lg-4 mb-2">
                        <select
                          className="search-form__input form-select py-3 select w-100 class-select"
                          onChange={handleClassChange}
                          value={selectedClass}
                        >
                          <option value="" disabled>Select Class...</option>
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
                          <option value="" disabled>Select Subject...</option>
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
          <div className="col-lg-6">
            <div className="banner__images-two">
           
              <img src={bannerShape03} alt="shape" className="shape" data-aos="zoom-in-down" data-aos-delay={800} />
              <div className="banner__images-grid">
                <div className="banner__images-col" data-aos="fade-up" data-aos-delay={200}>
                  <img src={bannerImg01} alt="img" />
                </div>
                <div className="banner__images-col">
                  <img src={bannerImg02} alt="img" data-aos="fade-left" data-aos-delay={300}/>
                  <img src={bannerImg03} alt="img" data-aos="fade-left" data-aos-delay={400} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <img src="assets/img/banner/banner_shape01.png" alt="shape" class="banner__two-shape alltuchtopdown" />
    </section>
  );
};

export default Slider;
