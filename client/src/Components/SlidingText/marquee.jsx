import React, { useEffect, useState } from 'react';
import { a } from 'react-router-dom'
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
            <div className="MarqueeContainer px-4">
                <div className="row">
                    <div className="col-md-12 pb-1 text-center order-md-first">
                        {/* <div className="marquee-LeftSideMainTitle text-center">Latest Student Recent Classes</div> */}
                        <div className="marquee-LeftSideSubTitle fs-3 text-danger text-center">Latest Student Recent Classes</div>
                    </div>

                </div>

                <div className="container-fluid">
                    <div className="row mx-auto gap-4 d-flex justify-content-center position-relative pb-2">
                        {comingData.reverse().slice(0,4).map((item, index) => (
                            <a href={`/Student-Info?id=${item._id}`} className="col-lg-6 col-md-3 marquee__card gap-2">
                                <h5>{item.studentName}</h5>
                                <p><strong>Class:</strong> {item.className}</p>

                                <p><strong>Subjects:</strong> {item.subjects.join(', ')}</p>
                                <p><strong>Sessions:</strong> {item.numberOfSessions}</p>
                                <p><strong>Location:</strong> {item.locality.substring(0,5) +'xxxxx'}</p>
                                <p><strong>Date:</strong> {formatDate(item.createdAt)}</p>
                                <button className='btn-contact'>Contact Now</button>
                            </a>

                        ))}
                    </div>
                </div>
                <br />
              
            </div>
        </div>
    );
};

export default Marquee;
