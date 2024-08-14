import React from 'react';
import SideContent from '../components/SideContent/SideContent';
import SideHeader from '../components/SideHeader/SideHeader';

const Home = () => {
    return (
        <div className="max-w-full h-screen overflow-auto m-0">
            <div className="w-full h-full flex">
                <div className="md:w-1/4 lg:w-1/5 h-full flex-shrink-0">
                    <SideHeader />
                </div>
                <div className="w-full lg:w-4/5 h-full overflow-y-auto">
                    <SideContent />
                </div>
            </div>
        </div>
    );
};

export default Home;
