'use client'
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Env } from '@/lib/Env';
import { instance as axios } from '@/lib/axiosConfig';

const ITEMS_PER_PAGE = 10;

export default function MyProperties() {
    const [properties, setProperties] = useState<any[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        filterProperties(searchTerm);
    }, [searchTerm]);

    const fetchProperties = async () => {
        setIsLoading(true);
        try {
            const id = localStorage.getItem('id');
            if (!id) {
                toast.error('User ID not found in local storage');
                return;
            }
    
            const response = await axios.get(`${Env.baseurl}/properties`, {
                params: {
                    userId: id,
                },
            });
    
            if (response.status === 200) {
                const fetchedProperties = response.data.properties.map((property: any) => ({
                    ...property,
                    isActive: property.active
                }));
    
                setProperties(fetchedProperties);
                setFilteredProperties(fetchedProperties);
            } else {
                toast.error('Failed to fetch properties');
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
            toast.error('Failed to fetch properties');
        } finally {
            setIsLoading(false);
        }
    };
    const filterProperties = (term: string) => {
        if (!term) {
            setFilteredProperties(properties);
        } else {
            const lowerCaseTerm = term.toLowerCase();
            const filtered = properties.filter((property) =>
                Object.values(property).some((value:any) =>
                    value.toString().toLowerCase().includes(lowerCaseTerm)
                )
            );
            setFilteredProperties(filtered);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleToggleProperty = async (id: string) => {
        try {
            const propertyToToggle = properties.find(property => property.publicId === id);
            if (!propertyToToggle) {
                toast.error('Property not found');
                return;
            }

            const response = await axios.put(`${Env.baseurl}/properties/toogleproperty/${id}`);

            if (response.status === 200) {
                const updatedProperties = properties.map(property => {
                    if (property.publicId === id) {
                        return {
                            ...property,
                            isActive: !property.isActive  // Alternar o estado isActive da propriedade específica
                        };
                    }
                    return property;
                });

                setProperties(updatedProperties);
                setFilteredProperties(updatedProperties);

                const newState = propertyToToggle.isActive ? 'deactivated' : 'activated';
                toast.success(`Property ${newState} successfully`);
            } else {
                toast.error('Failed to toggle property');
            }
        } catch (error) {
            console.error('Error toggling property:', error);
            toast.error('Failed to toggle property');
        }
    };

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`button ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="w-full flex flex-col p-10 gap-10">
            <h1 className="text-2xl font-bold">My Properties</h1>

            <div className="flex items-center">
                <input
                    type="text"
                    className="border border-gray-300 p-2 w-full outline-none focus:shadow-md"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Address</th>
                                <th>Type</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((property) => (
                                <tr key={property.publicId}>
                                    <td><a href={`/property/detail/?id=${property.publicId}`}>{property.title}</a></td>
                                    <td>{property.description}</td>
                                    <td>{property.address}</td>
                                    <td>{property.propertyType}</td>
                                    <td>{property.createdAt}</td>
                                    <td>
                                        <div className="flex gap-4">
                                            <a href={`/property/update/${property.publicId}`} className="bg-sky-900 text-white p-4 rounded-md">Update</a>
                                            <button
                                                onClick={() => handleToggleProperty(property.publicId)}
                                                className={property.isActive ? 'bg-red-900 text-white p-4 rounded-md' : 'bg-green-800 text-white p-4 rounded-md'}
                                            >
                                                {property.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-center mt-4">
                {renderPagination()}
            </div>

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
