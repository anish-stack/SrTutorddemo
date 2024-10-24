import axios from "axios";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';

function Testimonials() {
    const [testimonial, setTestimonials] = useState([]);

    const fetchTestimonial = async () => {
        try {
            const response = await axios.get('https://api.srtutorsbureau.com/api/v1/admin/Get-All-Active-Testimonials');
            setTestimonials(response.data.data);
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        }
    };

    useEffect(() => {
        fetchTestimonial();
    }, []);

    return (
        <section className="testimonial-area bg-light position-relative section-pt-120 section-pb-57">
            <div className="container">
                <div className="testimonial__wrapper">
                    <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-7 col-md-8">
                            <div className="section__title text-center">
                                <span className="sub-title">Our Testimonials</span>
                                <h2 className="title tg-svg">
                                    What’s Our{" "}
                                    <span className="position-relative">
                                        <span
                                            className="svg-icon"
                                            id="testimonial-svg"
                                            data-svg-icon="assets/img/icons/title_shape.svg"
                                        />
                                        Student & Teacher
                                    </span>{" "}
                                    Think For us
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-xl-9 col-lg-11">
                            <Swiper
                                spaceBetween={30}
                                slidesPerView={1}
                                loop={true}
                                autoplay={{
                                    delay: 700,
                                    disableOnInteraction: false,
                                }}

                                modules={[Autoplay]}
                               
                                className="testimonial-active"
                            >
                                {testimonial.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="testimonial__item">
                                            <div className="testimonial__quote">
                                                <img src="assets/img/icons/quote02.png" alt="icon" />
                                            </div>
                                            <div className="testimonial__rating">
                                                {Array.from({ length: item.Rating }).map((_, i) => (
                                                    <i className="fas fa-star"  />
                                                ))}

                                            </div>
                                            <p>{item.Text}</p>
                                            <div className="testimonial__avatar">
                                                <h4 className="name">{item.Name}</h4>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                           
                        </div>
                    </div>
                    <div className="testimonial__avatars">
                        <img
                            src="assets/img/others/testi01.png"
                            alt="img"
                            data-aos="zoom-in"
                            data-aos-delay={200}
                            className="aos-init aos-animate"
                        />
                        <img
                            src="assets/img/others/testi02.png"
                            alt="img"
                            data-aos="zoom-in"
                            data-aos-delay={300}
                            className="aos-init aos-animate"
                        />
                        <img
                            src="assets/img/others/testi03.png"
                            alt="img"
                            data-aos="zoom-in"
                            data-aos-delay={400}
                            className="aos-init aos-animate"
                        />
                        <img
                            src="assets/img/others/testi04.png"
                            alt="img"
                            data-aos="zoom-in"
                            data-aos-delay={500}
                            className="aos-init aos-animate"
                        />
                        <img
                            src="assets/img/others/testi05.png"
                            alt="img"
                            data-aos="zoom-in"
                            data-aos-delay={600}
                            className="aos-init aos-animate"
                        />
                        <img
                            src="assets/img/others/testi06.png"
                            alt="img"
                            data-aos="zoom-in"
                            data-aos-delay={700}
                            className="aos-init aos-animate"
                        />
                    </div>
                </div>
            </div>
            <div className="testimonial__shapes-two">
                <img
                    className="object"
                    src="assets/img/objects/blog_shape01.png"
                    width={97}
                    alt="Object"
                />
                <img
                    className="object rotateme"
                    src="assets/img/objects/blog_shape02.png"
                    width={66}
                    alt="Object"
                />
            </div>
        </section>
    );
}

export default Testimonials;
