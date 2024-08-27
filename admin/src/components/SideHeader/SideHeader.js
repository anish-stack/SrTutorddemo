import React, { useEffect, useState } from 'react';
import logo from './logo.webp';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Slices/LoginSlice';
import './sideHeader.css'
import axios from 'axios';
const SideHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const { isLogin } = useSelector((state) => state.login);

    const handleLogout = (e) => {
        e.preventDefault();

    };
    const [data, setData] = useState([]);
    const [pdata, setPData] = useState([]);

    const token = localStorage.getItem('Sr-token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://www.sr.apnipaathshaala.in/api/v1/student/admin-teacher-Request', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const PendingData = response.data.data
                const filterData = PendingData.filter((item) => item.statusOfRequest === "pending")
                console.log(filterData)
                setData(filterData.length)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchDataParticular = async () => {
            try {
                const response = await axios.get('https://www.sr.apnipaathshaala.in/api/v1/student/admin-particular-Request', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response.data.data)
                const PendingPData = response.data.data
                const filterPData = PendingPData.filter((item) => item.statusOfRequest === "pending")

                setPData(filterPData.length);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchDataParticular();

        fetchData();
    }, [token]);
    console.log(data)
    return (
        <div className="w-full h-full border lg:w-64">
            <div className="bg-white h-full">
                <div className="logo-box flex items-center gap-2 p-4 lg:px-6 lg:py-4 justify-center w-full">
                    <div className="w-24 h-12 lg:w-32 lg:h-16">
                        <img src={logo} className="w-full h-full object-cover" alt="Dashboard Logo" />
                    </div>

                </div>
                <hr className="border-black" />
                <div className="w-full py-4 px-3 lg:px-6">
                    <nav>
                        <ul className="space-y-6">
                            <li className="flex items-center">
                                <i className="fa-solid fa-tachometer-alt mr-3"></i>
                                <Link to={'/'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Dashboard</Link>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-chalkboard-teacher mr-3"></i>
                                <Link to={'/Manage-Teacher'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Teacher</Link>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-user-graduate mr-3"></i>
                                <Link to={'/Manage-Student'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Student</Link>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-school mr-3"></i>
                                <Link to={'/Manage-Class'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Class</Link>
                            </li>
                            {/* <li className="flex items-center">
                                <i className="fa-solid fa-book-open mr-3"></i>
                                <Link to={'/Manage-Subjects'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Subjects</Link>
                            </li> */}
                            <li className="flex items-center">
                                <i className="fa-solid fa-blog mr-3"></i>
                                <Link to={'/Manage-Blogs'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Blogs</Link>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-star mr-3"></i>
                                <Link to={'/Manage-Reviews'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Reviews</Link>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-image mr-3"></i>
                                <Link to={'/Manage-Banners'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Banners</Link>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-user-edit mr-3"></i>

                                <Link to={'/Manage-Teacher-Requests'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Teacher Requests</Link>
                                <span className='bg-red-500 text-white text-center w-5 text-sm rounded-[50%] '>{pdata || 0}</span>

                            </li>
                            <li className="flex items-center ">
                                <i className="fa-solid fa-user-edit  z-20 mr-3"></i>
                                <Link to={'/Subject-Teacher-Requests'} className="text-lg relative truncate lg:text-base hover:text-red-600 transition-colors">Subject Teacher Requests</Link>
                                <span className='bg-red-500 text-white text-center w-5 text-sm rounded-[50%] '>{data || 0}</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-city mr-3"></i>
                                <Link to={'/Manage-City'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage City</Link>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-user-cog mr-3"></i>
                                <Link to={'/Manage-Profile'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Profile</Link>
                            </li>
                            <li className="flex items-center">

                                <a href="/" onClick={handleLogout} className="whitespace-nowrap gap-1 mt-2  flex items-center justify-center rounded border text-sm border-red-400 bg-gradient-to-r from-red-100 to-red-200 px-8 py-1 font-semibold text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                                >Logout <i className="fa-solid fa-sign-out-alt mr-3"></i></a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default SideHeader;
