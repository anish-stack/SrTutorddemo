import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClassSearch } from "../Slices/Class.slice";
import { setSelectedClass } from "../Slices/SelectedClass.slice";
import { checkLogin } from "../Slices/LoginSlice";
import SubjectRequestModel from "./SubjectRequestModel";
function Course() {
  const { isLogin } = useSelector((state) => state.login || {});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state) => state.Class);
  const [Class, setClass] = useState([]);
  const [tab, setTab] = useState("Class");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({
    Class: "",
    Subjects: "",
    id: "",
  });
  const itemsPerPage = 12;
  const [currentClassPage, setCurrentClassPage] = useState(1);
  const [currentSubjectPage, setCurrentSubjectPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  useEffect(() => {
    dispatch(ClassSearch());
    dispatch(checkLogin());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setClass(data);
    }
  }, [data]);

  const fetchAllSubjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/api/v1/admin/Get-All-Subject"
      );
      setSubjects(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllSubjects();
  }, []);

  const paginate = (array, page_number) => {
    return array.slice(
      (page_number - 1) * itemsPerPage,
      page_number * itemsPerPage
    );
  };

  const paginatedClass = useMemo(
    () => paginate(Class, currentClassPage),
    [Class, currentClassPage]
  );
  const paginatedSubjects = useMemo(
    () => paginate(subjects, currentSubjectPage),
    [subjects, currentSubjectPage]
  );

  const isClassNextDisabled = useMemo(
    () => currentClassPage * itemsPerPage >= Class.length,
    [currentClassPage, Class.length]
  );
  const isClassPrevDisabled = useMemo(
    () => currentClassPage === 1,
    [currentClassPage]
  );

  const isSubjectNextDisabled = useMemo(
    () => currentSubjectPage * itemsPerPage >= subjects.length,
    [currentSubjectPage, subjects.length]
  );
  const isSubjectPrevDisabled = useMemo(
    () => currentSubjectPage === 1,
    [currentSubjectPage]
  );

  const handleClassPageChange = (direction) => {
    setCurrentClassPage((prev) => prev + direction);
  };

  const handleSubjectPageChange = (direction) => {
    setCurrentSubjectPage((prev) => prev + direction);
  };
  const handleClassSelect = (item) => {
    const classRanges = ["I-V", "VI-X", "X-XII"];
    const Tab = tab;
    setSelectedSubject({
      Class: item.Class,
      isClass: Tab === "Class" ? true : false,
      id: item._id,
      Subjects: item.Subjects,
    });
    if (classRanges.includes(item.Class)) {
      console.log(item);
      dispatch(setSelectedClass(item)); // Dispatch action to store the selected class

      setTimeout(() => {
        navigate(
          `/Make-A-Request-For-Course?SourceType=Class&ClassName=${
            item.Class
          }&isLogin=${isLogin ? true : false}`
        );
      }, 400);
    } else {
      handleShow();
    }
  };

  const handleSubjectSelect = (item) => {
    const Tab = tab;
    setSelectedSubject({
      isSubject: Tab === "Subjects" ? true : false,
      Subjects: item,
    });

    handleShow();
  };

  if (loading) {
    return <Skeleton count={5} height={300} />;
  }

  if (error) {
    return <Skeleton count={5} height={300} />;
  }

  return (
    <>
      <section className="courses-area bg-white pt-5">
        <div className="container mt-5">
          <div className="section__title-wrap">
            <div className="row align-items-end">
              <div className="col-lg-6">
                <div className="section__title text-center text-lg-start">
                  <span className="sub-title">
                    {subjects.length - "12"}+ Unique Subjects Online Courses
                  </span>
                  <h2 className="title tg-svg">
                    Tutors{" "}
                    <span className="position-relative">
                      <span
                        className="svg-icon"
                        id="svg-4"
                        data-svg-icon="assets/img/icons/title_shape.svg"
                      ></span>
                      According
                    </span>{" "}
                    To Needs
                  </h2>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="courses__nav-active">
                  <button
                    className={`clasubject-btn ${
                      tab === "Class" ? "active" : ""
                    }`}
                    onClick={() => setTab("Class")}
                  >
                    Classes
                  </button>
                  <button
                    className={`clasubject-btn ${
                      tab === "Subjects" ? "active" : ""
                    }`}
                    onClick={() => setTab("Subjects")}
                  >
                    Subjects
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row courses-active">
            {tab === "Class" &&
              paginatedClass.map((item, index) => (
                <div
                  className="col-lg-4 col-sm-6 grid-item cat-one"
                  key={index}
                >
                  <div
                    onClick={() => handleClassSelect(item)}
                    className="categories__item-two tg-svg"
                  >
                    <a>
                      <div className="icon">
                        <i
                          className={
                            item.course_img || "flaticon-graphic-design"
                          }
                        ></i>
                      </div>
                      <div className="info">
                        <span className="name">{item.Class}</span>
                        <span className="courses">
                          {item.Subjects.length || "0"} Subjects
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            {tab === "Subjects" &&
              paginatedSubjects.map((subject, index) => (
                <div
                  className="col-lg-4 col-sm-6 grid-item cat-two"
                  key={index}
                >
                  <div onClick={()=>handleSubjectSelect(subject.SubjectName)} className="categories__item-two tg-svg">
                    <a >
                      <div className="info">
                        <span className="name">{subject.SubjectName}</span>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
          </div>
          <div className="pagination-wrapper w-100  mt-4">
            {tab === "Class" && (
              <div className="pagination-controls">
                <button
                  className="btn btn-primary"
                  onClick={() => handleClassPageChange(-1)}
                  disabled={isClassPrevDisabled}
                >
                  Previous
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleClassPageChange(1)}
                  disabled={isClassNextDisabled}
                >
                  Next
                </button>
              </div>
            )}
            {tab === "Subjects" && (
              <div className="pagination-controls">
                <button
                  className="btn btn-primary"
                  onClick={() => handleSubjectPageChange(-1)}
                  disabled={isSubjectPrevDisabled}
                >
                  Previous
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSubjectPageChange(1)}
                  disabled={isSubjectNextDisabled}
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <div className="courses__shapes">
            <div className="courses__shapes-item alltuchtopdown">
              <img src="assets/img/courses/course_shape01.png" alt="shape" />
            </div>
            <div className="courses__shapes-item alltuchtopdown">
              <img src="assets/img/courses/course_shape02.png" alt="shape" />
            </div>
          </div>
        </div>
        <SubjectRequestModel
          showModal={showModal}
          subject={selectedSubject}
          handleClose={handleClose}
        />
      </section>
    </>
  );
}

export default Course;
