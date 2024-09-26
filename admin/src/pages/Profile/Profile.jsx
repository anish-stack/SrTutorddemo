import React from 'react';

const Profile = () => {
    // Parse profile data from local storage
    const profileData = JSON.parse(localStorage.getItem('Sr-token-user'));

    if (!profileData) {
        return <div className="text-red-500">No profile data found.</div>;
    }

    return (
        <div className="container mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
            <h2 className="text-3xl font-semibold mb-4">Profile Details</h2>
            
            {/* Profile Image (Placeholder) */}
            <div className="flex justify-center mb-5">
                <img 
                    src="https://via.placeholder.com/150" // You can replace this with a dynamic image URL if available
                    alt="Profile"
                    className="rounded-full border border-gray-300 shadow-lg"
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="font-semibold">Student Name:</h3>
                    <p>{profileData.StudentName}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="font-semibold">Email:</h3>
                    <p>{profileData.Email}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="font-semibold">Phone Number:</h3>
                    <p>{profileData.PhoneNumber}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="font-semibold">Alt Phone Number:</h3>
                    <p>{profileData.AltPhoneNumber}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="font-semibold">Role:</h3>
                    <p>{profileData.Role}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="font-semibold">Created At:</h3>
                    <p>{new Date(profileData.createdAt).toLocaleString()}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="font-semibold">Updated At:</h3>
                    <p>{new Date(profileData.updatedAt).toLocaleString()}</p>
                </div>
          
                
            </div>
        </div>
    );
};

export default Profile;
