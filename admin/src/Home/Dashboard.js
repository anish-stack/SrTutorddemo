import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaArrowUpLong } from 'react-icons/fa6';
import { FaSignOutAlt, FaBlog } from "react-icons/fa";
import { PiPaintBrushHouseholdFill } from "react-icons/pi";
import { Link } from 'react-router-dom'
import { faChartBar, faBell, faBook, faHeart, faPersonChalkboard, faUser, faCity, faBlog, faSchool, faStar, faComment, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import toast from 'react-hot-toast';

// Reusable Card component
const Card = ({ icon, title, value, difference, iconColor, href }) => (
    <Link to={href} className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
            <FontAwesomeIcon icon={icon} className={`text-3xl ${iconColor} mr-4`} />
            <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {difference !== undefined && (
            <p className={`text-sm ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <FaArrowUpLong className={`inline ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                {difference >= 0 ? `+${difference}` : difference}
            </p>
        )}
    </Link>
);

const Dashboard = () => {
    const [data, setData] = useState({});
    const token = localStorage.getItem('Sr-token');
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('https://api.srtutorsbureau.com/api/v1/admin/Get-Dashboard');

                // Check if the response is successful
                console.log(response.data.data)
                if (response.data.success) {
                    setData(response.data.data); // Set the fetched data
                }
            } catch (error) {
                // Handle specific error codes
                if (error?.response?.status === 401) {
                    toast.error("Your Session Has Expired. Please Login.");
                    setTimeout(() => {
                        window.location.href = "/login"; // Redirect to login after 700ms
                    }, 700);
                } else {
                    console.error("There was an error fetching the dashboard data!", error);
                }
            }
        };

        fetchDashboardData(); // Call the function to fetch data
    }, []);

    // Calculate differences
    const calculateDifference = (current, previous) => current - previous;

    // Data for the Pie charts
    const pieChart1Data = {
        labels: ['Teacher Requests', 'Students', 'Subject Teacher Requests', 'Testimonials'],
        datasets: [{
            label: 'Distribution',
            data: [
                data.particularTeacherRequest?.total || 0,
                data.student?.total || 0,
                data.subjectTeacherRequest?.total || 0,
                data.testimonial?.total || 0
            ],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };
    const barChartData = {
        labels: [
            'Banners',
            'Hero Banners',
            'Teacher Requests',
            'Students',
            'Cities',
            'Classes',
            'Testimonials',
            'Subjects',
            'Subject Teacher Requests'
        ],
        datasets: [{
            label: 'Counts',
            data: [
                data.bannerCount || 0, // Make sure these fields exist in your data
                data.heroBannerCount || 0,
                data.particularTeacherRequest?.total || 0, // Use the correct field for total requests
                data.student?.total || 0,
                data.cityCount || 0,
                data.classCount || 0,
                data.testimonial?.total || 0,
                data.Subjects || 0,
                data.subjectTeacherRequest?.total || 0
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };
    const barChartDatatwo = {
        labels: [
            'All Time Request',
            'Today Request',
        ],
        datasets: [{
            label: 'Counts',
            data: [

                data.AllTimeRequest || 0,

                data.TodayTeacherRequest || 0
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const pieChart2Data = {
        labels: ['Cities', 'Classes', 'Subjects', 'Subscribers'],
        datasets: [{
            label: 'Distribution',
            data: [
                data.cityCount || 0,
                data.classCount || 0,
                data.Subjects || 0,
                data.subscribers?.subscriberCount || 0
            ],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };

    const handleLogout = () => {
        localStorage.clear();
        toast.success("Logout Successful 👍✔️");
        window.location.reload();
    };

    const CleanCaches = async () => {
        try {
            const response = await axios.get('https://api.srtutorsbureau.com/flush-all-Redis-Cached', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("All Caches Cleared From Website 👍✔️");
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <PiPaintBrushHouseholdFill onClick={CleanCaches} className="text-xl cursor-pointer" />
                    <FontAwesomeIcon icon={faBell} className="text-xl cursor-pointer" />
                    <FontAwesomeIcon icon={faUser} className="text-xl cursor-pointer" />
                    <FontAwesomeIcon onClick={handleLogout} icon={faSignOutAlt} className="text-xl cursor-pointer" />
                    {/* <FontAwesomeIcon /> */}
                </div>
            </header>

            {/* Main content */}
            <main className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card
                        href={"/Manage-All-Requests"}
                        icon={faPersonChalkboard}
                        title="Today Teacher Requests "
                        value={data.TodayTeacherRequest || 0}
                        difference={calculateDifference(data.TodayTeacherRequest || 0, data.AllTimeRequest || 0)}
                        iconColor="text-blue-500"
                    />
                    <Card
                        href={"/Manage-Student"}
                        icon={faUser}
                        title="Total Students"
                        value={data.student?.total || 0}
                        difference={calculateDifference(data.student?.total || 0, data.student?.weekAgo || 0)}
                        iconColor="text-green-500"
                    />
                    <Card
                        // href={"/Subject-Teacher-Requests"}
                        icon={faPersonChalkboard}
                        title="All Teachers"
                        value={data.TeacherHaveDoneNotDoneProfile || 0}
                        // difference={calculateDifference(data.TeacherHaveDoneNotDoneProfile || 0, data.TeacherHaveDoneNotDoneProfile || 0)}
                        iconColor="text-red-500"
                    />
                    <Card
                        // href={"/Subject-Teacher-Requests"}
                        icon={faPersonChalkboard}
                        title="Teachers Have Profile Complete"
                        value={data.TeacherHaveDoneProfile || 0}
                        iconColor="text-red-500"
                    />
                    <Card
                        href={"/Manage-Reviews"}
                        icon={faHeart}
                        title="Total Testimonials"
                        value={data.testimonial?.total || 0}
                        iconColor="text-red-500"
                    />
                    <Card
                        href={"/Manage-City"}
                        icon={faCity}
                        title="Total Cities"
                        value={data.cityCount || 0}
                        iconColor="text-orange-500"
                    />
                    <Card
                        href={"/Manage-Class"}
                        icon={faSchool}
                        title="Total Classes"
                        value={data.classCount || 0}
                        iconColor="text-yellow-500"
                    />
                    <Card
                        href={"/Manage-Class"}
                        icon={faBook}
                        title="Total Subjects"
                        value={data.Subjects || 0}
                        iconColor="text-teal-500"
                    />
                    <Card
                        href={"/all-subscribers"}
                        icon={faStar}
                        title="Total Subscribers"
                        value={data.subscribers?.subscriberCount || 0}
                        iconColor="text-pink-500"
                    />
                    {/* <Card
                        href={"/Manage-Blogs"}
                        icon={faBlog}
                        title="Total Blogs"
                        value={data.blogCount?.currentMonthCount || 0}
                        iconColor="text-pink-500"
                    /> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white h-[50vh] p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Dashboard Overview </h2>
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
                    <div className="bg-white h-[50vh] p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Difference of Request</h2>
                        <Bar data={barChartDatatwo} options={{
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
                    {/* <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Distribution (Pie Chart 1)</h2>
                        <Pie data={pieChart1Data} options={{
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
                            }
                        }} />
                    </div> */}

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Distribution (Pie Chart 2)</h2>
                        <Pie data={pieChart2Data} options={{
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
                            }
                        }} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
