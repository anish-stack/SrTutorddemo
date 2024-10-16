import React, { useRef, useState } from 'react';
import './profilepage.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';



// import required modules
import { Autoplay } from 'swiper/modules';
const TeacherProfileModal = ({ isOpen, isClose, item, teacherClasses }) => {

    const reviews = [
        {
            name: "Ravi Sharma",
            class: "10th Grade",
            review: "A fantastic tutor! His teaching methods made complex topics easy to understand.",
            rating: 5,
            image: "https://i.ibb.co/kHdpqDC/studentsss.png"
        },
        {
            name: "Priya Gupta",
            class: "9th Grade",
            review: "Highly knowledgeable and patient. She takes the time to ensure every student understands the material.",
            rating: 5,
            image: "https://i.ibb.co/kHdpqDC/studentsss.png"
        },
        {
            name: "Arjun Mehta",
            class: "11th Grade",
            review: "The best teacher I've had! His enthusiasm for the subject makes learning enjoyable.",
            rating: 4,
            image: "https://i.ibb.co/kHdpqDC/studentsss.png"
        },
        {
            name: "Anjali Verma",
            class: "12th Grade",
            review: "An excellent tutor who provides valuable insights and support. Highly recommend!",
            rating: 5,
            image: "https://i.ibb.co/kHdpqDC/studentsss.png"
        },
        {
            name: "Suresh Reddy",
            class: "10th Grade",
            review: "Great mentor! His practical examples helped me grasp the subject better.",
            rating: 4,
            image: "https://i.ibb.co/kHdpqDC/studentsss.png"
        }
    ];
    

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
                                            <img src={item?.ProfilePic?.url || "https://i.ibb.co/8zn4h3K/no-picture-taking.png"} alt="Teacher" className=" image-cll rounded-circle" />
                                        </div>
                                        {/* Teacher Information */}
                                        <div className='information-section'>
                                            <div className='information'>
                                                <h6 className="mb-2">Name: <span>{item.FullName}</span></h6>
                                                <h6 className="mb-2">Gender: <span>{item.Gender}</span></h6>
                                                <h6 className="mb-2">Verified Teacher</h6>
                                                <h6 className="mb-2">Class: <span>{teacherClasses || "Not Disclosed"}</span></h6>
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
                                <div className='teacher-review py-3 bg-light'>
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
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeacherProfileModal;
