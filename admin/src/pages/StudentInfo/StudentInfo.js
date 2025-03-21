import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function StudentInfo() {
    const { id } = useParams()
    const [studentDetail, setStudentDetail] = useState(null)

    const fetchTeacherData = async () => {
        try {
            const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/student/get-single-student/${id}`)
            setStudentDetail(response.data.data)
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
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Student Profile Detail</h2>
                {studentDetail ? (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Name</h3>
                            <p className="text-gray-600">{studentDetail.StudentName}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Phone Number</h3>
                            <p className="text-gray-600">{studentDetail.PhoneNumber}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Alternative Phone Number</h3>
                            <p className="text-gray-600">{studentDetail.AltPhoneNumber}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Email</h3>
                            <p className="text-gray-600">{studentDetail.Email}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">Verified</h3>
                            <p className="text-gray-600">{studentDetail.isStudentVerified ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">Loading teacher details...</p>
                )}
            </div>
        </div>
  )
}

export default StudentInfo
