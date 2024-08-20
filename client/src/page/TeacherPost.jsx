import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { StylesConfig } from 'react-select';
import { updateFormData, setCurrentStep } from '../Slices/TeacherRequest.slice';
import { useLocation } from 'react-router-dom';
import virtualClass from './virtual-class.png'
import tarvel from './earth.png'
import online from './online-learning.png'
import home from './home.png'

const TeacherPost = () => {
    const dispatch = useDispatch();

    const { DataForm, currentStep } = useSelector((state) => state.teacherProfile);
    const locations = new URLSearchParams(window.location.href);
    const query = locations.get('ClassName');
    const { ClassSelected } = useSelector((state) => state.ClassSelected);
    const className = ClassSelected?.Class || query;
    const Subjects = ClassSelected?.Subjects?.map((item) => ({
        value: item.SubjectName,
        label: item.SubjectName,
    })) || [];

    const allClasses = generateClassNamesFromRange(className);

    const ClasessOptions = [
        { value: 'Two Classes a Week', label: 'Two Classes a Week' },
        { value: 'Three Classes a Week', label: 'Three Classes a Week' },
        { value: 'Four Classes a Week', label: 'Four Classes a Week' },
        { value: 'Five Classes a Week', label: 'Five Classes a Week' },
        { value: 'Six Classes a Week', label: 'Six Classes a Week' },
    ];

    const BuddgetOptions = [
        { value: '3600 - 4400', label: 'Basic Rs.3600 - 4400' },
        { value: '2200 - 3500', label: 'Two Classes a Week Rs.2200 - 3500' },
        { value: '3500 - 4200', label: 'Three Classes a Week Rs.3500 - 4200' },
        { value: '4200 - 5000', label: 'Four Classes a Week Rs.4200 - 5000' },
        { value: '5000 - 7000', label: 'Five Classes a Week Rs.5000 - 7000' },
    ];

    function romanToInt(roman) {
        const romanMap = {
            'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
            'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
            'XI': 11, 'XII': 12
        };
        return romanMap[roman] || 0;
    }

    function generateClassNamesFromRange(className) {
        const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
        const [startClass, endClass] = className.split('-').map(s => s.trim());

        if (!romanNumerals.includes(startClass) || !romanNumerals.includes(endClass)) {
            throw new Error("Invalid class names.");
        }

        const startIndex = romanNumerals.indexOf(startClass);
        const endIndex = romanNumerals.indexOf(endClass);

        if (startIndex > endIndex) {
            throw new Error("Start class must be before or equal to end class.");
        }

        return romanNumerals.slice(startIndex, endIndex + 1);
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let updatedData = JSON.parse(sessionStorage.getItem('formData')) || {};

        if (name === 'selectedClasses') {
            const newSelectedClasses = checked
                ? [...(updatedData.selectedClasses || []), value]
                : (updatedData.selectedClasses || []).filter(item => item !== value);

            updatedData = { ...updatedData, selectedClasses: newSelectedClasses };
        } else {
            updatedData = { ...updatedData, [name]: type === 'checkbox' ? checked : value };
        }

        sessionStorage.setItem('formData', JSON.stringify(updatedData));
        dispatch(updateFormData(updatedData));
    };
    useEffect(() => {
        const clearFormData = () => {
            sessionStorage.removeItem('formData');
            dispatch(updateFormData({}));
        };

        window.addEventListener('pageshow', clearFormData);

        return () => {
            window.removeEventListener('pageshow', clearFormData);
        };

    }, [window.location.pathname]);
    const handleSelectChange = (selectedOptions, { name }) => {
        const values = Array.isArray(selectedOptions)
            ? selectedOptions.map(option => option.value)
            : selectedOptions ? [selectedOptions.value] : [];

        const updatedData = { ...JSON.parse(sessionStorage.getItem('formData')), [name]: values };
        sessionStorage.setItem('formData', JSON.stringify(updatedData));
        dispatch(updateFormData(updatedData));
    };
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                sessionStorage.removeItem('formData')
                dispatch(updateFormData({})); // Clear form data when tab becomes visible
            }
        };

        const handlePopState = () => {
            sessionStorage.removeItem('formData')
            dispatch(updateFormData({})); // Clear form data when navigating back
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('popstate', handlePopState);
        window.scrollTo({
            top: '0',
            behavior: 'smooth'
        }, [dispatch])
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('popstate', handlePopState);
        };

    }, [dispatch]);

    const options = [
        { value: 'Home Tuition at My Home', label: 'Home Tuition at My Home', imgSrc: home },
        { value: 'Willing to Travel to Teacher\'s Home', label: 'Willing to Travel to Teacher\'s Home', imgSrc: tarvel },
        { value: 'Online Class', label: 'Online Class', imgSrc: online },
    ];


    const [selectedsOption, setSelectedsOption] = useState(JSON.parse(sessionStorage.getItem('formData'))?.interestType || '');

    const handleImageClick = (value) => {
        setSelectedsOption(value);
        // Update sessionStorage
        const formData = JSON.parse(sessionStorage.getItem('formData')) || {};
        sessionStorage.setItem('formData', JSON.stringify({ ...formData, interestType: value }));
    };




    const handleBudgetChange = (selectedOption) => {
        const budgetRange = selectedOption ? selectedOption.value.split(' - ') : [];
        const updatedData = {
            ...JSON.parse(sessionStorage.getItem('formData')),
            minBudget: budgetRange[0] || '',
            maxBudget: budgetRange[1] || ''
        };
        sessionStorage.setItem('formData', JSON.stringify(updatedData));
        dispatch(updateFormData(updatedData));
    };

    const handleSubmit = (e) => {
        // Prevent default form submission
        e.preventDefault();

        // Ask for confirmation before submission
        const isConfirmed = window.confirm("Are you sure you want to submit the form?");
        if (isConfirmed) {
            console.log('Form Data:', JSON.parse(sessionStorage.getItem('formData')));
            // Proceed with the form submission or further processing
        } else {
            console.log('Form submission was canceled.');
            sessionStorage.removeItem('formData')
        }
    };

    // Show a confirmation dialog when the user tries to refresh or leave the page
    window.addEventListener('beforeunload', (event) => {
        const formData = JSON.parse(sessionStorage.getItem('formData'));
        if (formData) {
            event.preventDefault();
            event.returnValue = ''; // Chrome requires returnValue to be set
            sessionStorage.removeItem('formData')
        }
    });

    return (
        <div className="container-fluid mt-4 mx-4 py-4">
            <div className="heading-teacherPost"></div>
            <div className="container mx-auto me-auto">
                <div className="section__title-wrap">
                    <div className="row align-items-end">
                        <div className="col-lg-6">
                            <div className="section__title text-center text-lg-start">
                                <span className="sub-title">100+ Unique Subjects Teachers With Us</span>
                                <h2 className="title tg-svg">
                                    Tutors{" "}
                                    <span className="position-relative">
                                        <span className="svg-icon" id="svg-4" data-svg-icon="assets/img/icons/title_shape.svg"></span>
                                        According
                                    </span>{" "}
                                    To Needs
                                </h2>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="courses__nav-active">
                                <div className="stepper">
                                    <ul className="stepper-list">
                                        {[1, 2, 3, 4].map(step => (
                                            <li key={step} className={`step ${currentStep === step ? 'active' : ''}`}>
                                                <div className="step-number">{step}</div>
                                                <div className="step-label">Step {step}</div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${(currentStep - 1) * 33.33}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="steps">
                    {currentStep === 1 && (
                        <div className="card col-md-12 p-4 mb-4">

                            <h4>Select Classes</h4>
                            <div className="form-group d-flex justify-content-between align-items-center">
                                {allClasses.map((classItem, index) => (
                                    <label key={index} htmlFor={`class-${classItem}`} className="d-flex  gap-2 justify-content-center flex-column align-items-center">
                                        <div className="card form-check d-flex  justify-content-center align-items-center p-2 mb-4 shadow-sm" style={{ minWidth: '120px' }}>
                                            <img
                                                src={virtualClass}
                                                alt=""
                                                className="img-fluid"
                                                style={{ width: '40px', height: '40px', objectFit: 'cover', cursor: 'pointer' }}
                                            />
                                            <div className='d-flex  gap-2 justify-content-center align-items-center'>
                                                <input
                                                    className="form-check-input mt-2"
                                                    type="checkbox"
                                                    id={`class-${classItem}`}
                                                    name="selectedClasses"
                                                    value={classItem}
                                                    checked={Array.isArray(JSON.parse(sessionStorage.getItem('formData'))?.selectedClasses) && JSON.parse(sessionStorage.getItem('formData'))?.selectedClasses.includes(classItem)}
                                                    onChange={handleChange}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <span className="form-check-label mt-2" style={{ fontWeight: '800', fontSize: '0.9rem' }}>
                                                    {classItem}
                                                </span>
                                            </div>
                                        </div>
                                    </label>

                                ))}
                            </div>

                            <div className="form-group">
                                <label>Subjects</label>
                                <Select
                                    isMulti
                                    name="subjects"
                                    styles={{
                                        control: (baseStyles, state) => ({
                                            ...baseStyles,
                                            borderColor: state.isFocused ? 'red' : 'gray',
                                        }),
                                    }}
                                    options={Subjects}
                                    onChange={handleSelectChange}
                                    value={Subjects.filter(subject => JSON.parse(sessionStorage.getItem('formData'))?.subjects?.includes(subject.value))}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label className='fs-4 fw-bold'>Interested in</label>
                                <div className="d-flex flex-wrap gap-4">
                                    {options.map((option) => (
                                        <div
                                            key={option.value}
                                            className={`card form-check d-flex flex-column align-items-center p-2 mb-4 shadow-sm ${selectedsOption === option.value ? 'border border-danger scale-105' : ''
                                                }`}
                                            style={{ minWidth: '120px', cursor: 'pointer', transition: 'transform 0.3s, border-color 0.3s' }}
                                            onClick={() => handleImageClick(option.value)}
                                        >
                                            <img
                                                src={option.imgSrc}
                                                alt={option.label}
                                                className={`img-fluid ${selectedsOption === option.value ? 'scale-110' : ''}`}
                                                style={{ width: '40px', height: '40px', objectFit: 'cover', transition: 'transform 0.3s' }}
                                            />
                                            <span className="form-check-label mt-2" style={{ fontWeight: '800', fontSize: '0.9rem' }}>
                                                {option.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='d-flex gap-2  justify-content-center items-center'>
                                <button className="btn btn-secondary " onClick={() => dispatch(setCurrentStep(0))}>Back</button>
                                <button className="btn btn-primary" onClick={() => dispatch(setCurrentStep(2))}>Next</button>
                            </div>
                        </div>
                    )}
                    {currentStep === 2 && (
                        <div className="card p-4 mb-4">
                            <h4>Preferences</h4>
                            <div className="form-group mb-4">
                                <label>Class Frequency</label>
                                <Select
                                    name="classFrequency"
                                    options={ClasessOptions}
                                    onChange={handleSelectChange}
                                    value={{ value: JSON.parse(sessionStorage.getItem('formData'))?.classFrequency || '', label: JSON.parse(sessionStorage.getItem('formData'))?.classFrequency || 'Select Frequency' }}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label>Teacher Gender Preference</label>
                                <Select
                                    name="teacherGenderPreference"
                                    options={[
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' },
                                        { value: 'Any', label: 'Any' }
                                    ]}
                                    onChange={handleSelectChange}
                                    value={{ value: JSON.parse(sessionStorage.getItem('formData'))?.teacherGenderPreference || '', label: JSON.parse(sessionStorage.getItem('formData'))?.teacherGenderPreference || 'Select Gender Preference' }}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label>Preferred Location</label>
                                <Select
                                    name="preferredLocation"
                                    options={[
                                        { value: 'Urban', label: 'Urban' },
                                        { value: 'Suburban', label: 'Suburban' },
                                        { value: 'Rural', label: 'Rural' }
                                    ]}
                                    onChange={handleSelectChange}
                                    value={{ value: JSON.parse(sessionStorage.getItem('formData'))?.preferredLocation || '', label: JSON.parse(sessionStorage.getItem('formData'))?.preferredLocation || 'Select Location' }}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label>Budget Range</label>
                                <Select
                                    name="budgetRange"
                                    options={BuddgetOptions}
                                    onChange={handleBudgetChange}
                                    value={{ value: `${JSON.parse(sessionStorage.getItem('formData'))?.minBudget} - ${JSON.parse(sessionStorage.getItem('formData'))?.maxBudget}`, label: `Rs.${JSON.parse(sessionStorage.getItem('formData'))?.minBudget || ''} - Rs.${JSON.parse(sessionStorage.getItem('formData'))?.maxBudget || ''}` }}
                                />
                                {JSON.parse(sessionStorage.getItem('formData'))?.budgetRange && (
                                    <div>
                                        <input
                                            type="number"
                                            name="minBudget"
                                            placeholder="Minimum Budget"
                                            value={JSON.parse(sessionStorage.getItem('formData'))?.minBudget || ''}
                                            onChange={handleChange}
                                        />
                                        <input
                                            type="number"
                                            name="maxBudget"
                                            placeholder="Maximum Budget"
                                            value={JSON.parse(sessionStorage.getItem('formData'))?.maxBudget || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='d-flex gap-2  justify-content-center items-center'>

                                <button className="btn btn-secondary " onClick={() => dispatch(setCurrentStep(1))}>Back</button>

                                <button className="btn btn-primary" onClick={() => dispatch(setCurrentStep(3))}>Next</button>
                            </div>
                        </div>
                    )}
                    {currentStep === 3 && (
                        <div className="card p-4 mb-4">

                            <div className="form-group">
                                <h4>Review and Submit</h4>
                                <textarea
                                    className="form-control"

                                    readOnly
                                    value={JSON.stringify(JSON.parse(sessionStorage.getItem('formData')), null, 2)}
                                />
                            </div>

                            <div className='d-flex gap-2 mt-2  justify-content-center items-center'>
                                <button className="btn btn-secondary " onClick={() => dispatch(setCurrentStep(2))}>Back</button>
                                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherPost;
