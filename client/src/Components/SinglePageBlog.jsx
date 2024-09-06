import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Homeblog from "./Homeblog";

function SingleBlog() {
    const { id } = useParams();
    const [data, setData] = useState(null);

    const singleBlogFetch = async () => {
        try {
            const { data } = await axios.get(`https://www.sr.apnipaathshaala.in/api/v1/admin/Get-Blog/${id}`);
            setData(data.data);
        } catch (error) {
            console.error("Error fetching blog:", error);
        }
    };

    useEffect(() => {
        singleBlogFetch();
    }, [id]);

    return (
        <>
            <main className="main-area fix">
                {/* Breadcrumb area */}
                <section
                    className="breadcrumb-area breadcrumb-bg"
                    style={{ backgroundImage: 'url("/assets/img/bg/breadcrumb_bg.jpg")' }}
                >
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="breadcrumb-content">
                                    <h3 className="title"> {data ? data.Headline:""}</h3>
                                    <nav className="breadcrumb">
                                        <a href="/">Home</a>
                                        <span className="breadcrumb-separator">
                                            <i className="fas fa-angle-right" />
                                        </span>
                                        <span>Blog</span>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Blog details section */}
                {data && (
                    <section className="blog-details-area mt-5 pt-5">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-xl-12 col-lg-10">
                                    <div className="blog-details-wrap">
                                        {/* Blog Image */}
                                        <div className="blog-details-img">
                                            <img
                                                src={data.ImageOfBlog}
                                                alt={data.Headline}
                                                className="img-fluid rounded"
                                            />
                                        </div>

                                        {/* Blog Headline */}
                                        <h2 className="blog-title mt-4">{data.Headline}</h2>

                                        {/* Blog Subheading */}
                                        <h5 className="blog-subtitle mt-2 text-muted">{data.SubHeading}</h5>

                                        {/* Blog Metadata */}
                                        <div className="blog-meta mt-3 mb-5">
                                            <span>By: {data.CreatedBy}</span> | 
                                            <span> Date: {new Date(data.DateOfBlog).toLocaleDateString()}</span> | 
                                            <span> Tag: {data.Tag}</span>
                                        </div>

                                        {/* Blog Content */}
                                        <div className="blog-content">
                                            {data.BlogData.split("\n").map((paragraph, index) => (
                                                <p key={index} className="blog-paragraph">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
                <Homeblog/>
            </main>
        </>
    );
}

export default SingleBlog;
