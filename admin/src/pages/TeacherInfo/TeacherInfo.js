import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function TeacherInfo() {
    const { id } = useParams()
    const [teacherDetail, setTeacherDetail] = useState(null)

    const fetchTeacherData = async () => {
        try {
            const response = await axios.get(`https://sr.apnipaathshaala.in/api/v1/teacher/Teacher-details/${id}`)
            setTeacherDetail(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTeacherData()
    }, [id])

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Teacher Detail</h2>
                {teacherDetail ? (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Name</h3>
                            <p className="text-gray-600">{teacherDetail.TeacherName}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Phone Number</h3>
                            <p className="text-gray-600">{teacherDetail.PhoneNumber}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Email</h3>
                            <p className="text-gray-600">{teacherDetail.Email}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Gender</h3>
                            <p className="text-gray-600">{teacherDetail.gender}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Verified</h3>
                            <p className="text-gray-600">{teacherDetail.isTeacherVerified ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Role</h3>
                            <p className="text-gray-600">{teacherDetail.Role}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Top Teacher</h3>
                            <p className="text-gray-600">{teacherDetail.isTopTeacher ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Date of Birth</h3>
                            <p className="text-gray-600">{teacherDetail.DOB}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">Loading teacher details...</p>
                )}
            </div>
        </div>
    )
}

export default TeacherInfo
