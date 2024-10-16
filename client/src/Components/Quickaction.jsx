import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FetchBanner } from "../Slices/BannerSlice";
import { Link } from "react-router-dom";

function Quickaction() {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.Banner);
    const [Banners, setBanners] = useState([]);

    useEffect(() => {
        dispatch(FetchBanner());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            setBanners(data);
        }
    }, [data]);

    if (loading) {
        return <Skeleton count={5} height={300} />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <section className={`quick__action-area ${Banners.length === 0 ? 'd-none' : ''} section-pt-100 section-pb-70`}>
            <div className="container">
                <div className="row justify-content-center">
                    {Banners.length > 0 && Banners.map((item, index) => (
                        <div className="col-lg-6 col-md-10 col-sm-11" key={index}>
                            <div
                                className="quick__action-item"
                                data-background={`${item.Banner.url}`}
                                style={{ backgroundImage: `url(${item.Banner.url})` }}
                            >
                                <div className="quick__action-content">
                                    <h4 className="title">
                                        {item.Para}
                                    </h4>
                                    <div className="tg-button-wrap">
                                        <Link to={`/${item.RedirectPageUrl}`} className="btn btn-primary white-btn">
                                            <span className="text">{item.ButtonText}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Quickaction;
