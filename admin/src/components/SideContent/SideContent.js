import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Teacher from '../../pages/Teacher/Teacher'
import ProfileOfTeacher from '../../pages/Teacher/ProfileOfTeacher'
import SearchResult from '../../pages/Teacher/SearchResult'
import AllClass from '../../pages/Class/AllClass'
import AddNewsClass from '../../pages/Class/AddNewsClass'
import EditClass from '../../pages/Class/EditClass'
import AllStudents from '../../pages/Students/AllStudents'
import AllBlogs from '../../pages/Blogs/AllBlogs'
import Login from '../../pages/Auth/Login'
import Forbidden from '../../pages/Error/Forbidden'
import CreateBlogs from '../../pages/Blogs/CreateBlogs'
import EditBlog from '../../pages/Blogs/EditBlog'
import AllTestinomial from '../../pages/Testinomials/AllTestinomial'
import CreateReview from '../../pages/Testinomials/CreateReview'
import AllBanners from '../../pages/Banners/AllBanners'
import TeacherRequest from '../../pages/TeacherRequest/TeacherRequest'
import SubjectTeacher from '../../pages/SubjectTeacher/SubjectTeacher'
import Dashboard from '../../Home/Dashboard'
const SideContent = () => {
  return (
    <Routes>
      <Route path='/Manage-Teacher' element={<Teacher />} />
      <Route path='/Manage-Teacher/:id' element={<ProfileOfTeacher />} />
      <Route path='/Search-result' element={<SearchResult />} />
      <Route path='/Manage-Class' element={<AllClass />} />
      <Route path='/Add-New-Class' element={<AddNewsClass />} />
      <Route path='/Edit-Class/:id' element={<EditClass />} />
      <Route path='/Manage-Student' element={<AllStudents />} />
      <Route path='/Manage-Blogs' element={<AllBlogs />} />
      <Route path='/create-blog' element={<CreateBlogs />} />
      <Route path='/Edit-Blog/:id' element={<EditBlog />} />
      <Route path='/Manage-Banners' element={<AllBanners />} />
      <Route path='/Manage-Reviews' element={<AllTestinomial />} />
      <Route path='/create-Review' element={<CreateReview />} />
      <Route path='/Manage-Teacher-Requests' element={<TeacherRequest />} />
      <Route path='/Subject-Teacher-Requests' element={<SubjectTeacher />} />
      <Route path='/' element={<Dashboard />} />



    

      <Route path='/Login-By-redirect' element={<Login />} />
      <Route path='/forbidden' element={<Forbidden />} />









    </Routes>
  )
}

export default SideContent