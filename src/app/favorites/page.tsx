'use client';
import { useEffect, useState } from "react";
import { instance as axios } from "@/lib/axiosConfig";
import { Env } from "@/lib/Env";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

interface FavoriteProperty {
    id: number;
    publicId: string;
    userId: string;
    propertyId: string;
}

interface PropertyDetails {
    id: number;
    title: string;
    description: string;
    address: string;
    neighborhood: string;
    city: string;
    county: string;
    country: string;
    price: string;
    propertyType: string;
    rooms: string;
    capacity: string;
    toilets: string;
    businessType: 'RENT' | 'SELL';
    updatedAt: string;
    createdAt: string;
    publicId: string
}

export default function Favorites() {
    const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
    const [properties, setProperties] = useState<PropertyDetails[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [selectedProperty, setSelectedProperty] = useState<PropertyDetails | null>(null);

    useEffect(() => {
        const userIdFromLocalStorage = localStorage.getItem("id");
        if (userIdFromLocalStorage) {
            setUserId(userIdFromLocalStorage);
        }
    }, []);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                if (userId) {
                    const response = await axios.get<{ status: string, message: string, data: FavoriteProperty[] }>(`${Env.baseurl}/properties/favorites/${userId}`);
                    console.log('Response:', response.data);

                    if (response.data && response.data.data) {
                        setFavorites(response.data.data);

                        console.log('Favorites:', response.data.data);

                        const promises = response.data.data.map(async (favorite: FavoriteProperty) => {
                            const propertyResponse = await axios.get<{ status: string, message: string, data: PropertyDetails }>(`${Env.baseurl}/properties/getDetails/${favorite.propertyId}`);
                            return propertyResponse.data.data;
                        });

                        const propertyDetails = await Promise.all(promises);
                        setProperties(propertyDetails);
                        setIsLoading(false);
                    } else {
                        console.error('No favorites found in response:', response.data);
                        setIsLoading(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchFavorites();
        }
    }, [userId]);

    const openModal = (property: PropertyDetails) => {
        setSelectedProperty(property);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedProperty(null);
        setModalIsOpen(false);
    };

    const handleRemoveProperty = async () => {
        if (selectedProperty && userId) {
            try {
                await axios.put(`${Env.baseurl}/properties/toggleFavorite/${selectedProperty.publicId}/${userId}`);
                toast.success('Property removed from favorites');

                // Atualiza a lista de propriedades favoritas
                const updatedProperties = properties.filter(property => property.id !== selectedProperty.id);
                setProperties(updatedProperties);
                closeModal();
            } catch (error) {
                toast.error('Failed to remove property from favorites');
                console.error('Error removing property:', error);
            }
        }
    };

    return (
        <div className="w-full flex flex-col p-4 gap-4">
            <h1 className="text-2xl font-bold">Favorite Properties</h1>

            {isLoading ? (
                <p className="text-lg">Loading...</p>
            ) : (
                <div className="table-container overflow-x-auto">
                    <table className="table-auto w-full text-left">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Title</th>
                                <th className="px-4 py-2 hidden md:table-cell">Description</th>
                                <th className="px-4 py-2 hidden lg:table-cell">Address</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Created At</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map((property) => (
                                <tr key={property.id}>
                                    <td className="px-4 py-2"><a href={`/property/details/?id=${property.publicId}`} className="text-blue-600 hover:underline">{property.title}</a></td>
                                    <td className="px-4 py-2 hidden md:table-cell">{property.description}</td>
                                    <td className="px-4 py-2 hidden lg:table-cell">{property.address}, {property.neighborhood}, {property.city}, {property.county}, {property.country}</td>
                                    <td className="px-4 py-2">{property.propertyType}</td>
                                    <td className="px-4 py-2">{new Date(property.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        <button className="bg-red-900 text-white p-2 rounded-md" onClick={() => openModal(property)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Confirm Remove Property"
                ariaHideApp={true}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Set background color and opacity
                        display: 'flex', // Ensure overlay fills the screen
                        alignItems: 'center', // Center the modal vertically
                        justifyContent: 'center', // Center the modal horizontally
                    },
                    content: {
                        maxWidth: '300px', // Set maximum width for modal content
                        maxHeight: '200px',
                        margin: '0 auto', // Center the modal content horizontally
                        padding: '20px', // Add padding for better spacing
                        border: 'none', // Remove default border
                        borderRadius: '5px', // Add rounded corners
                    }
                }}
            >
                <h2 className="text-xl font-bold">Confirm Remove</h2>
                <p>Are you sure you want to remove this property from your favorites?</p>
                <div className="flex gap-4 mt-4">
                    <button className="bg-red-900 text-white p-2 rounded-md" onClick={handleRemoveProperty}>Yes</button>
                    <button className="bg-gray-300 p-2 rounded-md" onClick={closeModal}>No</button>
                </div>
            </Modal>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
}
