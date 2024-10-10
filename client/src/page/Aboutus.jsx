import React, { Component } from "react";

function Aboutus() {
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
                                    <h3 className="title">About Us</h3>
                                    <nav className="breadcrumb">
                                        <span property="itemListElement" typeof="ListItem">
                                            <a href="#">Home</a>
                                        </span>
                                        <span className="breadcrumb-separator">
                                            <i className="fas fa-angle-right" />
                                        </span>
                                        <span property="itemListElement" typeof="ListItem">
                                            About Us
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
                                <div className="about__title-wrap">
                                    <div className="section__title">
                                        <span className="sub-title">S.R. Tutors Bureau</span>
                                        <h2 className="title tg-svg">
                                            Let's Prepare{" "}
                                            <span className="position-relative">
                                                <span
                                                    className="svg-icon"
                                                    id="about-svg"
                                                    data-svg-icon="assets/img/icons/title_shape.svg"
                                                />
                                                Your Child
                                            </span>{" "}
                                            for a Praiseworthy Future
                                        </h2>
                                    </div>
                                    <p className="text-para">
                                        For those who are looking for promising tutoring services for
                                        their children, doesn't matter whether school level or college
                                        level, S.R. Tutors Bureau is the best option available to them. We
                                        introduce ourselves as a network of qualified and experienced
                                        teachers who know the best ways to shape the future of children.
                                    </p>
                                    <p className="text-para">
                                        Our teachers use the most effective teaching techniques to impart
                                        education. They take good care that the liability doesn't remain
                                        just to make the concepts clear but they also make sure that the
                                        taught concepts make a permanent place in the memory of the
                                        students. The comprehensible and interesting teaching techniques
                                        of our teacher have made us the best tutors bureau in Delhi NCR.
                                    </p>
                                    <p className="text-para">
                                        We have great experience in the education sector and are capable
                                        of identifying the precise needs of students at an individual
                                        level.
                                    </p>
                                    {/* <div class="tg-button-wrap">
                          <a href="#" class="btn tg-svg"><span class="text">Explore Courses</span> <span class="svg-icon" id="about-btn" data-svg-icon="assets/img/icons/btn-arrow.svg"></span></a>
                      </div> */}
                                </div>
                            </div>
                            <div className="col-xl-7 col-lg-6 col-md-11">
                                <div className="about__images-wrap">
                                    <div className="column">
                                        <img
                                            src="assets/img/others/srtutorial-about-us1.webp"
                                            alt="img"
                                        />
                                    </div>
                                    <div className="column">
                                        <img
                                            src="assets/img/others/srtutorial-about-us2.webp"
                                            alt="img"
                                        />
                                        <img src="assets/img/others/about_img05.jpg" alt="img" />
                                    </div>
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
                <section className="online-area tg-motion-effects">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-6 col-lg-6">
                                <div className="online__image-wrap aboutus-2-img">
                                    <div className="main-img">
                                        <img src="assets/img/others/what-make-us-better.webp" alt="img" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6">
                                <div className="online__content">
                                    <div className="section__title">
                                        <h3 className="title">
                                            What Makes Us a Great Choice as a Home Tutor Provider in Delhi?
                                        </h3>
                                    </div>
                                    <p className="text-para">
                                        Indubiously, with so many tuition bureaus in Delhi, the choice is
                                        quite tough to make. Selecting the best tuition bureau for your
                                        child is quite a challenging task. Let's see what makes us the
                                        best choice.
                                    </p>
                                    <div className="event-details-list">
                                        <ul className="list-wrap">
                                            <li className="text-para">
                                                <i className="fas fa-check-circle" /> We have years of
                                                experience in providing home tuition to students from 1st
                                                class to post graduation.
                                            </li>
                                            <li className="text-para">
                                                <i className="fas fa-check-circle" /> The teachers we have
                                                teamed up with are highly experienced and have in-depth
                                                knowledge of their subject.
                                            </li>
                                            <li className="text-para">
                                                <i className="fas fa-check-circle" /> Our tutors teach with
                                                exclusive notes and other study material that have been
                                                prepared after thorough research.
                                            </li>
                                            <li className="text-para">
                                                <i className="fas fa-check-circle" />
                                                We have developed highly effective teaching techniques that
                                                make even the most complex concepts interesting and
                                                comprehensible at the same time.
                                            </li>
                                        </ul>
                                    </div>
                                    <img
                                        src="assets/img/objects/online_04.png"
                                        alt="shape"
                                        className="right-shape position-absolute tg-motion-effects5"
                                        style={{ transform: "matrix(1, 0, 0, 1, -5.9863, -10.4228)" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-light mb-4 pt-5 pb-4">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <p className="text-para">
                                    With recent advances in technology it is now possible to get
                                    tutoring services online. Furthermore it is a cost efficient method
                                    which focuses on providing quality education to the facilitator.
                                    With advent of technology it is now possible to get the most
                                    advantageous tutors at a decent cost. With S.R. Tutor you get the
                                    following bunch of services within your comfort zone.
                                </p>
                                <strong>We know each and every area of Delhi ,</strong>
                                <div className="section__title mt-4 mb-4">
                                    <h3 className="title" style={{ fontSize: 25 }}>
                                        Why S.R Tutors
                                    </h3>
                                </div>
                                <div className="event-details-list">
                                    <ul className="list-wrap">
                                        <li className="text-para">
                                            <i className="fas fa-check-circle" /> Our services are highly
                                            flexible, making it possible to schedule your day accordingly.
                                            Tutors can now teach students in diverse time zones. You can
                                            perfectly match your work schedule accordingly
                                        </li>
                                        <li className="text-para">
                                            <i className="fas fa-check-circle" /> You get an opportunity to
                                            hire top quality tutors in any of the subjects like Mathematics,
                                            Science, Commerce, Computers etc.
                                        </li>
                                        <li className="text-para">
                                            <i className="fas fa-check-circle" /> We understand that a
                                            meaningful conversation is extremely essential. Our tutors are
                                            well versed with latest communication standards making this
                                            knowledge giving process more durable.
                                        </li>
                                        <li className="text-para">
                                            <i className="fas fa-check-circle" />
                                            With our result oriented services, your child’s performance will
                                            boost within a few days.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* about-area-two-end */}
                {/* fact-area */}
                <section
                    className="fact-area mb-5 mt-5"
                    data-background="assets/img/bg/fact_bg.jpg"
                    style={{ backgroundImage: 'url("assets/img/bg/fact_bg.jpg")' }}
                >
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-5 col-lg-7 col-md-9">
                                <div className="section__title text-center mb-50">
                                    <span className="sub-title">Worldwide Our Achievement</span>
                                    <h2 className="title tg-svg">
                                        Grow You{" "}
                                        <span className="position-relative">
                                            <span
                                                className="svg-icon"
                                                id="fact-title"
                                                data-svg-icon="assets/img/icons/title_shape.svg"
                                            />
                                            Skills
                                        </span>
                                        To Advance Your Career path
                                    </h2>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <div className="fact__item-two text-center">
                                    <div className="fact__icon-two">
                                        <i className="flaticon-webinar" />
                                    </div>
                                    <div className="fact__content-two">
                                        <h3 className="count">
                                            <span
                                                className="odometer odometer-auto-theme"
                                                data-count={325200}
                                            >
                                                <div className="odometer-inside">
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">3</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">2</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">5</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-formatting-mark">,</span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">2</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">0</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">0</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </span>
                                        </h3>
                                        <p>Students Enrolled</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <div className="fact__item-two text-center">
                                    <div className="fact__icon-two">
                                        <i className="flaticon-graduates" />
                                    </div>
                                    <div className="fact__content-two">
                                        <h3 className="count">
                                            <span
                                                className="odometer odometer-auto-theme"
                                                data-count={11399}
                                            >
                                                <div className="odometer-inside">
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">1</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">1</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-formatting-mark">,</span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">3</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">9</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">9</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </span>
                                        </h3>
                                        <p>Top Class Courses</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <div className="fact__item-two text-center">
                                    <div className="fact__icon-two">
                                        <i className="flaticon-countries" />
                                    </div>
                                    <div className="fact__content-two">
                                        <h3 className="count">
                                            <span className="odometer odometer-auto-theme" data-count={312}>
                                                <div className="odometer-inside">
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">3</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">1</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">2</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </span>
                                        </h3>
                                        <p>World Countries</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <div className="fact__item-two text-center">
                                    <div className="fact__icon-two">
                                        <i className="flaticon-trophy" />
                                    </div>
                                    <div className="fact__content-two">
                                        <h3 className="count">
                                            <span className="odometer odometer-auto-theme" data-count={590}>
                                                <div className="odometer-inside">
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">5</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">9</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="odometer-digit">
                                                        <span className="odometer-digit-spacer">8</span>
                                                        <span className="odometer-digit-inner">
                                                            <span className="odometer-ribbon">
                                                                <span className="odometer-ribbon-inner">
                                                                    <span className="odometer-value">0</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </span>
                                        </h3>
                                        <p>Award We Received</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        </>
    )
}

export default Aboutus;