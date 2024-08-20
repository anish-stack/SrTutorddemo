import React from "react";

function About() {
  return (
    <>
      <section className="about-area tg-motion-effects pb-5">
        <div className="container mt-5">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="about__images">
                <img
                  className="small-img tg-motion-effects3"
                  src="assets/img/others/about_img02.png"
                  alt="img"
                />
                <img
                  className="big-img"
                  src="assets/img/others/about_srtutor.webp"
                  alt="img"
                />
                <div className="about__exp">
                  <svg
                    width={126}
                    height={108}
                    viewBox="0 0 126 108"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 10C0 4.47715 4.47715 0 10 0H110.996C116.321 0 120.713 4.17312 120.983 9.4914L125.429 96.7793C125.733 102.754 120.758 107.657 114.789 107.267L9.34719 100.369C4.08901 100.025 0 95.6593 0 90.3899V10Z"
                      fill="currentcolor"
                    />
                  </svg>
                  <h4 className="year">12 +</h4>
                  <p>Years of Experiences</p>
                </div>
                <img
                  src="assets/img/others/about_dots.svg"
                  alt="svg"
                  className="dots tg-motion-effects2"
                />
                <svg
                  className="circle tg-motion-effects1"
                  width={344}
                  height={344}
                  viewBox="0 0 344 344"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x={20}
                    y={20}
                    width={304}
                    height={304}
                    rx={152}
                    stroke="currentcolor"
                    strokeWidth={40}
                  />
                </svg>
              </div>
            </div>
            <div className="col-xl-6 col-lg-7">
              <div className="about__content">
                <div className="section__title about-title">
                  <span className="sub-title sb-title">About S R Tutors</span>
                  <h2 className="title tg-svg main-title">
                    SR Tutors Bureau - Let's{" "}
                    <span className="position-relative">
                      <span
                        className="svg-icon"
                        id="svg-3"
                        data-svg-icon="assets/img/icons/title_shape.svg"
                      />
                      Prepare Your Child
                    </span>{" "}
                    for a Praiseworthy Future
                  </h2>
                </div>
                <p className="desc">
                  For those who are looking for promising tutoring services for their
                  children, doesn't matter whether school level or college level, SR
                  Tutors Bureau is the best option available to them. We introduce
                  ourselves as a network of qualified and experienced teachers who
                  know the best ways to shape the future of children.
                </p>
                <div className="tg-button-wrap">
                  <a href="#" className="btn tg-svg">
                    <span className="text">Discover More</span>{" "}
                    <span
                      className="svg-icon"
                      id="about-btn"
                      data-svg-icon="assets/img/icons/btn-arrow.svg"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default About;