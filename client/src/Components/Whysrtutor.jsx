import React from "react";

function Whysrtutor() {
    return (
        <>
            <section className="online-area tg-motion-effects">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-7 col-lg-7">
                            <div className="online__image-wrap">
                                <div className="main-img">
                                    <img src="assets/img/others/online_img.webp" alt="img" />
                                </div>
                                <div className="enrolled__students position-absolute">
                                    <p>
                                        <span>36K+</span> Enrolled Students
                                    </p>
                                    <ul className="list-wrap">
                                        <li>
                                            <img src="assets/img/others/student01.png" alt="img" />
                                        </li>
                                        <li>
                                            <img src="assets/img/others/student02.png" alt="img" />
                                        </li>
                                        <li>
                                            <img src="assets/img/others/student03.png" alt="img" />
                                        </li>
                                        <li>
                                            <img src="assets/img/others/student04.png" alt="img" />
                                        </li>
                                        <li>
                                            <img src="assets/img/others/student05.png" alt="img" />
                                        </li>
                                        <li>
                                            <img src="assets/img/others/student06.png" alt="img" />
                                        </li>
                                    </ul>
                                </div>
                                <img
                                    src="assets/img/icons/online_icons.png"
                                    alt="img"
                                    className="icons position-absolute"
                                />
                                <img
                                    src="assets/img/objects/online_01.png"
                                    alt="shape"
                                    className="left-shape position-absolute tg-motion-effects3"
                                    style={{ transform: "matrix(1, 0, 0, 1, 1.73861, -1.24171)" }}
                                />
                                <img
                                    src="assets/img/objects/online_02.png"
                                    alt="shape"
                                    className="top-shape position-absolute tg-motion-effects4"
                                    style={{ transform: "matrix(1, 0, 0, 1, -5.21584, 3.72513)" }}
                                />
                                <img
                                    src="assets/img/objects/online_03.svg"
                                    alt="shape"
                                    className="svg-shape position-absolute tg-motion-effects6"
                                    style={{ transform: "matrix(1, 0, 0, 1, 3.47723, -2.48342)" }}
                                />
                                <img
                                    src="assets/img/objects/categories_shape02.png"
                                    alt="shape"
                                    className="bottom-shape position-absolute tg-motion-effects3"
                                    style={{ transform: "matrix(1, 0, 0, 1, 1.73861, -1.24171)" }}
                                />
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-5">
                            <div className="online__content">
                                <div className="section__title">
                                    <span className="sub-title">Why Choose Us</span>
                                    <h2 className="title">
                                        Why Choose <br />
                                        <span className="position-relative">
                                            <span
                                                className="svg-icon"
                                                id="svg-8"
                                                data-svg-icon="assets/img/icons/title_shape.svg"
                                            />{" "}
                                            S.R. Tutors
                                        </span>{" "}
                                        Bureau?
                                    </h2>
                                </div>
                                <p>
                                    At S.R. Tutors Bureau, we understand that the journey to academic
                                    excellence requires more than just hard work it requires the right
                                    guidance, support, and resources. Here’s why choosing us can make a
                                    significant difference in your or your child's educational journey:
                                </p>
                                <div className="event-details-list">
                                    <ul className="list-wrap">
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Experienced and Qualified Tutors
                                        </li>
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Personalized Learning Plans
                                        </li>
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Comprehensive Subject Coverage
                                        </li>
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Flexible Scheduling
                                        </li>
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Proven Track Record of Success
                                        </li>
                                    </ul>
                                </div>
                                {/* <div className="tg-button-wrap">
                                    <a href="#!" className="btn tg-svg">
                                        <span className="text">See All Categories</span>{" "}
                                        <span
                                            className="svg-icon"
                                            id="online-btn"
                                            data-svg-icon="assets/img/icons/btn-arrow.svg"
                                        />
                                    </a>
                                </div> */}
                                <img
                                    src="assets/img/objects/online_04.png"
                                    alt="shape"
                                    className="right-shape position-absolute tg-motion-effects5"
                                    style={{ transform: "matrix(1, 0, 0, 1, 8.69307, -6.20854)" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Whysrtutor;