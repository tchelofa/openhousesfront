'use client'
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Env } from '@/lib/Env';
import { instance as axios } from '@/lib/axiosConfig';

const ITEMS_PER_PAGE = 10;

interface PropertySchema {
    id: number;
    publicId: string;
    title: string;
    description: string;
    address: string;
    neighborhood: string;
    city: string;
    county: string;
    country: string;
    postcode: string;
    price: string;
    propertyType: string;
    rooms: string;
    capacity: string;
    toilets: string;
    externalArea: string;
    electricityFee: string;
    wifiFee: string;
    rubbishFee: string;
    depositFee: string;
    timeRefundDeposit: string;
    availableAtInit: string;
    availableAtEnd: string;
    active: boolean;
    userId: string;
    updatedAt: string;
    createdAt: string;
    businessType: 'RENT' | 'SELL';
}

export default function MyProperties() {
    const [rentProperties, setRentProperties] = useState<PropertySchema[]>([]);
    const [sellProperties, setSellProperties] = useState<PropertySchema[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<PropertySchema[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [deleteProperty, setDeleteProperty] = useState<any>()

    

    

    const fetchProperties = async () => {
        setIsLoading(true);
        try {
            const id = localStorage.getItem('id');
            if (!id) {
                toast.error('User ID not found in local storage');
                return;
            }

            const [rentResponse, sellResponse] = await Promise.all([
                axios.get(`${Env.baseurl}/properties/filtered`, { params: { userId: id, businessType: 'RENT' } }),
                axios.get(`${Env.baseurl}/properties/filtered`, { params: { userId: id, businessType: 'SELL' } })
                
            ]);

            if (rentResponse.status === 200 && sellResponse.status === 200) {
                const fetchedRentProperties = rentResponse.data.data.map((property: PropertySchema) => ({
                    ...property
                }));
                const fetchedSellProperties = sellResponse.data.data.map((property: PropertySchema) => ({
                    ...property
                }));

                setRentProperties(fetchedRentProperties);
                setSellProperties(fetchedSellProperties);
                setFilteredProperties([...fetchedRentProperties, ...fetchedSellProperties]);
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

    useEffect(() => {
        filterProperties(searchTerm);
    }, [searchTerm, rentProperties, sellProperties]);

    useEffect(() => {
        fetchProperties();
    }, []);

    const filterProperties = (term: string) => {
        if (!term) {
            setFilteredProperties([...rentProperties, ...sellProperties]);
        } else {
            const lowerCaseTerm = term.toLowerCase();
            const filtered = [...rentProperties, ...sellProperties].filter((property) =>
                Object.values(property).some((value: any) =>
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
            const propertyToToggle = filteredProperties.find(property => property.publicId === id);
            if (!propertyToToggle) {
                toast.error('Property not found');
                return;
            }

            const response = await axios.put(`${Env.baseurl}/properties/toogleproperty/${id}`);

            if (response.status === 200) {
                const updatedProperties = filteredProperties.map(property => {
                    if (property.publicId === id) {
                        return {
                            ...property,
                            active: !property.active  // Alternar o estado active da propriedade específica
                        };
                    }
                    return property;
                });

                setRentProperties(updatedProperties.filter(property => property.businessType === 'RENT'));
                setSellProperties(updatedProperties.filter(property => property.businessType === 'SELL'));
                setFilteredProperties(updatedProperties);

                const newState = propertyToToggle.active ? 'deactivated' : 'activated';
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

    const handleDeleteProperty = async (propertyId: string) => {
        try {
            const propertyDelete = await axios.delete(`${Env.baseurl}/properties/delete/${propertyId}`)
                .then(response => {
                    setDeleteProperty(response.data)
                    toast.success("Your property was deleted with sucess!")
                })
                .catch((error) => {
                    toast.error(error)
                })
        } catch (error) {

            console.error('Error toggling property:', error);

        }
    }
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
                                    <td><a href={`/property/details/?id=${property.publicId}`}>{property.title}</a></td>
                                    <td>{property.description}</td>
                                    <td>{`${property.address}, ${property.neighborhood}, ${property.city}, ${property.county}, ${property.country}`}</td>
                                    <td>{property.propertyType}</td>
                                    <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="flex gap-4">
                                            <a href={`/property/update/${property.publicId}`} className="bg-sky-900 text-white p-4 rounded-md">Update</a>
                                            <button
                                                onClick={() => handleToggleProperty(property.publicId)}
                                                className={property.active ? 'bg-red-900 text-white p-4 rounded-md' : 'bg-green-800 text-white p-4 rounded-md'}
                                            >
                                                {property.active ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProperty(property.publicId)}
                                                className={property.active ? 'bg-red-900 text-white p-4 rounded-md' : 'bg-green-800 text-white p-4 rounded-md'}
                                            >
                                                Delete
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
