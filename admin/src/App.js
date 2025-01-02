import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Auth/Login';
import './App.css'
import Dashboard from './Home/Dashboard'
import Teacher from './pages/Teacher/Teacher'

import ProfileOfTeacher from './pages/Teacher/ProfileOfTeacher'
import SearchResult from './pages/Teacher/SearchResult'
import AllClass from './pages/Class/AllClass'
import AddNewsClass from './pages/Class/AddNewsClass'
import EditClass from './pages/Class/EditClass'
import AllStudents from './pages/Students/AllStudents'
import AllBlogs from './pages/Blogs/AllBlogs'
import Forbidden from './pages/Error/Forbidden'
import CreateBlogs from './pages/Blogs/CreateBlogs'
import EditBlog from './pages/Blogs/EditBlog'
import AllTestinomial from './pages/Testinomials/AllTestinomial'
import CreateReview from './pages/Testinomials/CreateReview'
import AllBanners from './pages/Banners/AllBanners'
import TeacherRequest from './pages/TeacherRequest/TeacherRequest'
import SubjectTeacher from './pages/SubjectTeacher/SubjectTeacher'
import AllCitys from './pages/City/AllCitys'
import AllSubcription from './pages/Newsletters/AllSubcription'
import CreateTemplete from './pages/Newsletters/CreateTemplete'
import SendOfferMails from './pages/Newsletters/SendOfferMails'
import MessageTemplate from './pages/Newsletters/MessageTemplate'
import EditTemplate from './pages/Newsletters/EditTemplete'
import TeacherInfo from './pages/TeacherInfo/TeacherInfo'
import StudentInfo from './pages/StudentInfo/StudentInfo'
import ClassTeacherRequest from './pages/ClassTeacherRequest/ClassTeacherRequest'
import AllRequest from './pages/AllRequest/AllRequest'
import AllContact from './pages/Contact/AllContact'
import Profile from './pages/Profile/Profile'
import JdAllLeads from './pages/Justdial/JdAllLeads'
import AddRequest from './pages/AddRequest/AddRequest'
import TeacherWithLead from './pages/Teacher/TeacherWithLead'
import SearchTeacher from './pages/AdvancedSearch/SearchTeacher'
import CreatePages from './pages/Seo/CreatePages'
import ManagePages from './pages/Seo/ManagePages'
import RegisterTeacher from './pages/Teacher-Createion/RegisterTeacher'
import CompleteProfileDetails from './pages/Teacher-Createion/CompleteProfileDetails'
import ViewPage from './pages/Seo/ViewPage';
import EditPage from './pages/Seo/EditPage';
import RequestTeacherContact from './pages/Request/Request-Teacher';
function App() {

  const isAuthenticated = localStorage.getItem('Sr-token');

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      {/* <Layout /> */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='/Manage-Teacher' element={<Teacher />} />
          <Route path='/Manage-Teacher/:id' element={<ProfileOfTeacher />} />
          <Route path='/Search-result' element={<SearchResult />} />
          <Route path='/Manage-Class' element={<AllClass />} />
          <Route path='/Add-New-Class' element={<AddNewsClass />} />
          <Route path='/Edit-Class/:id' element={<EditClass />} />
          <Route path='/Search-teacher' element={<SearchTeacher />} />

          <Route path='/Manage-Student' element={<AllStudents />} />
          {/* <Route path='/Manage-Blogs' element={<AllBlogs />} /> */}
          {/* <Route path='/create-blog' element={<CreateBlogs />} /> */}
          {/* <Route path='/Edit-Blog/:id' element={<EditBlog />} /> */}
          <Route path='/Manage-Banners' element={<AllBanners />} />
          <Route path='/Manage-Reviews' element={<AllTestinomial />} />
          <Route path='/create-Review' element={<CreateReview />} />
          <Route path='/Manage-Teacher-Requests' element={<TeacherRequest />} />
          <Route path='/Subject-Teacher-Requests' element={<SubjectTeacher />} />
          <Route path='/Manage-Justdial' element={<JdAllLeads />} />

          <Route path='/Login-By-redirect' element={<Login />} />
          <Route path='/Manage-City' element={<AllCitys />} />
          <Route path='/all-subscribers' element={<AllSubcription />} />
          <Route path='/create-template' element={<CreateTemplete />} />
          <Route path='/all-template' element={<MessageTemplate />} />
          <Route path='/edit-template/:id' element={<EditTemplate />} />
          <Route path='/teacher-info/:id' element={<TeacherInfo />} />
          <Route path='/Student-info/:id' element={<StudentInfo />} />
          <Route path='/Manage-Class-teacher-request' element={<ClassTeacherRequest />} />
          <Route path='/send-offers' element={<SendOfferMails />} />
          <Route path='/Add-request' element={<AddRequest />} />
          <Route path='/Manage-Leads' element={<TeacherWithLead />} />
          <Route path='/all-teacher-requests-contact' element={<RequestTeacherContact />} />

          
          <Route path='/Create-Teacher-Profile' element={<RegisterTeacher />} />
          <Route path='/Complete-Profile/:id' element={<CompleteProfileDetails />} />

          <Route path='/Manage-All-Requests' element={<AllRequest />} />
          <Route path='/Manage-Contact' element={<AllContact />} />
          <Route path='/Manage-Profile' element={<Profile />} />

          <Route path='/create-pages' element={<CreatePages />} />
          <Route path='/manage-pages' element={<ManagePages />} />
          <Route path="/seo/view/:url" element={<ViewPage />} />
          <Route path="/seo/edit/:id/:url" element={<EditPage />} />


          <Route path='/forbidden' element={<Forbidden />} />

        </Route>
      </Routes>


    </Router>
  );
}

export default App;