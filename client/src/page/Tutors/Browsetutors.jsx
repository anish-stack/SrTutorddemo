import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loader from '../../Components/Loader';
import { Link } from 'react-router-dom'
import './teachercard.css'
import TeacherCard from './TeacherCard';
const Browsetutors = () => {
    const searchQuery = new URLSearchParams(window.location.search);
    const searchQueryForlat = searchQuery.get('lat');
    const searchQueryForlng = searchQuery.get('lng');

    const [data, setData] = useState([]);
    const [Count, setCount] = useState('0');
    const [FilterOptions, setFilterOptions] = useState({
        verified: '',
        maxRange: '',
        minRange: '',
        Subject: '',
        Class: '',
        Gender: '',
        Experience: '',
        ModeOfTuition: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [Subjects, setSubjects] = useState([]);
    const [classIds, setClassIds] = useState([]);
    const [ClassNames, setClassNames] = useState([]);

    useEffect(() => {
        fetchAllSubjects();
        fetchTutors();
    }, [FilterOptions, currentPage]);

    useEffect(() => {
        if (classIds.length > 0) {
            FetchTeacherClassNames(classIds);
        }
    }, [classIds]);

    const fetchAllSubjects = async () => {
        try {
            const response = await axios.get("https://api.srtutorsbureau.com/api/v1/admin/Get-All-Subject");
            if (response.data.data) {
                setSubjects(response.data.data);
            }
        } catch (error) {
            console.log(error);
            setSubjects([]);
        }
    };
    const latEmergency = 28.6909129;
    const lngEmergency = 77.1518306;
    const fetchTutors = async () => {
        try {
            const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/student/BrowseTutorsNearMe?lat=${searchQueryForlat || latEmergency}&lng=${searchQueryForlng || lngEmergency}`, {
                params: { ...FilterOptions }
            });

            setCount(response.data.count);
            const tutorsData = response.data.results;
            console.log(tutorsData)
            setData(tutorsData);

            // Extract class IDs for fetching class names
            const ids = tutorsData.flatMap((item) => item.AcademicInformation);
            setClassIds(ids);

        } catch (error) {
            console.log(error);
            setData([]);
        }
    };

    const FetchTeacherClassNames = async (classIds) => {
        try {
            const { data } = await axios.get('https://api.srtutorsbureau.com/api/v1/admin/Get-Classes');
            const classData = data.data;
            const matchedClassNames = {};

            for (let index = 0; index < classIds.length; index++) {
                const element = classIds[index];

                // Find the main class by its _id
                const foundClass = classData.find(cls => cls._id === element.ClassId);

                if (foundClass) {
                    matchedClassNames[element.ClassId] = foundClass.Class;
                } else {
                    // If no main class match, search in InnerClasses
                    let innerClassMatch = null;

                    for (let cls of classData) {
                        innerClassMatch = cls.InnerClasses.find(inner => inner._id === element.ClassId);
                        if (innerClassMatch) {
                            matchedClassNames[element.ClassId] = innerClassMatch.InnerClass;
                            break;
                        }
                    }

                    if (!innerClassMatch) {
                        console.log("No match found for ClassId:", element.ClassId);
                    }
                }
            }

            setClassNames(matchedClassNames); // Update the state with all matched class names

        } catch (error) {
            console.log("Error fetching class names:", error);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'Gender' && type === 'checkbox') {
            setFilterOptions(prev => ({
                ...prev,
                [name]: checked ? value : '' // Reset gender if unchecked
            }));
        } else if (name === 'verified' && type === 'checkbox') {
            // Handle verified checkbox logic
            if (value === 'Both') {
                // If 'Both' is checked, set the filter to 'Both'
                setFilterOptions(prev => ({
                    ...prev,
                    verified: checked ? 'Both' : '' // Reset to empty if unchecked
                }));
            } else {
                // For true/false checkboxes
                setFilterOptions(prev => ({
                    ...prev,
                    verified: checked ? value : '' // Reset if unchecked
                }));
            }
        } else if (name === 'Subject' && type === 'checkbox') {
            // Handle multiple subjects selection
            setFilterOptions(prev => {
                const newSubjects = checked
                    ? [...(prev.Subject || []), value] // Add selected subject
                    : prev.Subject.filter(subject => subject !== value); // Remove unselected subject

                return {
                    ...prev,
                    Subject: newSubjects // Update the Subject filter with the new array
                };
            });
        } else if (type === 'range') {
            setFilterOptions(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setFilterOptions(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };


    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil(Subjects.length / itemsPerPage);
    const paginatedSubjects = Subjects.slice(startIndex, endIndex);
    const FilterSidebarContent = () => (
        <>
            <button
                onClick={() => setFilterOptions({
                    verified: '',
                    maxRange: '',
                    minRange: '',
                    Subject: '',
                    Class: '',
                    Gender: '',
                    Experience: '',
                    ModeOfTuition: ''
                })}
                className="btn btn-outline-secondary mb-3 w-100"
            >
                <i className="fa-solid fa-power-off"></i> Reset Filter
            </button>

            <form>
                {/* Gender Filter */}
                <h5>Filter By Gender</h5>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="male"
                        name="Gender"
                        value="Male"
                        checked={FilterOptions.Gender === 'Male'}
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="male">
                        Male
                    </label>
                </div>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="female"
                        name="Gender"
                        value="Female"
                        checked={FilterOptions.Gender === 'Female'}
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="female">
                        Female
                    </label>
                </div>

                <h5 className="mt-4">Verified Teacher</h5>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="verifiedTrue"
                        name="verified"
                        value="true" // Set as string
                        checked={FilterOptions.verified === 'true'}
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="verifiedTrue">
                        Verified Teacher
                    </label>
                </div>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="verifiedFalse"
                        name="verified"
                        value="false" // Set as string
                        checked={FilterOptions.verified === 'false'}
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="verifiedFalse">
                        Un-Verified Teacher
                    </label>
                </div>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="Both"
                        name="verified"
                        value="Both" // Value for the 'Both' option
                        checked={FilterOptions.verified === 'Both'}
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="Both">
                        Both
                    </label>
                </div>
                {/* Type of Class Flter */}
                <h5>Filter By Mode Of Class</h5>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="ModeOfTuition"
                        name="ModeOfTuition"
                        value="Online Class"
                        checked={FilterOptions.ModeOfTuition === 'Online Class'}
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="Online Class">
                    Online Class
                    </label>
                </div>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="Offline Class"
                        name="ModeOfTuition"
                        value="Offline Class"
                        checked={FilterOptions.ModeOfTuition === 'Offline Class'}
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="Offline Class">
                    Offline Class
                    </label>
                </div>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="All"
                        name="ModeOfTuition"
                        value="All"
                        checked={FilterOptions.ModeOfTuition === 'All'}
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="All">
                    All Modes
                    </label>
                </div>
                {/* Subjects Filter */}
                <h5 className="mt-4">Subjects</h5>
                {paginatedSubjects.map((item, index) => (
                    <div key={index} className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`subject-${index}`}
                            name="Subject"
                            value={item.SubjectName}
                            checked={FilterOptions.Subject && FilterOptions.Subject.includes(item.SubjectName)} // Check if the subject is in the selected array
                            onChange={handleFilterChange}
                        />
                        <label className="form-check-label" htmlFor={`subject-${index}`}>
                            {item.SubjectName}
                        </label>
                    </div>
                ))}


                {/* Pagination */}
                <div className="pagination mt-4">
                    <nav>
                        <ul className="pagination gap-2 d-flex align-items-center justify-content-between">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    type="button"
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    <i className="fa-solid fa-angles-left"></i>
                                </button>
                            </li>

                            <li
                                className={`page-item ${currentPage === totalPages ? 'disabled' : ''
                                    }`}
                            >
                                <button
                                    type="button"
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    <i className="fa-solid fa-angles-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Experience Range */}
                <h5 className="mt-4">Experience Range</h5>
                <input
                    type="range"
                    className="form-range"
                    id="experienceRange"
                    name="Experience"
                    min="0"
                    max="30"
                    value={FilterOptions.Experience || 0} // Default to 0 if undefined
                    onChange={handleFilterChange}
                />
                <div className="d-flex justify-content-between">
                    <span>Min: {FilterOptions.Experience || 0}</span> {/* Use Experience for Min */}
                    <span>Max: {30}</span> {/* Max is always 30 */}
                </div>

                {/* Mode of Tuition */}

            </form>
        </>
    );
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-3  d-lg-block">
                    {/* Offcanvas trigger button for smaller screens */}
                    <button
                        className="btn btn-primary d-lg-none mb-3"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#filterSidebar"
                        aria-controls="filterSidebar"
                    >
                        Filter Options
                    </button>

                    {/* Offcanvas Sidebar for small screens */}
                    <div
                        className="offcanvas offcanvas-start"
                        tabIndex="-1"
                        id="filterSidebar"
                        aria-labelledby="filterSidebarLabel"
                    >
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="filterSidebarLabel">
                                Filter Options
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="offcanvas"
                                aria-label="Close"

                            ></button>
                        </div>
                        <div className="offcanvas-body">
                            <FilterSidebarContent />
                        </div>
                    </div>

                    {/* Visible sidebar for larger screens */}
                    <div style={{ backgroundColor: '#FFFFFF' }} className="filter-container p-4 glass  rounded shadow-sm d-none d-lg-block">
                        <FilterSidebarContent />
                    </div>
                </div>

                {/* Display Tutors */}
                <div className="results-container mt-4 col-lg-9">
                    <div className="row">
                        {data.length > 0 ? (
                            data.map((teacher, index) => {
                                const genderImage =
                                    teacher.Gender === 'Male'
                                        ? 'https://i.ibb.co/MDMfwVV/Men-Teacher.png'
                                        : 'https://i.ibb.co/8YZgKMd/teacher.png';

                                // Extract class names for each teacher
                                const teacherClasses = teacher.AcademicInformation.map(info => ClassNames[info.ClassId] || "Unknown Class").join(", ");

                                return (
                                    <div key={index} className="col-lg-4 col-md-6 mb-4">
                                        <TeacherCard classes={teacherClasses} item={teacher} />
                                    </div>

                                );
                            })
                        ) : (
                            <div className="col-12">
                                <div className="alert alert-danger" role="alert">
                                    No Teacher Found For This Filter
                                </div>
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Browsetutors;
