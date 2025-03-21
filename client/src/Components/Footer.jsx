import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import toast from 'react-hot-toast'
function Footer() {
    const [email, setEmail] = useState('');
    const [allPages, setPages] = useState([])
    const handleChange = (e) => {
        setEmail(e.target.value);
    };
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.warn("⚠️ Please enter a valid email address.");
            return;
        }

        // Using toast.promise to handle the promise
        toast.promise(
            axios.post('https://api.srtutorsbureau.com/api/v1/admin/join-newsletter', { email }),
            {
                pending: "📧 Subscribing, please wait...",
                success: "🎉 Success! You've been subscribed to our newsletter.",

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
                console.log(error)
                toast.error(error.response?.data?.message || "❌ An unexpected error occurred.");
            });
    };

    const fetchPages = async () => {

        try {
            const response = await axios.get('https://api.srtutorsbureau.com/api/v1/seo/get-all-page');
            setPages(response.data);
        } catch (error) {
            console.error('Error fetching pages:', error);
        }
    };


    useEffect(() => {
        fetchPages()
    }, [])



    // Calculate total pages
    const totalPages = Math.ceil(allPages.length / itemsPerPage);

    // Get current page items
    const currentItems = allPages.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    return (
        <>


            <footer className="footer-bg" style={{ backgroundColor: "#0b0505" }}>
                <div className="footer__top-wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3 col-lg-3 col-sm-6">
                                <div className="footer-widget">
                                    <div className="footer__about">
                                        <div className="footer__logo logo">
                                            <a href="#">
                                                <img src="assets/img/logo/footer-logo.png" alt="img" />
                                            </a>
                                        </div>
                                        <p>
                                            S.R. Tutors is India's leading education service provider
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
                                                <a target="_blank" href="https://www.facebook.com/people/SR-Tutors-Bureau/61559623287439/">
                                                    <i className="fab fa-facebook-f" />
                                                </a>
                                                <a target="_blank" href="https://www.instagram.com/s.r.tutorsbureau/">
                                                    <i className="fab fa-instagram" />
                                                </a>
                                                <a target="_blank" href="https://x.com/i/flow/login?redirect_after_login=%2FSR_TUTORS">
                                                    <i className="fab fa-twitter" />
                                                </a>
                                                <a
                                                    target="_blank" href="https://wa.me/+9811382915" // Correct WhatsApp link format

                                                    rel="noopener noreferrer"  // Improves security by preventing the new page from accessing your window object
                                                    aria-label="Chat on WhatsApp"
                                                >
                                                    <i className="fab fa-whatsapp text-green-500 text-xl" /> {/* Optional: Add some Tailwind classes for styling */}
                                                </a>

                                                <a target="_blank" href="https://in.linkedin.com/in/sr-tutors-bureau-b92384116">
                                                    <i className="fab fa-linkedin-in" />
                                                </a>
                                                {/* <a  target="_blank" href="#">
                                                    <i className="fab fa-youtube" />
                                                </a> */}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-sm-6">
                                <div className="footer-widget widget_nav_menu">
                                    <h4 className="fw-title">Resources</h4>
                                    <ul className="list-wrap">
                                        <li>
                                            <Link to="/about-us">About</Link>
                                        </li>
                                        <li>
                                            <Link to={'/frequently-asked-questions'}>FAQ</Link>
                                        </li>
                                        <li>
                                            <Link to="/contact-us">Contact</Link>
                                        </li>
                                        {/* <li>
                                            <Link to="/Help">Help Center</Link>
                                        </li> */}
                                        <li>
                                            <Link to="/Refund-and-Cancellation-Policy">Refund and Cancellation Policy</Link>
                                        </li>
                                        <li>
                                            <Link to="/Term-&-Conditions">Term-&-Conditions</Link>
                                        </li>
                                        <li>
                                            <Link to="/Privacy">Privacy Policy</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-sm-6">
                                <div className="footer-widget widget_nav_menu">
                                    <h4 className="fw-title">Quick Links</h4>
                                    <ul className="list-wrap">
                                        {currentItems.length > 0 ? (
                                            currentItems.map((page, index) => (
                                                <li key={index}>
                                                    <Link to={`/sr-tutors/${page.seoFrendilyUrl}`}>
                                                        {page.MetaTitle}
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No pages available</li>
                                        )}
                                    </ul>
                                    {totalPages > 1 && (
                                        <nav aria-label="Page navigation" className="quik-pagination mt-3">
                                            <ul className="quik-pagination-list d-flex justify-content-center align-items-center gap-2">
                                                {/* Previous Button */}
                                                <li className={`quik-pagination-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                    <button
                                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                        className="quik-pagination-link"
                                                    >
                                                        ◀ Prev
                                                    </button>
                                                </li>

                                                {/* Page Number */}
                                                <li className="quik-pagination-item quik-pagination-info">
                                                    <span className="quik-pagination-link">
                                                        {currentPage} / {totalPages}
                                                    </span>
                                                </li>

                                                {/* Next Button */}
                                                <li className={`quik-pagination-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                                    <button
                                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                        className="quik-pagination-link"
                                                    >
                                                        Next ▶
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    )}


                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-sm-6">
                                <div className="footer-widget widget_nav_menu">
                                    <h4 className="fw-title">Courses</h4>
                                    <ul className="list-wrap">
                                        <li>
                                            <a href="#">I-V</a>
                                        </li>
                                        <li>
                                            <a href="#">X-VIII</a>
                                        </li>
                                        <li>
                                            <a href="#">JEE</a>
                                        </li>
                                        <li>
                                            <a href="#">NEET</a>
                                        </li>
                                        <li>
                                            <a href="#">BA</a>
                                        </li>
                                        <li>
                                            <a href="#">BCA</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-sm-6">
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
                                        Copyright © 2024 S.R. Tutors. All rights reserved. | Manage by
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
