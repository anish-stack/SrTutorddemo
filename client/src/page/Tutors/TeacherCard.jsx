import React, { useEffect, useState } from 'react'
import './teachercard.css'
import svg from './online-education-icon.svg'
import { Link } from 'react-router-dom'
import TeacherProfileModal from './TeacherProfilePage'
import ContactTeacherModal from '../Student/ContactModel'
import ContactTeacherModalWithoutToken from '../Student/ContactWithoutToken'
const TeacherCard = ({ classes, item, tokenStudent, showBio }) => {

    const [isOpen, setIsOpen] = useState(false)
    const [ContactIsOpen, setContactIsOpen] = useState(false)

    const [teacher, setTeacher] = useState(null)
    const [selectedTeacher, SetSelectedTeacher] = useState(null)


    useEffect(() => {
        if (item) {
            setTeacher(item)
            console.log(item)
        } else {
            setTeacher(null)
        }
    })
    const handleOpen = (teacherItem) => {
        if (teacherItem) {

            setIsOpen(true)
            SetSelectedTeacher(teacherItem)
        } else {
            setIsOpen(false)
            SetSelectedTeacher(null)
        }
    }
    function handleContactOpen() {
        setContactIsOpen(!ContactIsOpen)
    }
    const handleClose = () => {
        setIsOpen(false)
        SetSelectedTeacher(null)
    }

    return (
        <>
            <div className='py-2 px-1 glass'>

                <div style={{ cursor: 'pointer' }} className="profile-section hs py-1 ">
                    <div className="book-img text-end">
                        <img src="https://vcards.infyom.com/assets/img/vcard24/book.png" alt="book" loading="lazy" />
                    </div>
                    <div className="card position-relative ">
                        <div className="card-img text-center">
                            <img
                                src={item?.ProfilePic?.url || "https://i.ibb.co/8zn4h3K/no-picture-taking.png"}
                                className="img-fluid shadow-sm p-2 border border-black border-3 rounded-circle"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="card-body p-0 text-sm-center  text-center">
                            <div className="profile-name w-100 d-flex align-item-center flex-column justify-content-center text-center">
                                <h4 className="text-black text-center mb-0 fw-bold">{item.FullName || "Amelia Jackson"}</h4>
                                <p className="fs-16 text-pink text-center fw-5">Gender:{item.Gender} | Qualification: {item.Qualification}</p>
                                {classes ? (
                                    <p className="fs-14 text-gray-200">
                                        🎓 Passionate educator with a focus on personalized learning, dedicated to student success and growth 📚✨

                                    </p>
                                ) :
                                    null
                                }
                            </div>

                        </div>
                        {item.srVerifiedTag ? (
                            <div className='teacher-tag'>
                                <span>S.R. Tutors Verified</span>
                            </div>
                        ) : null}

                    </div>
                </div>
                <div className="contact-section px-2 pb-20 ">

                    <div className="row">
                        {classes ? (<>
                            <div className="col-sm-12 mb-12 ">
                                <div className="contact-box d-flex justify-content-start gap-2 align-items-center">
                                    <div
                                        className="contact-icon d-flex justify-content-center align-items-center"
                                    >
                                        <img src="https://i.ibb.co/G26rfx7/online-learning-1.png" width={20} alt="" />
                                    </div>
                                    <div className="contact-desc">

                                        <a className="text-black fw-5">
                                            <span className="__cf_email__">
                                                {classes === "Unknown Class" ? "Not Disclose" : classes}
                                            </span>
                                        </a>


                                    </div>
                                </div>
                            </div>
                        </>) : null}

                        <div className="col-sm-12 mb-12">
                            <div className="contact-box d-flex justify-content-start gap-2  align-items-center">
                                <div
                                    className="contact-icon  justify-content-center align-items-center"
                                >
                                    <svg width="18"
                                        height="24" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 388.14"><path fill="#F4C100" d="m360 .02 21.53 1.12c10.07.51 17.88 9.18 17.35 19.23l-1.03 19.95c9.64 3.42 18.64 8.11 26.85 13.82l15.59-14.05c7.49-6.75 19.12-6.16 25.88 1.34l14.43 16c6.76 7.49 6.15 19.13-1.33 25.88l-16.73 15.11c4.1 8.45 7.18 17.49 9.1 26.93l22.97 1.19c10.07.51 17.88 9.16 17.36 19.24l-1.11 21.52c-.51 10.07-9.18 17.88-19.24 17.36l-23.2-1.2a113.69 113.69 0 0 1-11.88 25.56l15.37 17.05c6.75 7.48 6.15 19.13-1.34 25.88l-16 14.44c-7.49 6.75-19.13 6.13-25.88-1.34l-14.53-16.1c-8.53 4.66-17.71 8.26-27.34 10.63v-56.17c20.01-8.72 34.46-28.18 35.66-51.46 1.69-32.79-23.52-60.74-56.31-62.43-19.74-1.01-37.73 7.72-49.29 21.99h-66.17c3.42-10.11 8.2-19.55 14.12-28.14l-10.52-11.66c-6.75-7.48-6.15-19.13 1.33-25.88l16.02-14.44c7.47-6.74 19.12-6.14 25.87 1.34l11.38 12.6c9.64-4.74 20.03-8.15 30.91-10.02l.93-17.92C341.28 7.32 349.93-.49 360 .02zM188.23 257.05h-25.91c-.83 0-1.47.66-1.47 1.49v54.6c0 .83.64 1.49 1.47 1.49h25.88c.83 0 1.48-.66 1.48-1.49v-54.6c0-.82-.62-1.49-1.45-1.49zM19.91 141.15h93.21v-25.76c0-7.76 6.34-14.1 14.09-14.1h96.13c7.75 0 14.09 6.34 14.09 14.1v25.76h93.21c10.9 0 19.91 9.02 19.91 19.91v48.1c-22.51 15.43-45.73 28.58-69.67 39.31-24.07 10.78-48.89 19.14-74.57 24.91v-19.23c0-8.88-7.15-16.04-16.03-16.04h-30.04c-8.88 0-16.03 7.16-16.03 16.04v18.79C119.22 267.21 95 259 71.52 248.47 46.93 237.46 23.1 223.85 0 207.87v-46.81c0-10.91 9.01-19.91 19.91-19.91zm330.64 96.54v130.54a19.7 19.7 0 0 1-5.87 14.04c-3.63 3.61-8.6 5.87-14.04 5.87H19.91c-5.5 0-10.46-2.26-14.03-5.87C2.25 378.64 0 373.68 0 368.23V236.49c19.65 12.6 39.88 23.62 60.68 32.94 26.85 12.05 54.69 21.26 83.55 27.42v20.68c0 8.88 7.16 16.04 16.04 16.04h30.04c8.87 0 16.03-7.16 16.03-16.04v-20.3c29.41-6.16 58.01-15.52 85.42-27.82 20.14-9.02 39.73-19.63 58.79-31.72zm-212.56-117.2c-.95 0-1.79.85-1.79 1.8v18.31h78.13v-18.31c0-.96-.85-1.8-1.79-1.8h-74.55z" /></svg>
                                </div>
                                <div className="contact-desc">
                                    <a href="tel:+1 4078461474" className="text-black fw-5"
                                    >{item.TeachingExperience} Years Of Experience </a>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-12 mb-12">
                            <div className="contact-box d-flex justify-content-start gap-2  align-items-center">
                                <div
                                    className="contact-icon  justify-content-center align-items-center"
                                >
                                    <svg width="18"
                                        height="24" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 388.14"><path fill="#F4C100" d="m360 .02 21.53 1.12c10.07.51 17.88 9.18 17.35 19.23l-1.03 19.95c9.64 3.42 18.64 8.11 26.85 13.82l15.59-14.05c7.49-6.75 19.12-6.16 25.88 1.34l14.43 16c6.76 7.49 6.15 19.13-1.33 25.88l-16.73 15.11c4.1 8.45 7.18 17.49 9.1 26.93l22.97 1.19c10.07.51 17.88 9.16 17.36 19.24l-1.11 21.52c-.51 10.07-9.18 17.88-19.24 17.36l-23.2-1.2a113.69 113.69 0 0 1-11.88 25.56l15.37 17.05c6.75 7.48 6.15 19.13-1.34 25.88l-16 14.44c-7.49 6.75-19.13 6.13-25.88-1.34l-14.53-16.1c-8.53 4.66-17.71 8.26-27.34 10.63v-56.17c20.01-8.72 34.46-28.18 35.66-51.46 1.69-32.79-23.52-60.74-56.31-62.43-19.74-1.01-37.73 7.72-49.29 21.99h-66.17c3.42-10.11 8.2-19.55 14.12-28.14l-10.52-11.66c-6.75-7.48-6.15-19.13 1.33-25.88l16.02-14.44c7.47-6.74 19.12-6.14 25.87 1.34l11.38 12.6c9.64-4.74 20.03-8.15 30.91-10.02l.93-17.92C341.28 7.32 349.93-.49 360 .02zM188.23 257.05h-25.91c-.83 0-1.47.66-1.47 1.49v54.6c0 .83.64 1.49 1.47 1.49h25.88c.83 0 1.48-.66 1.48-1.49v-54.6c0-.82-.62-1.49-1.45-1.49zM19.91 141.15h93.21v-25.76c0-7.76 6.34-14.1 14.09-14.1h96.13c7.75 0 14.09 6.34 14.09 14.1v25.76h93.21c10.9 0 19.91 9.02 19.91 19.91v48.1c-22.51 15.43-45.73 28.58-69.67 39.31-24.07 10.78-48.89 19.14-74.57 24.91v-19.23c0-8.88-7.15-16.04-16.03-16.04h-30.04c-8.88 0-16.03 7.16-16.03 16.04v18.79C119.22 267.21 95 259 71.52 248.47 46.93 237.46 23.1 223.85 0 207.87v-46.81c0-10.91 9.01-19.91 19.91-19.91zm330.64 96.54v130.54a19.7 19.7 0 0 1-5.87 14.04c-3.63 3.61-8.6 5.87-14.04 5.87H19.91c-5.5 0-10.46-2.26-14.03-5.87C2.25 378.64 0 373.68 0 368.23V236.49c19.65 12.6 39.88 23.62 60.68 32.94 26.85 12.05 54.69 21.26 83.55 27.42v20.68c0 8.88 7.16 16.04 16.04 16.04h30.04c8.87 0 16.03-7.16 16.03-16.04v-20.3c29.41-6.16 58.01-15.52 85.42-27.82 20.14-9.02 39.73-19.63 58.79-31.72zm-212.56-117.2c-.95 0-1.79.85-1.79 1.8v18.31h78.13v-18.31c0-.96-.85-1.8-1.79-1.8h-74.55z" /></svg>
                                </div>
                                <div className="contact-desc">
                                    <a href="tel:+1 4078461474" className="text-black fw-5"
                                    >{item.TeachingMode}  </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 mb-sm-0 mb-20">
                            <div className="contact-box justify-content-start gap-2  d-flex align-items-center">
                                <div
                                    className="contact-icon d-flex justify-content-center align-items-center"
                                >
                                    <svg
                                        width="18"
                                        height="24"
                                        viewBox="0 0 30 26"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clip-path="url(#clip0_2111_1209)">
                                            <path
                                                d="M0.390531 26C0.264533 25.7615 0.0629374 25.5355 0.0251381 25.2844C-0.0378606 24.8324 0.0251381 24.3679 -6.1387e-05 23.916C-0.0126611 23.5017 0.163735 23.2883 0.592127 23.3008C0.718124 23.3008 0.844122 23.3008 0.970119 23.3008C10.3317 23.3008 19.6807 23.3008 29.0424 23.3134C29.3574 23.3134 29.6723 23.4389 29.9873 23.5017C29.9873 24.3303 29.9873 25.1714 29.9873 26C20.1343 26 10.2561 26 0.390531 26Z"
                                                fill="#F7941E"
                                            />
                                            <path
                                                d="M15.0315 10.6461C18.3957 10.6461 21.7598 10.6461 25.1365 10.6461C27.0391 10.6461 27.9715 11.5877 27.9841 13.4959C27.9841 13.521 27.9841 13.5336 27.9841 13.5587C28.2109 14.6635 27.6943 15.2912 26.7115 15.718C25.7161 16.1449 24.7585 16.2328 23.8892 15.492C23.4608 15.128 23.108 14.6886 22.7552 14.2492C22.289 13.6842 21.848 13.6717 21.3692 14.2241C21.0542 14.5881 20.7392 14.9522 20.3864 15.2661C19.391 16.1574 18.2949 16.2579 17.1735 15.5423C16.6695 15.2159 16.2159 14.8016 15.7749 14.3873C15.1701 13.8223 14.9055 13.8223 14.3133 14.4124C13.9731 14.7513 13.6204 15.0778 13.2298 15.354C11.9068 16.3081 10.7098 16.2453 9.47504 15.1907C9.28604 15.0275 9.10965 14.8518 8.94585 14.6635C8.10167 13.6968 7.92527 13.6968 7.08109 14.7011C5.93451 16.057 4.48554 16.3583 2.87277 15.6301C2.24278 15.3414 2.00339 14.902 2.06639 14.2492C2.10419 13.9353 2.14199 13.6215 2.10419 13.3201C1.88999 11.776 3.13737 10.621 4.75013 10.6335C8.16467 10.6712 11.5918 10.6461 15.0315 10.6461Z"
                                                fill="#F7941E"
                                            />
                                            <path
                                                d="M27.7321 21.606C19.2525 21.606 10.8107 21.606 2.33105 21.606C2.33105 20.2878 2.33105 18.9696 2.33105 17.6012C4.43521 18.3042 6.27478 17.8522 7.78675 16.2327C10.3067 18.6432 12.625 18.3168 15.0568 16.1574C18.0681 18.7687 20.2353 18.1661 22.2891 16.1198C22.982 16.8605 23.738 17.5384 24.7712 17.802C25.7918 18.0657 26.7494 17.8522 27.7573 17.4254C27.7321 18.8315 27.7321 20.1874 27.7321 21.606Z"
                                                fill="#F7941E"
                                            />
                                            <path
                                                d="M13.2297 9.46596C13.2297 8.22308 13.2171 7.00531 13.2423 5.77499C13.2549 5.37325 13.5447 5.13472 13.9605 5.13472C14.6535 5.12217 15.3465 5.12217 16.0269 5.13472C16.5056 5.13472 16.7828 5.41092 16.7828 5.87542C16.808 7.05553 16.7954 8.24819 16.7954 9.46596C15.5985 9.46596 14.4393 9.46596 13.2297 9.46596Z"
                                                fill="#F7941E"
                                            />
                                            <path
                                                d="M15.0188 0C15.3212 0.55239 15.674 1.18011 16.0142 1.82038C16.1654 2.10913 16.367 2.39788 16.4552 2.71173C16.6442 3.40222 16.3418 4.15548 15.8 4.45678C15.2582 4.75809 14.4266 4.67021 13.9856 4.26847C13.5194 3.82907 13.3682 2.98793 13.6958 2.37277C14.1242 1.54418 14.5904 0.740705 15.0188 0Z"
                                                fill="#F7941E"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2111_1209">
                                                <rect width="30" height="26" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="contact-desc">
                                    <p className="mb-0 text-black fw-5"> {new Date(item.DOB).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-12 mb-sm-0 mb-20">
                            <div className="contact-box justify-content-start gap-2  d-flex align-items-center">
                                <div
                                    className="contact-icon d-flex justify-content-center align-items-center"
                                >
                                    🏙️
                                </div>
                                <div className="contact-desc">
                                    <p className="mb-0 text-black fw-5"> {item.PermanentAddress.City || "Not Disclosed"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="contact-box justify-content-start gap-2  d-flex align-items-center">
                                <div
                                    className="contact-icon d-flex justify-content-center mt-2 align-items-center"
                                >
                                    <img src="https://i.ibb.co/ThM7dC0/text-books.png" width={20} alt="" />

                                </div>
                                <div className="contact-desc">
                                    <p className="mb-0 text-black fw-5"> {item.AcademicInformation?.slice(0, 1).map((subject, index) => (
                                        <span key={index}>{subject.SubjectNames + '' + '..'}  +</span>
                                    ))}
                                        {item?.AcademicInformation?.reduce(
                                            (acc, item) => acc + item.SubjectNames.length - 1,
                                            0
                                        )}{' '}
                                        Subjects Taught</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-12 d-flex gap-2 align-item-center prs w-100'>
                    <button style={{ whiteSpace: 'nowrap' }} onClick={() => handleOpen(item)} class="btn-shine w-75 buttonsss ">
                        <span>View More Details</span>
                    </button>
                    <button onClick={handleContactOpen} style={{ whiteSpace: 'nowrap' }} class="btn-shine w-75 buttonsss ">
                        <span>Contact Now</span>
                    </button>
                </div>
            </div>

            <TeacherProfileModal isOpen={isOpen} teacherClasses={classes} isClose={handleClose} item={selectedTeacher} />
            <ContactTeacherModal isClose={handleContactOpen} isOpen={ContactIsOpen} teachersData={item} />
        </>
    )
}

export default TeacherCard