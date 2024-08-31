import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
function Ourmentor() {

    const [mentor, setMentors] = useState([]);

    const fetchteacher = async () => {
        try {
            const response = await axios.get('http://localhost:7000/api/v1/admin/Get-top-teacher');
            console.log(response.data)
            setMentors(response.data.data);
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        }
    };

    useEffect(() => {
        fetchteacher();
    }, []);

    // const mentor = [
    //     {
    //         mentors_img: "assets/img/mentors/mentors-dummy.webp",
    //         mentor_name: "Mentor 1",
    //         mentor_subject: "All Subject",
    //         student_icon: "flaticon-user-1",
    //         mentor_totalstudent: "1,135 Students",
    //         rating_icon: "fas fa-star",
    //         mentor_rating: "(5.0)"
    //     },
    //     {
    //         mentors_img: "assets/img/mentors/mentors-dummy.webp",
    //         mentor_name: "Mentor 2",
    //         mentor_subject: "All Subject",
    //         student_icon: "flaticon-user-1",
    //         mentor_totalstudent: "1,135 Students",
    //         rating_icon: "fas fa-star",
    //         mentor_rating: "(5.0)"
    //     },
    //     {
    //         mentors_img: "assets/img/mentors/mentors-dummy.webp",
    //         mentor_name: "Mentor 3",
    //         mentor_subject: "All Subject",
    //         student_icon: "flaticon-user-1",
    //         mentor_totalstudent: "1,135 Students",
    //         rating_icon: "fas fa-star",
    //         mentor_rating: "(5.0)"
    //     },
    //     {
    //         mentors_img: "assets/img/mentors/mentors-dummy.webp",
    //         mentor_name: "Mentor 4",
    //         mentor_subject: "All Subject",
    //         student_icon: "flaticon-user-1",
    //         mentor_totalstudent: "1,135 Students",
    //         rating_icon: "fas fa-star",
    //         mentor_rating: "(5.0)"
    //     }
    // ]

    return (
        <>
            <section className="mentors-area position-relative section-pt-120 section-pb-90">
                <div className="container">
                    <div className="section__title-wrap mb-55">
                        <div className="row align-items-center gap-4 gap-md-0">
                            <div className="col-md-8">
                                <div className="section__title text-center text-md-start">
                                    <span className="sub-title">Our Qualified People Matter</span>
                                    <h2 className="title tg-svg">
                                        <span className="position-relative">
                                            <span className="svg-icon" id="svg-8" data-svg-icon="assets/img/icons/title_shape.svg" /> Class </span> Mentors
                                    </h2>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="tg-button-wrap justify-content-center justify-content-md-end">
                                    <Link to="#" className="btn btn-border tg-svg">
                                        <span className="text">All Instructors</span>{" "}
                                        <span
                                            className="svg-icon"
                                            id="mentors-btn"
                                            data-svg-icon="assets/img/icons/btn-arrow.svg"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {
                            mentor && mentor.map((item, index) => (

                                <div key={index} className="col-xl-3 col-lg-4 col-md-5 col-sm-6">
                                    <div className="mentors__item">
                                        <div className="mentors__img">
                                            <Link to="#">
                                                <img
                                                    src={item.gender === 'Female' ? 'https://i.ibb.co/THt3vk2/girl.jpg' : 'https://i.ibb.co/fkvB73W/boy.jpg'}
                                                    alt="mentor"
                                                />
                                            </Link>
                                            <div className="mentors__social">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link to="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link to="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link to="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mentors__content">
                                            <div className="mentors__content-top">
                                                <h4 className="name">
                                                    <Link to="#">{item.TeacherName}</Link>
                                                </h4>
                                                <span className="designation">{item.mentor_subject}</span>
                                            </div>
                                            <div className="mentors__content-bottom">
                                                <ul className="list-wrap">
                                                    <li className="students">
                                                        <i className="flaticon-user-1" /> {item.totalStudent ? ` +` : `${Math.floor(Math.random() * 81) + 20} +`}
                                                    </li>

                                                    <li className="rating"><i className={"flaticon-user-1"} /><span className="rating-count">{item.mentor_rating}</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ))
                        }

                    </div>
                </div>
                <div className="mentors__shapes">
                    <img src="assets/img/objects/mentors_shape01.png" alt="shape" />
                    <img src="assets/img/objects/mentors_shape02.png" alt="shape" />
                </div>
            </section>

        </>
    )
}

export default Ourmentor;