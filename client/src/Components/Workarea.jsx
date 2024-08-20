import React from "react";
import { Link } from "react-router-dom";

function Workarea() {

    const location=[
        {
            location_img: "assets/img/others/delhi.webp",
            location_name: "DELHI",
        },
        {
            location_img: "assets/img/others/mumbai.webp",
            location_name: "MUMBAI",
        },
        {
            location_img: "assets/img/others/jaipur.webp",
            location_name: "JAIPUR",
        },
        {
            location_img: "assets/img/others/ahmdabad.webp",
            location_name: "AHMEDABAD",
        }

    ]

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

                            {
                                location.map((item, index)=>(

                                    <div className="col-md-3 py-3">
                                    <div className="city-box">
                                        <Link to="#">
                                            <div className="row citytxt-row">
                                                <div className="col-md-4">
                                                <img className="cityimg rounded-circle" src={item.location_img} alt="delhi" />
                                                  
                                                </div>
                                                <div className="col-md-8">
                                                    <h5 className="citytxt">{item.location_name}</h5>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                ))
                            }

                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Workarea;