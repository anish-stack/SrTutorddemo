import React from "react";
import Slider from "../Components/Slider";
import About from "../Components/About";
import Quickaction from "../Components/Quickaction";
import Course from "../Components/Course";
import Hiringtutor from "../Components/Hiringtutor";
import Whysrtutor from "../Components/Whysrtutor";
import Discountarea from "../Components/Discountarea";
import Workarea from "../Components/Workarea";
import Ourmentor from "../Components/Ourmentor";
import Testimonials from "../Components/Testimonials";
import Homeblog from "../Components/Homeblog";
import Joinus from "../Components/Joinus";
import Marquee from "../Components/SlidingText/marquee";
import SlidingData from "../Components/SlidingText/SlidingData";
import { Helmet } from "react-helmet-async";

function Home({ data }) {
    return (
        <>
            <Helmet>
                <title>Sr Tutors Bureau</title>

                <meta
                    name="description"
                    content={`SR Tutors Bureau offers top-notch tutoring services for students of all levels in Delhi NCR. Our experienced and qualified teachers use effective techniques to ensure concepts are well understood and retained. Let us help shape your child's future with our personalized and comprehensive teaching methods.`}
                />

                <meta
                    name="keywords"
                    content={`tutoring services, home tutors, education, Delhi NCR, school tutoring, college tutoring, experienced teachers, effective teaching techniques, SR Tutors Bureau`}
                />

                <link rel="canonical" href="https://www.srtutorsbureau.com" />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="SR Tutors Bureau" />
                <meta name="publisher" content="SR Tutors Bureau" />
            </Helmet>

            <Slider areas={data} />
            <SlidingData />
            <Quickaction />
            {/* <About /> */}
            <Course />
            <Hiringtutor />
            <Whysrtutor />
            {/* <Discountarea /> */}
            <Workarea />
            <Ourmentor />
            <Testimonials />
            {/* <Homeblog /> */}
            <Joinus />
        </>
    )
}

export default Home;