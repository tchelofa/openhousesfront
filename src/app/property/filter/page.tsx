'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { instance as axios } from '@/lib/axiosConfig';
import { Env } from '@/lib/Env';
import Card from '@/app/property/components/card';
import Filter from './components/filter';

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
    businessType: 'RENT' | 'SELL';
    userId: string;
    updatedAt: string;
    createdAt: string;
}

type ApiResponse = {
    status: string;
    message: string;
    data: PropertySchema[];
};

function PropertyFilterPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const searchTerm = searchParams.get('searchTerm') || '';
    const businessType = searchParams.get('businessType') || '';
    const city = searchParams.get('city') || '';
    const propertyType = searchParams.get('propertyType') || '';
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : undefined;

    const [properties, setProperties] = useState<PropertySchema[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState<{ city?: string, minPrice?: number, maxPrice?: number, propertyType?: string, businessType?: string }>({ city, minPrice, maxPrice, propertyType, businessType });

    const fetchFilteredProperties = async (appliedFilters: { city?: string, minPrice?: number, maxPrice?: number, propertyType?: string, businessType?: string } = {}) => {
        try {
            const response = await axios.get<ApiResponse>(
                `${Env.baseurl}/properties/filtered`,
                { params: { searchTerm, ...appliedFilters } }
            );

            if (response.data && Array.isArray(response.data.data)) {
                setProperties(response.data.data);
            } else {
                setProperties([]);
            }
        } catch (error) {
            console.error('Error fetching filtered properties:', error);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilteredProperties(filters);
    }, [searchTerm, filters]);

    const handleFilterChange = (newFilters: { city?: string, minPrice?: number, maxPrice?: number, propertyType?: string, businessType?: string }) => {
        setFilters(newFilters);

        const params = new URLSearchParams();
        if (searchTerm) params.set('searchTerm', searchTerm);
        if (newFilters.businessType) params.set('businessType', newFilters.businessType);
        if (newFilters.city) params.set('city', newFilters.city);
        if (newFilters.minPrice !== undefined) params.set('minPrice', newFilters.minPrice.toString());
        if (newFilters.maxPrice !== undefined) params.set('maxPrice', newFilters.maxPrice.toString());
        if (newFilters.propertyType) params.set('propertyType', newFilters.propertyType);

        router.push(`/property/filter?${params.toString()}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 flex w-full flex-col sm:flex-row">
            <div className='w-1/6'>
                <Filter onFilterChange={handleFilterChange} />
            </div>

            <div className="flex-1">
                <h1 className="text-xl font-bold mb-4 p-4">
                    {
                        businessType && `Properties to ${businessType}`
                    }
                    {
                        businessType && searchTerm && (`Properties to ${businessType} in ${city}`)
                    }
                </h1>
                {properties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                        {properties
                            .filter(property => property.active)
                            .map(property => (
                                <Card key={property.id} property={property} />
                            ))
                        }
                    </div>
                ) : (
                    <p>No properties found.</p>
                )}
            </div>
        </div>
    );
}

export default function PropertyFilter() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PropertyFilterPage />
        </Suspense>
    );
}
