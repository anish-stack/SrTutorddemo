import React, { Component } from "react";
import { Link } from "react-router-dom";

function Contactus() {
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
                                                <i className="flaticon-phone-call" />
                                            </div>
                                            <div className="content">
                                                <a href="tel:01122442314">011 22442314</a>
                                                <a href="tel:01122459766">011 22459766</a>
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
                                    <form id="contact-form" action="assets/mail.php" method="POST">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-grp">
                                                    <input
                                                        name="name"
                                                        type="text"
                                                        placeholder="Name *"
                                                        required=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-grp">
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        placeholder="E-mail *"
                                                        required=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-grp">
                                                    <input
                                                        name="phone"
                                                        type="number"
                                                        placeholder="Phone *"
                                                        required=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-grp">
                                                    <input
                                                        name="subject"
                                                        type="text"
                                                        placeholder="Your Subject *"
                                                        required=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-grp">
                                            <textarea
                                                name="message"
                                                placeholder="Message"
                                                required=""
                                                defaultValue={""}
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