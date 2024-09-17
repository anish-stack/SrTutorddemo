import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
function Homeblog() {

    const [blog, setBlog] = useState([])

    const fetchBlog = async () => {
        try {

            const response = await axios.get('https://sr.apnipaathshaala.in/api/v1/admin/get-Blogs');
            console.log(response.data.data)
            setBlog(response.data.data)
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchBlog()
    }, [])
    return (
        <>
            <section className="blog-area-two section-pt-120 section-pb-90">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-7 col-md-8">
                            <div className="section__title text-center mb-50">
                                <span className="sub-title">Always Smart To Hear News</span>
                                <h2 className="title tg-svg">
                                    Latest
                                    <span className="position-relative">
                                        <span
                                            className="svg-icon"
                                            id="svg-10"
                                            data-svg-icon="assets/img/icons/title_shape.svg"
                                        />
                                        News
                                    </span>
                                    &amp; Blog
                                </h2>
                                <p className="desc">
                                    Receive huge benefits with our lifetime Plumbing Receive huge
                                    benefits with our lifetime Plumbing email address will be shown
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {blog && blog.slice(0, 1).map((item, index) => (
                            <div key={item.id || index} className="col-lg-6">
                                <div className="blog__post-item-two shine__animate-item">
                                    <div className="blog__post-thumb-two">
                                        <Link to={`/blogs/${item._id}`} className="shine__animate-link">
                                            <img src={item.ImageOfBlog} alt={item.Headline} />
                                        </Link>
                                    </div>
                                    <div className="blog__post-content-two">
                                        <Link  className="cat">{item.Tag}</Link>
                                        <h4 className="title">
                                            <Link to={`/blogs/${item._id}`}>{item.Headline}</Link>
                                        </h4>
                                        <ul className="list-wrap blog__post-meta">
                                            <li>
                                                <i className="flaticon-account" /> By <Link >Admin</Link>
                                            </li>
                                            <li>
                                                <i className="flaticon-calendar-date" /> {new Date(item.DateOfBlog).toLocaleDateString()}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="col-lg-6">
                            {blog && blog.reverse().slice(0,2).map((item, index) => (
                                <div key={item.id || index} className="blog__post-item-three shine__animate-item">
                                    <div className="blog__post-thumb-three">
                                        <Link to={`/blogs/${item._id}`} className="shine__animate-link">
                                            <img src={item.ImageOfBlog} alt={item.Headline} />
                                        </Link>
                                    </div>
                                    <div className="blog__post-content-three">
                                        <a  className="cat">
                                            {item.Tag}
                                        </a>
                                        <h4 className="title">
                                            <Link to={`/blogs/${item._id}`}>
                                                {item.Headline}
                                            </Link>
                                        </h4>
                                        <ul className="list-wrap blog__post-meta">
                                            <li>
                                                <i className="flaticon-account" /> By <a href="#!">Admin</a>
                                            </li>
                                            <li>
                                                <i className="flaticon-calendar-date" /> {new Date(item.DateOfBlog).toLocaleDateString()}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <img className="object" src="assets/img/objects/blog_shape03.png" width={76} style={{ left: "8%", top: "32%" }} alt="Object" />
                <img className="object rotateme" src="assets/img/objects/blog_shape04.png" width={66} style={{ right: "9%", bottom: "23%" }} alt="Object" />
            </section>

        </>
    )
}

export default Homeblog;