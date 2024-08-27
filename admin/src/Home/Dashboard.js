import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GiLargePaintBrush } from "react-icons/gi";
import { faChartBar, faUser, faBlog, faCity, faSchool, faStar, faBell, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css'; // Optional for additional styling
import toast from 'react-hot-toast'
const Dashboard = () => {
    const [data, setData] = useState({
        bannerCount: 0,
        heroBannerCount: 0,
        blogCount: 0,
        ParticularTeacherRequest: 0,
        studentCount: 0,
        cityCount: 0,
        classCount: 0,
        Testimonials: 0,
        Subjects: 0,
        subjectTeacherRequestCount: 0
    });
    const token = localStorage.getItem('Sr-token');
    const handleLogout = (e) => {
        localStorage.clear()
        toast.success("Logout Successful 👍✔️")
      window.location.reload()

    };
    useEffect(() => {
        axios.get('https://www.sr.apnipaathshaala.in/api/v1/admin/Get-Dashboard')
            .then(response => {
                if (response.data) {
                    setData(response.data.data);
                }
            })
            .catch(error => {
                console.error("There was an error fetching the dashboard data!", error);
            });
    }, []);

    // Data for the Bar chart
    const barChartData = {
        labels: ['Banners', 'Hero Banners', 'Blogs', 'Teacher Requests', 'Students', 'Cities', 'Classes', 'Testimonials', 'Subjects', 'Teacher Requests'],
        datasets: [{
            label: 'Counts',
            data: [
                data.bannerCount,
                data.heroBannerCount,
                data.blogCount,
                data.ParticularTeacherRequest,
                data.studentCount,
                data.cityCount,
                data.classCount,
                data.Testimonials,
                data.Subjects,
                data.subjectTeacherRequestCount
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    // Data for the Line chart
    const lineChartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Subject Requests',
                data: [10, 20, 30, 40, 50, 60, 70], // Replace with actual subject request data
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Class Requests',
                data: [5, 15, 25, 35, 45, 55, 65], // Replace with actual class request data
                fill: false,
                borderColor: 'rgb(153, 102, 255)',
                tension: 0.1
            },
            {
                label: 'Teacher Requests',
                data: [8, 18, 28, 38, 48, 58, 68], // Replace with actual teacher request data
                fill: false,
                borderColor: 'rgb(255, 159, 64)',
                tension: 0.1
            }
        ]
    };
    const CleanCaches = async () => {
        try {
            const response = await axios.get('https://www.sr.apnipaathshaala.in/flush-all-Redis-Cached', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response)
         toast.success("All Caches Cleared From Website 👍✔️")
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    // Data for the Pie chart
    const pieChartData = {
        labels: ['Banners', 'Blogs', 'Cities', 'Classes', 'Testimonials'],
        datasets: [{
            label: 'Distribution',
            data: [
                data.bannerCount,
                data.blogCount,
                data.cityCount,
                data.classCount,
                data.Testimonials
            ],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 205, 86, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 205, 86, 1)'
            ],
            borderWidth: 1
        }]
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <GiLargePaintBrush onClick={CleanCaches} className="text-xl cursor-pointer" />

                    <FontAwesomeIcon icon={faBell} className="text-xl cursor-pointer" />
                    <FontAwesomeIcon icon={faUserCircle} className="text-xl cursor-pointer" />
                    <FontAwesomeIcon onClick={handleLogout} icon={faSignOutAlt} className="text-xl cursor-pointer" />
                </div>
            </header>

            {/* Main content */}
            <main className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <FontAwesomeIcon icon={faChartBar} className="text-3xl text-blue-500 mr-4" />
                            <h2 className="text-xl font-semibold">Total Banners</h2>
                        </div>
                        <p className="text-2xl font-bold">{data.bannerCount}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <FontAwesomeIcon icon={faUser} className="text-3xl text-green-500 mr-4" />
                            <h2 className="text-xl font-semibold">Total Students</h2>
                        </div>
                        <p className="text-2xl font-bold">{data.studentCount}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <FontAwesomeIcon icon={faBlog} className="text-3xl text-red-500 mr-4" />
                            <h2 className="text-xl font-semibold">Total Blogs</h2>
                        </div>
                        <p className="text-2xl font-bold">{data.blogCount}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <FontAwesomeIcon icon={faCity} className="text-3xl text-purple-500 mr-4" />
                            <h2 className="text-xl font-semibold">Total Cities</h2>
                        </div>
                        <p className="text-2xl font-bold">{data.cityCount}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <FontAwesomeIcon icon={faSchool} className="text-3xl text-yellow-500 mr-4" />
                            <h2 className="text-xl font-semibold">Total Classes</h2>
                        </div>
                        <p className="text-2xl font-bold">{data.classCount}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <FontAwesomeIcon icon={faStar} className="text-3xl text-orange-500 mr-4" />
                            <h2 className="text-xl font-semibold">Total Testimonials</h2>
                        </div>
                        <p className="text-2xl font-bold">{data.Testimonials}</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Dashboard Overview (Bar Chart)</h2>
                        <Bar data={barChartData} options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            return context.dataset.label + ': ' + context.raw;
                                        }
                                    }
                                }
                            }
                        }} />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Monthly Activity (Line Chart)</h2>
                        <Line data={lineChartData} options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            return context.dataset.label + ': ' + context.raw;
                                        }
                                    }
                                }
                            }
                        }} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Distribution (Pie Chart)</h2>
                        <div className="w-full h-64"> {/* Adjust the height as needed */}
                            <Pie
                                data={pieChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function (context) {
                                                    return context.label + ': ' + context.raw;
                                                }
                                            }
                                        }
                                    },
                                    layout: {
                                        padding: 20
                                    }
                                }}
                                width={300} // Set a specific width if needed
                                height={300} // Set a specific height if needed
                            />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
