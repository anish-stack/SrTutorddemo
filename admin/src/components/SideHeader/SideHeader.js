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


    const [data, setData] = useState([]);
    const [pdata, setPData] = useState([]);

    const token = localStorage.getItem('Sr-token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.srtutorsbureau.com/api/v1/student/admin-teacher-Request', {
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
                const response = await axios.get('https://api.srtutorsbureau.com/api/v1/student/admin-particular-Request', {
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
                                <a href={'/Manage-Teacher'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Teacher</a>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-user-graduate mr-3"></i>
                                <Link to={'/Manage-Student'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Student</Link>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-school mr-3"></i>
                                <Link to={'/Manage-Class'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Class</Link>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-chalkboard-teacher mr-3"></i>
                                <a href={'/Manage-Justdial'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Justdial</a>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-message mr-3"></i>
                                <a href={'/Manage-Leads'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Leads(Teacher)</a>
                            </li>
                            {/* <li className="flex items-center">
                                <i className="fa-solid fa-blog mr-3"></i>
                                <Link to={'/Manage-Blogs'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Blogs</Link>
                            </li> */}
                            <li className="flex items-center">
                                <i className="fa-solid fa-star mr-3"></i>
                                <Link to={'/Manage-Reviews'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Reviews</Link>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-image mr-3"></i>
                                <Link to={'/Manage-Banners'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Banners</Link>
                            </li>

                            <li className="flex items-center">
                                <i className="fa-solid fa-add mr-3"></i>
                                <Link to={'/Add-request'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Add Request</Link>
                            </li>

                            {/* <li className="flex items-center">
                                <i className="fa-solid fa-book-open mr-3"></i>
                                <Link to={'/Manage-Class-teacher-request'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Class Teacher Request</Link>
                            </li> */}
                            {/* <li className="flex items-center">
                                <i className="fa-solid fa-user-edit mr-3"></i>

                                <Link to={'/Manage-Teacher-Requests'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Teacher Requests</Link>
                                <span className='bg-red-500 text-white text-center w-5 text-sm rounded-[50%] '>{pdata || 0}</span>

                            </li> */}
                            <li className="flex items-center ">
                                <i className="fa-solid fa-user-edit  z-20 mr-3"></i>
                                <Link to={'/Manage-All-Requests'} className="text-lg relative truncate lg:text-base hover:text-red-600 transition-colors">Manage Requests</Link>
                                <span className='bg-red-500 text-white text-center w-5 text-sm rounded-[50%] '>{data || 0}</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-city mr-3"></i>
                                <Link to={'/Manage-City'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage City</Link>
                            </li>
                            <li className="relative flex items-center group">
                                <i className="fa-solid fa-envelope mr-3"></i>
                                <Link className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Newsletter <i class="fa-solid fa-arrow-right"></i></Link>


                                <ul className="absolute right-[-192px] mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-10">
                                    <li className="hover:bg-gray-100">
                                        <Link to="/all-subscribers" className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition-colors">
                                            <i className="fa-solid fa-users mr-2"></i> All Subscribers
                                        </Link>
                                    </li>
                                    <li className="hover:bg-gray-100">
                                        <Link to="/all-template" className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition-colors">
                                            <i className="fa-solid fa-envelope-open-text mr-2"></i> All Email Template
                                        </Link>
                                    </li>
                                    {/* <li className="hover:bg-gray-100">
                                        <Link to="/send-offers" className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition-colors">
                                            <i className="fa-solid fa-paper-plane mr-2"></i> Send Offer Mails
                                        </Link>
                                    </li> */}
                                </ul>
                            </li>

                            <li className="flex items-center">
                                <i className="fa-solid fa-phone mr-3"></i>
                                <Link to={'/Manage-Contact'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Contact</Link>
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-user-cog mr-3"></i>
                                <Link to={'/Manage-Profile'} className="text-lg lg:text-base hover:text-red-600 transition-colors">Manage Profile</Link>
                            </li>

                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default SideHeader;
