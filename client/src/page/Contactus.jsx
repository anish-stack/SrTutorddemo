import React, { Component } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import toast from 'react-hot-toast'
function Contactus() {
    const [formData,setFormData] = useState({
        Name:'',
        Email:'',
        Phone:'',
        Subject:'',
        Message:''
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/uni/create-contact', formData);
            if (response.data.success) {
                toast.success("Your message has been sent successfully! We will get back to you shortly.");
                setFormData({ Name: '', Email: '', Phone: '', Subject: '', Message: '' }); // Reset form fields
            } else {
                toast.error("Failed to send the message.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("An error occurred. Please try again later.");
        }
    };

    return (
        <>
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