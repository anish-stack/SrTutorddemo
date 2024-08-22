import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { Autoplay } from 'swiper/modules';
function Workarea() {
    const [location, setLocation] = useState([]);
    const [slidesPerView, setSlidesPerView] = useState('4');
    const handleResize = () => {
        const windowWidth = window.innerWidth;

        // Adjust slidesPerView based on window width
        if (windowWidth < 400) {
            setSlidesPerView(1);
        } else if (windowWidth >= 400 && windowWidth < 768) {
            setSlidesPerView(2);
        } else {
            setSlidesPerView(4);
        }
    };

    useEffect(() => {

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://www.sr.apnipaathshaala.in/api/v1/admin/get-City');
                if (response.data.success) {
                    const locations = response.data.data.map(city => ({
                        location_img: city.CityImage.url,
                        location_name: city.CityName
                    }));
                    setLocation(locations);
                }
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <section className="section-pt-120 section-pb-90 bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section__title text-center mb-50">
                                <span className="sub-title">Our Network</span>
                                <h2 className="title">
                                    Home <span className="position-relative">Tutoring </span>In Your
                                    City
                                </h2>
                            </div>

                            <div className="row city_padding" align="center" style={{ paddingBottom: 10 }} >
                                <Swiper
                                    slidesPerView={slidesPerView}
                                    spaceBetween={30}
                                    autoplay={{
                                        delay: 700,
                                        disableOnInteraction: false,
                                    }}

                                    modules={[Autoplay]}
                                    className="mySwiper"
                                >

                                    {location.map((item, index) => (
                                        <SwiperSlide key={index}>

                                            <div className=" py-3" >
                                                <div className="city-box">
                                                    <Link to="#">
                                                        <div className="row citytxt-row">
                                                            <div className="col-md-4">
                                                                <img className=" img-fluid city-image" src={item.location_img} alt={item.location_name} />
                                                            </div>
                                                            <div className="col-md-8">
                                                                <h5 className="citytxt">{item.location_name}</h5>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}

                                </Swiper>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Workarea;
