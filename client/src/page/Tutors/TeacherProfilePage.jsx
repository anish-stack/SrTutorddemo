import React, { useRef, useState } from 'react';
import './profilepage.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';



// import required modules
import { Autoplay } from 'swiper/modules';
const TeacherProfileModal = ({ isOpen, isClose, item, teacherClasses }) => {

    console.log("click", item)


    return (
        <div className='w-100 mt-5'>
            {isOpen && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="teacherProfileModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
                        <div className="modal-content">
                            {/* Modal Header */}
                            <div className="modal-header">
                                <h5 className="modal-title" id="teacherProfileModalLabel">Teacher Profile</h5>
                                <button type="button" className="btn-close" onClick={isClose} aria-label="Close"></button>
                            </div>
                            {/* Modal Body */}
                            <div className="modal-body">
                                {/* Profile Header Section */}
                                <div className='profile-page-crumb py-3'>
                                    <div className='header_teacher d-block d-md-flex align-items-center'>
                                        {/* Teacher Image */}
                                        <div className='image-teacher me-4'>
                                            <img src={item?.ProfilePic?.url || item.Gender === "Female" ? 'https://i.ibb.co/N7syqWH/female.jpg':''} alt="Teacher" className=" image-cll object-cover rounded-circle" />
                                        </div>
                                        {/* Teacher Information */}
                                        <div className='information-section'>
                                            <div className='information'>
                                                <h6 className="mb-2">Name: <span>{item.FullName}</span></h6>
                                                <h6 className="mb-2">Gender: <span>{item.Gender}</span></h6>
                                                <h6 className="mb-2">Teaching Modes : {item.TeachingMode === "Both" ? 'Online , Offline':item.TeachingMode}</h6>
                                                <h6 className="mb-2">
                                                   
                                                    <span className="">
                                                        {item.AcademicInformation.length > 0 ? (
                                                            <ul className="list-unstyled d-flex gap-2 mb-0">
                                                                <h6> Class:</h6>
                                                                {item.AcademicInformation.map((info, index) => (
                                                                    <li key={index} className="small text-muted">
                                                                        {info.className}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <span className="text-secondary">Not Disclosed</span>
                                                        )}
                                                    </span>
                                                </h6>
                                                <p className="mb-2 fw-bold">Subjects: <span>{item.AcademicInformation.slice(0, 1).map((subject, index) => (
                                                    <span key={index}>{subject.SubjectNames + '' + '..'}  +</span>
                                                ))}
                                                    {item.AcademicInformation.reduce(
                                                        (acc, item) => acc + item.SubjectNames.length - 1,
                                                        0
                                                    )}{' '}
                                                    Subjects Taught
                                                </span></p>
                                                <h6 className="mb-2">Experience: <span>{item.TeachingExperience} Years</span></h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Bio Section */}
                                <div className='teacher-bio py-3'>
                                    <div className='container'>
                                        <h6 className='mb-2'>Bio Details</h6>
                                        <p className='text-muted small'>A brief paragraph about the teacher and his background in education, expertise, and teaching style.</p>
                                        <hr />
                                        <p className='mt-3 fs-6 fw-bold'>Some good qualities:</p>
                                        <ul className='list-unstyled'>
                                            <li className='d-flex gap-2'>🌟 <span className='small'>Strong in explaining concepts</span></li>
                                            <li className='d-flex gap-2'>🎯 <span className='small'>Focused on student success</span></li>
                                            <li className='d-flex gap-2'>📊 <span className='small'>Experienced with modern teaching techniques</span></li>
                                            <li className='d-flex gap-2'>👍 <span className='small'>Great with feedback and assessments</span></li>
                                            <li className='d-flex gap-2'>🌱 <span className='small'>Supports continuous learning and growth</span></li>
                                        </ul>
                                    </div>
                                </div>
                                {/* Review Section */}
                                {/* <div className='teacher-review py-3 bg-light'>
                                    <h6 className='mb-4 text-center'>Student Reviews</h6>
                                    <div className='row'>
                                        <Swiper
                                            slidesPerView={1}
                                            spaceBetween={30}
                                            pagination={{
                                                clickable: true,
                                            }}
                                            autoplay={{
                                                delay: 1000,
                                                disableOnInteraction: false,
                                            }}
                                            breakpoints={{
                                                640: {
                                                    slidesPerView: 2,
                                                    spaceBetween: 20,
                                                },
                                                768: {
                                                    slidesPerView: 2,
                                                    spaceBetween: 40,
                                                },
                                                1024: {
                                                    slidesPerView: 2,
                                                    spaceBetween: 50,
                                                },
                                            }}
                                            modules={[Autoplay]}

                                            className="mySwiper"
                                        >
                                            {reviews.map((item, index) => (
                                                <div key={index} className="col-md-6">
                                                    <SwiperSlide className="card">
                                                        <div className='text-center'>
                                                            <img src={item.image} className="card-img-top rounded-circle w-50 h-auto" alt="Student" />
                                                        </div>
                                                        <div className="card-body">
                                                            <h6 className=" text-center">{item.name}</h6>
                                                            <p className="card-text text-center small">Class: {item.class}</p>
                                                            <p className="card-text text-center small">Review: {item.review}</p>
                                                            <div className="star-rating text-center">
                                                                {'⭐'.repeat(item.rating)}
                                                            </div>
                                                        </div>

                                                    </SwiperSlide>
                                                </div>

                                            ))}

                                        </Swiper>
                                    </div>
                                </div> */}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeacherProfileModal;
