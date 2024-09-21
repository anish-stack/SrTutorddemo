import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { useEffect, useState, lazy, Suspense } from "react";
import StudentDetails from "./page/Student/StudentDetails";
import Cookies from 'js-cookie'
import HomeLoader from "./Components/HomeLoader";
import Privacypolicy from "./page/Policy/Privacypolicy";
import PlansAndTerms from "./page/Policy/PlansAndTerms";
import RefundPolicy from "./page/Policy/RefundPolicy";
// Lazy load components
const Home = lazy(() => import("./page/Home"));
const Aboutus = lazy(() => import("./page/Aboutus"));
const Services = lazy(() => import("./page/Services"));
const Contactus = lazy(() => import("./page/Contactus"));
const TeacherPost = lazy(() => import("./page/TeacherPost"));
const SearchResults = lazy(() => import("./page/SearchResults"));
const StudentProfile = lazy(() => import("./page/Student/StudentProfile"));
const PostRequirement = lazy(() => import("./page/Student/PostRequirement"));
const TeacherRegsitration = lazy(() => import("./page/Teacher/TeacherRegsitration"));
const TeacherDashboard = lazy(() => import("./page/Teacher/TeacherDashboard"));
const ThankYouPage = lazy(() => import("./page/Thankyou"));
const ProfilePage = lazy(() => import("./page/Teacher/ProfilePage"));
const TeacherProfileOtp = lazy(() => import("./page/Teacher/TeacherProfileOtp"));
const Browsetutors = lazy(() => import("./page/Tutors/Browsetutors"));
const SingleBlog = lazy(() => import("./Components/SinglePageBlog"));
const StudentRegistration = lazy(() => import("./page/Student/StudentRegister"));
const PageNotFound = lazy(() => import("./page/Error/PageNotFound"));
const TeacherProfilePage = lazy(() => import("./page/Tutors/TeacherProfilePage"));
const TeacherProfileModal = lazy(() => import("./page/Tutors/TeacherProfilePage"));
// import { WifiLoader } from "react-awesome-loaders";
function App() {
  const [header, showHeader] = useState(true);
  const [footer, setFooter] = useState(true);
  const location = useLocation();
  const [login, setLogin] = useState(false)
  const [studentLogin, setStudentLogin] = useState(false)



  useEffect(() => {
    const checkTokens = () => {
      const TeacherToken = Cookies.get('teacherToken');
      const StudentToken = Cookies.get('studentToken');

      // Set login states based on the presence of tokens
      setLogin(!!TeacherToken);
      setStudentLogin(!!StudentToken);
    };

    checkTokens();

    // Check tokens every 5 minutes
    const intervalId = setInterval(checkTokens, 300000); // 300000ms = 5 minutes

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);


  useEffect(() => {
    const studentRoutes = ['/Student-dashboard', '/Student-Post-For-Teacher', '/Student-register'];
    const isStudentRoute = studentRoutes.includes(location.pathname);

    if (isStudentRoute) {
      showHeader(false);
      setFooter(false);
    } else {
      showHeader(true);
      setFooter(true);
    }

    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 'smooth' for animated scroll, 'auto' for instant scroll
    });
  }, [location.pathname]);

  return (
    <>
      {header && <Header />}
      {/* <HomeLoader/>  */}
      <Suspense fallback={<div style={{height:'100vh'}} className="w-100 d-flex align-items-center justify-content-center"><HomeLoader/> </div>}>
   
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<Aboutus />} />
          <Route path="/blogs/:id" element={<SingleBlog />} />
          <Route path="/Student-register" element={<StudentRegistration />} />
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
          <Route path="/Student-Info" element={<StudentDetails student={studentLogin} teacher={login} />} />
          <Route path="/Privacy" element={<Privacypolicy />} />
          <Route path="/Term-&-Conditions" element={<PlansAndTerms />} />
          <Route path="/Refund-and-Cancellation-Policy" element={<RefundPolicy />} />



          <Route path="/*" element={<PageNotFound />} />
          <Route path="/teacher-Profile/Details/:id" element={<TeacherProfileModal />} />
          <Route path="/Complete-profile" element={<ProfilePage />} />
        </Routes>
      </Suspense>
      {footer && <Footer />}
    </>
  );
}

export default App;
