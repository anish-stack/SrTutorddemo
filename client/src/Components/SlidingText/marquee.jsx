import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Marquee = ({ data }) => {
    const [comingData, setComingData] = useState([]);

    useEffect(() => {
        if (data) {
        
            setComingData(data);
        } else {
            setComingData([]);
        }
    }, [data]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="container-fluid mx-auto">
            <div className=" px-4">
                <div className="row">
                    <div className="col-md-12  text-center order-md-first">

                        <div className="marquee-LeftSideSubTitle mt-3 fs-3 text-danger text-center">Latest Student Recent Classes</div>
                    </div>

                </div>

                <div className="container">
                    <div className="row gap-4 d-flex mt-5 align-items-center justify-content-center position-relative pb-2">
                        <Swiper
                            slidesPerView={4}
                            spaceBetween={30}


                            className="mySwiper"
                        >
                            {comingData.reverse().slice(0,12).map((item, index) => (
                                <SwiperSlide className={`  marquee__card text-start gap-2 ${item.className || ''}`} key={item._id}>
                                    <a
                                        className='text-start'
                                        href={`/Student-Info?id=${item._id}`}

                                    >
                                        <h5>{item.studentName}</h5>
                                        <p className='text-start'><strong>Class:</strong> {item.className || "Not Disclosed"}</p>
                                        <p className='text-start subjects'><strong>Subjects:</strong> {item.subjects.join(', ')}</p>
                                        <p className='text-start'><strong>Sessions:</strong> {item.numberOfSessions}</p>
                                        <p className='text-start'><strong>Location:</strong> {item.locality.substring(0, 5) + 'xxxxx'}</p>
                                        <p className='text-start'><strong>Date:</strong> {formatDate(item.createdAt)}</p>
                                        <button className='text-start btn-contact'>Contact Now</button>
                                    </a>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        {comingData.length > 4 && (
                            <div className="container d-flex align-items-center justify-content-center text-center bottom-0 end-0 px-4">
                                <button className="view-all-btn">
                                    <a href="/View-all-Request" className="view-all-link">
                                        View All
                                    </a>
                                </button>
                            </div>
                        )}


                    </div>
                </div>

                <br />

            </div>
        </div>
    );
};

export default Marquee;
