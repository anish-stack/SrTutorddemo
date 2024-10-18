import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FetchBanner } from '../../Slices/BannerSlice';
import Loading from '../../components/Loading/Loading';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import ImageUploader from 'react-image-upload';
import 'react-image-upload/dist/index.css';

const AllBanners = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;
    const { data, loading, error } = useSelector((state) => state.Banner);
    const [Banners, setBanners] = useState([]);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [formValues, setFormValues] = useState({
        ButtonText: '',
        Position: '',
        Para: '',
        RedirectPageUrl: '',
        BannerUrl: '',
        file: null // Use single file for handling one image
    });
    const Token = localStorage.getItem('Sr-token');

    useEffect(() => {
        dispatch(FetchBanner());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            setBanners(data);
        }
    }, [data]);
    const paginatedData = Banners?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };
    // Open modal for creating or editing
    const openModal = (banner = null) => {
        setSelectedBanner(banner);
        if (banner) {
            setFormValues({
                ButtonText: banner.ButtonText,
                Position: banner.Position,
                Para: banner.Para,
                RedirectPageUrl: banner.RedirectPageUrl,
                BannerUrl: banner.Banner.url
            });
        } else {
            setFormValues({
                ButtonText: '',
                Position: '',
                Para: '',
                RedirectPageUrl: '',
                BannerUrl: ''
            });
        }
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBanner(null);
    };

    // Handle form input changes
    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });
    };
    function getImageFileObject(imageFile) {
        console.log({ imageFile })
        setFormValues((prev) => ({ ...prev, file: { imageFile } }))
    }
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedBanner) {
                setIsLoading(true)
                const formDataToSubmit = new FormData();
                formDataToSubmit.append('ButtonText', formValues.ButtonText);
                formDataToSubmit.append('Position', formValues.Position);
                formDataToSubmit.append('RedirectPageUrl', formValues.RedirectPageUrl);
                formDataToSubmit.append('Para', formValues.Para);


                if (formValues.file) {
                    formDataToSubmit.append('image', formValues.file?.imageFile?.file);
                }
                // Update existing banner
                const response = await axios.put(`https://api.srtutorsbureau.com/api/v1/admin/update-Banner/${selectedBanner._id}`, formDataToSubmit, {
                    headers: { Authorization: `Bearer ${Token}` }
                });
                setIsLoading(false)
                console.log("update-data", response.data)
            } else {
                setIsLoading(true)
                const formDataToSubmit = new FormData();
                formDataToSubmit.append('ButtonText', formValues.ButtonText);
                formDataToSubmit.append('Position', formValues.Position);
                formDataToSubmit.append('RedirectPageUrl', formValues.RedirectPageUrl);
                formDataToSubmit.append('Para', formValues.Para);



                if (formValues.file) {
                    formDataToSubmit.append('image', formValues.file?.imageFile?.file);
                }
                // Create new banner
 
                const res = await axios.post(`https://api.srtutorsbureau.com/api/v1/admin/Create-Banner`, formDataToSubmit, {
                    headers: { Authorization: `Bearer ${Token}` }
                });
                console.log(res.data)
                await axios.post(`https://api.srtutorsbureau.com/api/v1/admin/Create-Banner`, formDataToSubmit, {
                    headers: { Authorization: `Bearer ${Token}` }
                });
 origin/main
            }
            dispatch(FetchBanner());
            closeModal();
            setIsLoading(false)
        } catch (error) {
            console.error("Failed to submit banner:", error);
        }
    };

    // Handle banner deletion
    const handleDelete = async (id) => {
        setIsLoading(true)
        try {
            await axios.delete(`https://api.srtutorsbureau.com/api/v1/admin/delete-Banner/${id}`, {
                headers: { Authorization: `Bearer ${Token}` }
            });
            setBanners(Banners.filter(banner => banner._id !== id));
            setIsLoading(false)
        } catch (error) {
            console.error("Failed to delete banner:", error);
        }
    };

    const renderedBanners = useMemo(() => {
        return paginatedData.reverse().map((banner, index) => (
            <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
                <img className="w-full h-52" src={banner.Banner.url} alt={`Banner ${index + 1}`} />

                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{banner.ButtonText}</div>
                    <p className="text-gray-700 text-base">
                        Para: {banner.Para}
                    </p>
                    <p className="text-gray-700 text-base">
                        Position: {banner.Position}
                    </p>
                    <p className="text-gray-700 text-base">
                        Redirect: <a href={banner.RedirectPageUrl} className="text-blue-500">{banner.RedirectPageUrl}</a>
                    </p>
                </div>
                <div className="px-6 py-4 flex justify-between">
                    <button
                        onClick={() => openModal(banner)}
                        className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(banner._id)}
                        className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));
    }, [Banners]);

    if (loading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;
    if (isLoading) {
        return <Loading />;
    }
    return (
        <div className="flex flex-wrap justify-center">
            <h1 className="text-2xl font-bold mb-4 w-full text-center">All Banners</h1>
            <button
                onClick={() => openModal()}
                className="mb-4 text-white bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded"
            >
                Create New Banner
            </button>
            {Banners && Banners.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {renderedBanners}
                </div>
            ) : (
                <div>No banners available</div>
            )}
            <ReactPaginate
                pageCount={Math.ceil(Banners.length / itemsPerPage)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                containerClassName="flex items-center justify-center mt-4"
                pageClassName="mx-1"
                pageLinkClassName="bg-red-400 px-4 py-1 border border-gray-300 rounded-lg hover:bg-red-500"
                previousClassName="mx-1"
                previousLinkClassName="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-green-400 bg-gradient-to-r from-green-100 to-green-200 px-4 py-1 font-semibold text-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                nextClassName="mx-1"
                nextLinkClassName="whitespace-nowrap gap-1 text-sm flex items-center justify-center rounded border border-indigo-400 bg-gradient-to-r from-indigo-100 to-indigo-200 px-4 py-1 font-semibold text-indigo-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 active:opacity-100 transition duration-150"
                breakClassName="mx-1"
                breakLinkClassName="bg-red-400 px-4 py-1 border border-gray-300 rounded-lg hover:bg-red-500"
                activeClassName="rounded-lg "
            />
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedBanner ? 'Edit Banner' : 'Create New Banner'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ButtonText">
                                    Button Text
                                </label>
                                <input
                                    type="text"
                                    id="ButtonText"
                                    name="ButtonText"
                                    value={formValues.ButtonText}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ButtonText">
                                    Write Some Para
                                </label>
                                <textarea

                                    name="Para"
                                    value={formValues.Para}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Position">
                                    Position
                                </label>
                                <input
                                    type="text"
                                    id="Position"
                                    name="Position"
                                    value={formValues.Position}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="RedirectPageUrl">
                                    Redirect Page URL
                                </label>
                                <input
                                    type="text"
                                    id="RedirectPageUrl"
                                    name="RedirectPageUrl"
                                    value={formValues.RedirectPageUrl}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="file">
                                    Upload Image For Banner
                                </label>
                                <ImageUploader
                                    onFileAdded={(img) => getImageFileObject(img)}
                                    className="border border-gray-300 rounded-md p-2"

                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="BannerUrl">
                                    Old Banner
                                </label>

                                <img className='w-32' src={formValues.BannerUrl} alt="" />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    {selectedBanner ? 'Update Banner' : 'Create Banner'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllBanners;
