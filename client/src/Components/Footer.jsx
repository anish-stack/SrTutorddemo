import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import toast from 'react-hot-toast'
function Footer() {
    const [email, setEmail] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.warn("⚠️ Please enter a valid email address.");
            return;
        }

        // Using toast.promise to handle the promise
        toast.promise(
            axios.post('http://localhost:7000/api/v1/admin/join-newsletter', { email }),
            {
                pending: "📧 Subscribing, please wait...",
                success: "🎉 Success! You've been subscribed to our newsletter.",
                 error: "❌ An error occurred. Please try again later."
            }
        )
            .then(response => {
                if (response.status === 201) {
                    setEmail('');  // Clear input after successful subscription
                } else {
                    toast.error("⚠️ Something went wrong. Please try again.");
                }
            })
            .catch(error => {
                toast.error(error.response?.data?.message || "❌ An unexpected error occurred.");
            });
    };


    return (
        <>
            <button className="scroll__top scroll-to-target" data-target="html">
                <i className="tg-flaticon-arrowhead-up"></i>
            </button>

            <footer className="footer-bg" style={{ backgroundColor: "#0b0505" }}>
                <div className="footer__top-wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="footer-widget">
                                    <div className="footer__about">
                                        <div className="footer__logo logo">
                                            <a href="#">
                                                <img src="assets/img/logo/footer-logo.png" alt="img" />
                                            </a>
                                        </div>
                                        <p>
                                            SR Tutorial is India's leading education service provider
                                            portal.
                                        </p>
                                        <ul className="list-wrap m-0 p-0">
                                            <li className="address">
                                                G-55, 1st Floor Near Walia Nursing Home Vikas Marg, Laxmi
                                                Nagar Delhi - 110092
                                            </li>
                                            <li className="number">sachinkumarsrtb@yahoo.in</li>
                                            <li className="number">+91 9811382915 | 9899247916</li>
                                            <li className="socials">
                                                <a href="#">
                                                    <i className="fab fa-facebook-f" />
                                                </a>
                                                <a href="#">
                                                    <i className="fab fa-twitter" />
                                                </a>
                                                <a href="#">
                                                    <i className="fab fa-whatsapp" />
                                                </a>
                                                <a href="#">
                                                    <i className="fab fa-linkedin-in" />
                                                </a>
                                                <a href="#">
                                                    <i className="fab fa-youtube" />
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="footer-widget widget_nav_menu">
                                    <h4 className="fw-title">Resources</h4>
                                    <ul className="list-wrap">
                                        <li>
                                            <a href="about-us.html">About</a>
                                        </li>
                                        <li>
                                            <a href="contact.html">Contact</a>
                                        </li>
                                        <li>
                                            <a href="contact.html">Help Center</a>
                                        </li>
                                        <li>
                                            <a href="#">Refund</a>
                                        </li>
                                        <li>
                                            <a href="#">Conditions</a>
                                        </li>
                                        <li>
                                            <a href="#">Privacy Policy</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="footer-widget widget_nav_menu">
                                    <h4 className="fw-title">Courses</h4>
                                    <ul className="list-wrap">
                                        <li>
                                            <a href="#">Life Coach</a>
                                        </li>
                                        <li>
                                            <a href="#">Business Coach</a>
                                        </li>
                                        <li>
                                            <a href="#">Health Coach</a>
                                        </li>
                                        <li>
                                            <a href="#">Development</a>
                                        </li>
                                        <li>
                                            <a href="#">Web Design</a>
                                        </li>
                                        <li>
                                            <a href="#">SEO Optimize</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="footer-widget">
                                    <h4 className="fw-title">Subscribe Newsletter</h4>
                                    <div className="footer__newsletter">
                                        <p className="desc">
                                            Known printer took galley type and scrambled it to make.
                                        </p>
                                        <form onSubmit={handleSubmit}>
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={handleChange}
                                            />
                                            <button type="submit">
                                                <i className="fas fa-arrow-right" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copyright__wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="copyright__text text-center">
                                    <p className="text-white">
                                        Copyright © 2024 S R Tutors. All rights reserved. | Manage by
                                        Hover Business Servicess LLP
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    )
}

export default Footer;
