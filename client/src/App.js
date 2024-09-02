import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./page/Home";
import Aboutus from "./page/Aboutus";
import Services from "./page/Services";
import Contactus from "./page/Contactus";
import TeacherPost from "./page/TeacherPost";
import SearchResults from "./page/SearchResults";
import StudentProfile from "./page/Student/StudentProfile";
import PostRequirement from "./page/Student/PostRequirement";
import TeacherRegsitration from "./page/Teacher/TeacherRegsitration";
import TeacherDashboard from "./page/Teacher/TeacherDashboard";
import ThankYouPage from "./page/Thankyou";
import ProfilePage from "./page/Teacher/ProfilePage";
import TeacherProfileOtp from "./page/Teacher/TeacherProfileOtp";
import Browsetutors from "./page/Tutors/Browsetutors";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<Aboutus />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact-us" element={<Contactus />} />
        <Route path="/Make-A-Request-For-Course" element={<TeacherPost />} />
        <Route path="/Search-result" element={<SearchResults />} />
        <Route path="/Student-dashboard" element={<StudentProfile />} />
        <Route path="/Student-Post-For-Teacher" element={<PostRequirement />} />
        <Route path="/teacher-register" element={<TeacherRegsitration />} />
        <Route path="/Teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/thankYou" element={<ThankYouPage />} />
        <Route path="/Teacher-Profile-Verify" element={<TeacherProfileOtp />} />
        <Route path="/Browse-Tutors" element={<Browsetutors />} />

        <Route path="/Complete-profile" element={<ProfilePage />} />



      </Routes>
      <Footer />
    </>
  );
}

export default App;
