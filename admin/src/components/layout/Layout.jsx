import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="lg:pl-64">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;