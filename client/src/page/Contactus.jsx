import React, { Component } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import ReCAPTCHA from "react-google-recaptcha";

import toast from 'react-hot-toast'
import { Helmet } from "react-helmet-async";
const PROHIBITED_LINKS = [
    "facebook.com", "instagram.com", "twitter.com", "linkedin.com",
    "pinterest.com", "google.com", "youtube.com", "reddit.com", "tumblr.com",
    "twitch.tv", "vimeo.com", "spotify.com", "github.com", "gitlab.com",
    "stackoverflow.com", "hackerrank.com", "leetcode.com", "codewars.com",
    "kaggle.com", "xhamster.desi", "xvideos.com", "youporn.com", "pornhub.com",
    "redtube.com", "tube8.com", "xnxx.com", "lyase12a.com", "wearens.com",
    "webnextlabs.com", "lyase12b.com", "lyase12c.com", "clavius12c.com"
];

const PROHIBITED_WORDS = [
    "xxx", "xhamster", "sex", "blowjob", "fuck", "sperm", "condom",
    "suck", "vagina", "sexy", "abuse", "xnxx", "<script>", "script",
    "virus", "iframe"
];

const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const isValidPhone = (phone) => /^[0-9]{10,15}$/.test(phone);
const isValidName = (name) => name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
function Contactus() {
    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        Phone: '',
        Subject: '',
        Message: ''
    })
    const [recaptchaToken, setRecaptchaToken] = useState('')
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    function handleChangeCaptach(value) {
        setRecaptchaToken(value)
    }
    const containsProhibitedContent = (text) => {
        const lowerText = text.toLowerCase();

        // Log detected words
        const foundWords = PROHIBITED_WORDS.filter(word => lowerText.includes(word.toLowerCase()));
        const foundLinks = PROHIBITED_LINKS.filter(link => lowerText.includes(link.toLowerCase()));

        if (foundWords.length || foundLinks.length) {
            console.log("Blocked Words:", foundWords);
            console.log("Blocked Links:", foundLinks);
            return true;
        }

        return false;
    };

    const handleSubmit = async (e) => {
        if (!isValidName(formData.Name)) {
            alert("Invalid name: Must be at least 2 characters and contain only letters.");
            return;
        }
        if (!isValidEmail(formData.Email)) {
            alert("Invalid email format.");
            return;
        }
        if (!isValidPhone(formData.Phone)) {
            alert("Invalid phone number: Must contain only digits and be 10-15 characters long.");
            return;
        }
        if (containsProhibitedContent(formData.Message)) {
            alert("Your message contains prohibited words or links.");
            return;
        }

        e.preventDefault();
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/uni/create-contact', { ...formData, recaptchaToken });
            if (response.data.success) {
                toast.success("Your message has been sent successfully! We will get back to you shortly.");
                setFormData({ Name: '', Email: '', Phone: '', Subject: '', Message: '' });
            } else {
                toast.error("Failed to send the message.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error(error.response.data.message || error.response.data.error || error.message || "Please try again our server is busy ....");
        }
    };

    return (
        <>
            <Helmet>
                <title>Contact Us - SR Tutors Bureau</title>

                <meta
                    name="description"
                    content="Get in touch with SR Tutors Bureau to learn more about our tutoring services or to book a consultation. Our team is here to answer your questions and help you find the perfect tutor for your needs in Delhi NCR."
                />

                <meta
                    name="keywords"
                    content="Contact SR Tutors Bureau, tutoring services, home tutors, education, Delhi NCR, get in touch, book consultation, tutor inquiries, contact form"
                />

                <link rel="canonical" href="https://www.srtutorsbureau.com/contact-us" />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="SR Tutors Bureau" />
                <meta name="publisher" content="SR Tutors Bureau" />
            </Helmet>

            <main className="main-area fix">
                {/* breadcrumb-area */}
                <section
                    className="breadcrumb-area breadcrumb-bg"
                    data-background="assets/img/bg/breadcrumb_bg.jpg"
                    style={{ backgroundImage: 'url("assets/img/bg/breadcrumb_bg.jpg")' }}
                >
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="breadcrumb-content">
                                    <h3 className="title">Contact With Us</h3>
                                    <nav className="breadcrumb">
                                        <span property="itemListElement" typeof="ListItem">
                                            <a href="#">Home</a>
                                        </span>
                                        <span className="breadcrumb-separator">
                                            <i className="fas fa-angle-right" />
                                        </span>
                                        <span property="itemListElement" typeof="ListItem">
                                            Contact
                                        </span>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* breadcrumb-area-end */}
                {/* contact-area */}
                <section className="contact-area section-py-120">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5">
                                <div className="contact-info-wrap">
                                    <h2 className="title">Keep In Touch With Us</h2>
                                    <p>
                                        {/* Neque convallis cras semper auctor. Libero id faucibus
                                        getnvallis.id faucibus nisl tincidunt egetnvallis. */}
                                    </p>
                                    <ul className="list-wrap">
                                        <li>
                                            <div className="icon">
                                                <i className="flaticon-pin-1" />
                                            </div>
                                            <div className="content">
                                                <p>
                                                    G-55, 1st Floor Near Walia Nursing Home
                                                    <br />
                                                    Vikas Marg, Laxmi Nagar Delhi - 110092
                                                </p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <i className="flaticon-phone-call" />
                                            </div>
                                            <div className="content">
                                                <a href="tel:9811382915">+91 9811382915</a>
                                                <a href="tel:9899247916">+91 9899247916</a>
                                            </div>
                                        </li>

                                        <li>
                                            <div className="icon">
                                                <i className="flaticon-email" />
                                            </div>
                                            <div className="content">
                                                <a href="mailto:sachinkumarsrtb@yahoo.in">
                                                    sachinkumarsrtb@yahoo.in
                                                </a>
                                                <a href="mailto:info@srtutorsbureau.com">
                                                    info@srtutorsbureau.com
                                                </a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="contact-form-wrap">
                                    <h4 className="title">Get in Touch</h4>
                                    <form id="contact-form" onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-grp">
                                                    <input
                                                        name="Name"
                                                        type="text"
                                                        placeholder="Name *"
                                                        value={formData.Name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-grp">
                                                    <input
                                                        name="Email"
                                                        type="email"
                                                        placeholder="E-mail *"
                                                        value={formData.Email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-grp">
                                                    <input
                                                        name="Phone"
                                                        type="number"
                                                        placeholder="Phone *"
                                                        value={formData.Phone}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-grp">
                                                    <input
                                                        name="Subject"
                                                        type="text"
                                                        placeholder="Your Subject *"
                                                        value={formData.Subject}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-grp">
                                            <textarea
                                                name="Message"
                                                placeholder="Message"
                                                value={formData.Message}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <ReCAPTCHA
                                            sitekey="6LfZG_MqAAAAAKtYU1tPvoz_MoHCQDUYVwy4Bhf3"
                                            onChange={handleChangeCaptach}
                                        />
                                        <button type="submit" className="btn">
                                            Send Message
                                        </button>
                                    </form>
                                    <p className="ajax-response mb-0" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

        </>
    )


}

export default Contactus;