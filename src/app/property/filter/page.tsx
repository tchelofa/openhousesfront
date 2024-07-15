'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { instance as axios } from '@/lib/axiosConfig';
import { Env } from '@/lib/Env';
import Card from '@/app/property/components/card';

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
    const searchTerm = searchParams.get('searchTerm') || '';
    const businessType = searchParams.get('businessType') || '';
    const [properties, setProperties] = useState<PropertySchema[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFilteredProperties = async () => {
            if (searchTerm.length >= 3) {
                try {
                    const response = await axios.get<ApiResponse>(
                        `${Env.baseurl}/properties/filtered`,
                        { params: { searchTerm, businessType } }
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
            } else {
                setLoading(false);
                setProperties([]);
            }
        };

        fetchFilteredProperties();
    }, [searchTerm, businessType]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 flex w-full flex-col sm:flex-row">
            <div className='w-1/6'>Filter</div>
            <div className="flex-1">
                <h1 className="text-3xl font-bold mb-4">Filtered Properties</h1>
                {properties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
