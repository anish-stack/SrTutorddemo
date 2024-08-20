import React, { Component } from "react";

function Services() {
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
                                    <h3 className="title">Services</h3>
                                    <nav className="breadcrumb">
                                        <span property="itemListElement" typeof="ListItem">
                                            <a href="#">Home</a>
                                        </span>
                                        <span className="breadcrumb-separator">
                                            <i className="fas fa-angle-right" />
                                        </span>
                                        <span property="itemListElement" typeof="ListItem">
                                            Services
                                        </span>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* breadcrumb-area-end */}
                {/* about-area-two */}
                <section className="mt-5 pt-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-5 col-lg-6">
                                <div className="about__title-wrap pt-5 mt-5">
                                    <div className="section__title">
                                        <span className="sub-title">
                                            SR Tutor is India's leading education service provider portal.
                                        </span>
                                        <h2 className="title tg-svg">
                                            SR Tutors{" "}
                                            <span className="position-relative">
                                                <span
                                                    className="svg-icon"
                                                    id="about-svg"
                                                    data-svg-icon="assets/img/icons/title_shape.svg"
                                                />
                                                Services
                                            </span>
                                        </h2>
                                    </div>
                                    <p className="text-para">
                                        At SR tutorials we believe that our services are a “knowledge
                                        acquisition process”. We believe that communication is much
                                        superior to the art of talking. Providing you the right tutor is
                                        our foremost responsibility. An experienced tutor is well versed
                                        with the latest trends and pattern; therefore provide you the best
                                        innovative mode of learning. Our emphasis on quality education
                                        hence our tutors use the latest tool for teaching purpose. We
                                        provide a diverse set of services in different streams, these
                                        include:
                                    </p>
                                </div>
                            </div>
                            <div className="col-xl-7 col-lg-6 col-md-11">
                                <div className="about__images-wrap">
                                    <img
                                        src="assets/img/others/why-sr-services.webp"
                                        alt="img"
                                        className="rounded"
                                    />
                                    <div className="about__shapes">
                                        <img
                                            src="assets/img/objects/about_shape01.png"
                                            alt="img"
                                            className="about-shape-01 aos-init aos-animate"
                                            data-aos="fade-down-left"
                                        />
                                        <img
                                            src="assets/img/objects/about_shape02.png"
                                            alt="img"
                                            className="about-shape-02 aos-init aos-animate"
                                            data-aos="fade-up-right"
                                        />
                                        <img
                                            src="assets/img/objects/about_shape03.png"
                                            alt="img"
                                            className="about-shape-03 rotateme"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="mentors-area position-relative mt-5 pt-5 pb-5 bg-light">
                    <div className="container">
                        <div className="section__title-wrap mb-55">
                            <div className="row align-items-center gap-4 gap-md-0">
                                <div className="col-md-12">
                                    <div className="section__title text-center">
                                        {/* <span class="sub-title">How it Works</span> */}
                                        <h2 className="title tg-svg">
                                            We Provide{" "}
                                            <span className="position-relative">
                                                <span
                                                    className="svg-icon"
                                                    id="svg-8"
                                                    data-svg-icon="assets/img/icons/title_shape.svg"
                                                />
                                                Tutors
                                            </span>{" "}
                                            For All Subjects
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="services-inner">
                                    <div className="mentors__content">
                                        <div className="mentors__content-top">
                                            <h4 className="hiring-tuto-name">
                                                <a href="#">Pre-Nursery to 8th</a>
                                            </h4>
                                            <span className="desc">
                                                From pre-nursery to 8th all subjects, 9th &amp; 10th std:
                                                Math, Science, English, Social Studies, Hindi, Sanskrit,
                                                Computer, French language, German language, Spanish language,
                                                etc.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="services-inner">
                                    <div className="mentors__content">
                                        <div className="mentors__content-top">
                                            <h4 className="hiring-tuto-name">
                                                <a href="#">11th &amp; 12th Std</a>
                                            </h4>
                                            <span className="desc">
                                                Physics, Chemistry, Maths, Biology, Accounts, History,
                                                Economics, Business Studies, Computers, E.D., Sociology,
                                                Political Science, Psychology, Hindi, English, etc.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="services-inner">
                                    <div className="mentors__content">
                                        <div className="mentors__content-top">
                                            <h4 className="hiring-tuto-name">
                                                <a href="#">B.Com, M.Com(P/H)</a>
                                            </h4>
                                            <span className="desc">
                                                Accounts, Economics, Business Mathematics, Income Tax,
                                                Financial Accounting, Business Organisation, etc.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="services-inner">
                                    <div className="mentors__content">
                                        <div className="mentors__content-top">
                                            <h4 className="hiring-tuto-name">
                                                <a href="#">B.A./M.A.</a>
                                            </h4>
                                            <span className="desc">
                                                {" "}
                                                English, Economics, Sanskrit, Social Science,, etc.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="services-inner">
                                    <div className="mentors__content">
                                        <div className="mentors__content-top">
                                            <h4 className="hiring-tuto-name">
                                                <a href="#">B.B.A. / M.B.A. / B.C.A. / M.C.A.</a>
                                            </h4>
                                            <span className="desc">
                                                {" "}
                                                Management Accounting, Marketing Research, Statistics,
                                                Financial Accounting, Marketing Management, Data Base Systems,
                                                etc.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="services-inner">
                                    <div className="mentors__content">
                                        <div className="mentors__content-top">
                                            <h4 className="hiring-tuto-name">
                                                <a href="#">B.Sc, M.Sc(p/H) Medical, Engineering, B.Tech</a>
                                            </h4>
                                            <span className="desc">
                                                {" "}
                                                Physics, Chemistry, Maths, Computer Science, Zoology, Botany,
                                                Home Science, etc.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mentors__shapes">
                        <img src="assets/img/objects/mentors_shape01.png" alt="shape" />
                        <img src="assets/img/objects/mentors_shape02.png" alt="shape" />
                    </div>
                </section>
                {/* about-area-two-end */}
            </main>

        </>
    )
}

export default Services;