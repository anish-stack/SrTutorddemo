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
                        <div className="marquee-LeftSideMainTitle text-center">Latest Student Requirement</div>
                        <div className="marquee-LeftSideSubTitle text-danger text-center">A Comprehensive Stack</div>
                    </div>

                </div>

                <div className="marquee">
                    <div className="marquee__group position-relative pb-2">
                        {comingData.map((item, index) => (
                            <a href={`/Student-Info?id=${item._id}`} className="marquee__card">
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
                <div className="marquee marquee--borders" style={{ '--duration': '100s' }}>
                    <div className="marquee marquee--reverse">
                        <div className="marquee__group position-relative pb-2 px-4">
                            {comingData.map((item, index) => (
                                <a href={`/Student-Info?id=${item._id}`} key={index} className="marquee__card">
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
                        <div aria-hidden="true" className="marquee__group">
                            {comingData.map((item, index) => (
                                <a href={`/Student-Info?id=${item._id}`} key={index} className="marquee__card">
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
                </div>
            </div>
        </div>
    );
};

export default Marquee;
