import React from "react";

function Joinus() {
    return (
        <>
            <section className="cta-area-three">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="cta__wrapper">
                                <div className="section__title white-title">
                                    <h2 className="title tg-svg">
                                        Join us &amp;
                                        <span className="position-relative">
                                            <span className="svg-icon" id="svg-9" />
                                            Spread
                                        </span>
                                        Experiences
                                    </h2>
                                </div>
                                <div className="cta__desc">
                                    <p>
                                    We’re excited to share updates, exclusive offers, and resources. As a senior tutor, your expertise guides students to success. Check out new tools designed to enhance your teaching!
                                    </p>
                                </div>
                                <div className="tg-button-wrap justify-content-center justify-content-md-end">
                                    <a href="/teacher-register" className="btn white-btn tg-svg">
                                        <span className="text">Become an Instructor</span>{" "}
                                        <span className="svg-icon" id="cta-btn" data-svg-icon="assets/img/icons/btn-arrow.svg" />
                                    </a>
                                </div>
                                <img className="object aos-init aos-animate" src="assets/img/objects/cta_shape01.svg" style={{ left: 25, top: "-35px" }} alt="Object" data-aos="fade-down" data-aos-delay={400} />
                                <img className="object aos-init aos-animate" src="assets/img/objects/cta_shape02.svg" style={{ right: "-20px", bottom: "-80px" }} alt="Object" data-aos="fade-up" data-aos-delay={400} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Joinus;