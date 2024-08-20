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

function Home(){
    return(
        <>
        <Slider />
        <Quickaction />
        <About />
        <Course />
        <Hiringtutor />
        <Whysrtutor />
        <Discountarea />
        <Workarea />
        <Ourmentor />
        <Testimonials />
        <Homeblog />
        <Joinus />
        </>
    )
}

export default Home;