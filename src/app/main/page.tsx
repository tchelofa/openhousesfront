'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Env } from '@/lib/Env'; // Certifique-se de que o caminho está correto para sua configuração de ambiente

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
}

type ApiResponse = {
    status: 'success' | 'error';
    message: string;
    data?: PropertySchema[];
    error?: string;
}

export default function MainPage() {
    const [activeOption, setActiveOption] = useState<'RENT' | 'SELL'>('RENT');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<PropertySchema[]>([]);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedSearchTerm.length >= 3) {
            fetchProperties(debouncedSearchTerm);
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm, activeOption]);

    const fetchProperties = async (term: string) => {
        try {
            const response = await axios.get<ApiResponse>(`${Env.baseurl}/properties/filtered`, {
                params: {
                    searchTerm: term,
                    businessType: activeOption
                }
            });

            if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
                setSearchResults(response.data.data);
            } else {
                setSearchResults([]);
                console.error('Error in response data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
            setSearchResults([]);
        }
    };

    const handleOptionClick = (option: 'RENT' | 'SELL') => {
        setActiveOption(option);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <main className="p-4 w-full min-h-screen" style={{ backgroundImage: 'url("/bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'top' }}>
            <section className="bg-white p-10 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3 flex flex-col gap-4 mx-auto">
                <h1 className="text-4xl mb-4 font-bold text-center md:text-left">
                    Find a home to call your own
                </h1>
                <div className="flex justify-center md:justify-start">
                    <div
                        className={`cursor-pointer px-4 py-2 mr-4 ${activeOption === 'RENT' ? 'border-b-2 border-black' : ''}`}
                        onClick={() => handleOptionClick('RENT')}
                    >
                        RENT
                    </div>
                    <div
                        className={`cursor-pointer px-4 py-2 ${activeOption === 'SELL' ? 'border-b-2 border-black' : ''}`}
                        onClick={() => handleOptionClick('SELL')}
                    >
                        SELL
                    </div>
                </div>
                <form className='flex flex-col gap-4'>
                    <input
                        type="search"
                        placeholder='Address, Neighborhood, City, County'
                        className='border border-gray-300 p-4 w-full outline-none'
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </form>
                <div>
                    {searchResults.length > 0 ? (
                        <ul className='flex flex-col gap-4'>
                            {searchResults.map(property => (
                                <li key={property.id}>
                                    <a href={`/property/filter/?searchTerm=${searchTerm}&businessType=${activeOption}`} className='flex gap-4'><h1 className='font-bold'>{property.city}</h1></a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>{debouncedSearchTerm.length >= 3 ? "We cannot find any property as you have been informed." : ""}</p>
                    )}
                </div>
            </section>
        </main>
    );
}
