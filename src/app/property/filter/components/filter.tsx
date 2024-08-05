import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Env } from '@/lib/Env';

interface FilterProps {
    onFilterChange: (newFilters: { city?: string; minPrice?: number; maxPrice?: number, propertyType?: string, businessType?: string }) => void;
}

export default function Filter({ onFilterChange }: FilterProps) {
    const [city, setCity] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(10000);
    const [defaultMinPrice, setDefaultMinPrice] = useState<number>(0);
    const [defaultMaxPrice, setDefaultMaxPrice] = useState<number>(10000);
    const [propertyType, setPropertyType] = useState<string>('');
    const [businessType, setBusinessType] = useState<string>('');

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await axios.get(`${Env.baseurl}/properties/prices`);
                const { minPrice, maxPrice } = response.data.data;
                setDefaultMinPrice(minPrice);
                setDefaultMaxPrice(maxPrice);
                setMinPrice(minPrice);
                setMaxPrice(maxPrice);
                onFilterChange({ city, minPrice, maxPrice, propertyType, businessType });
            } catch (error) {
                console.error('Error fetching prices:', error);
            }
        };

        fetchPrices();
    }, []);

    const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCity(value);
        onFilterChange({ city: value, minPrice, maxPrice, propertyType, businessType });
    };

    const handleMinPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setMinPrice(value);
        onFilterChange({ city, minPrice: value, maxPrice, propertyType, businessType });
        if (value > maxPrice) {
            setMaxPrice(value);
        }
    };

    const handleMaxPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setMaxPrice(value);
        onFilterChange({ city, minPrice, maxPrice: value, propertyType, businessType });
        if (value < minPrice) {
            setMinPrice(value);
        }
    };

    const handlePropertyTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setPropertyType(value);
        onFilterChange({ city, minPrice, maxPrice, propertyType: value, businessType });
    };

    const handleBusinessTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setBusinessType(value);
        onFilterChange({ city, minPrice, maxPrice, propertyType, businessType: value });
    };

    return (
        <nav className="w-full flex flex-col border-r mr-2">
            <h1 className="font-bold p-4">Filters</h1>
            <div className="flex flex-col p-4 gap-2">
                <label htmlFor="city">City</label>
                <input 
                    type="text" 
                    name="city" 
                    id="city" 
                    className="border border-gray-300 rounded-md p-2 outline-none w-full"
                    value={city}
                    onChange={handleCityChange}
                />
            </div>
            <div className="flex flex-col p-4 gap-2">
                <label htmlFor="propertyType">Property Type</label>
                <select 
                    name="propertyType" 
                    id="propertyType" 
                    className="border border-gray-300 rounded-md p-2 outline-none w-full"
                    value={propertyType}
                    onChange={handlePropertyTypeChange}
                >
                    <option value="">Select Property Type</option>
                    <option value="FLAT">Flat</option>
                    <option value="HOUSE">House</option>
                    <option value="SINGLEROOM">Single Room</option>
                    <option value="SHAREDROOM">Shared Room</option>
                    <option value="DOUBLEROOM">Double Room</option>
                </select>
            </div>
            <div className="flex flex-col p-4 gap-2">
                <label htmlFor="businessType">Business Type</label>
                <select 
                    name="businessType" 
                    id="businessType" 
                    className="border border-gray-300 rounded-md p-2 outline-none w-full"
                    value={businessType}
                    onChange={handleBusinessTypeChange}
                >
                    <option value="">Select Business Type</option>
                    <option value="RENT">Rent</option>
                    <option value="SELL">Sell</option>
                </select>
            </div>
            <div className="w-full p-4">
                <div className="w-full flex flex-col gap-2 slider-container bg-white">
                    <div className="relative">
                        <label htmlFor="min_price">Min Price: {minPrice}</label>
                        <input 
                            type="range" 
                            name="min_price" 
                            id="min_price" 
                            min={defaultMinPrice} 
                            max={defaultMaxPrice} 
                            step="50" 
                            value={minPrice}
                            onChange={handleMinPriceChange}
                            className="slider"
                        />
                        <span className="badge">{minPrice}</span>
                    </div>
                    <div className="relative">
                        <label htmlFor="max_price">Max Price: {maxPrice}</label>
                        <input 
                            type="range" 
                            name="max_price" 
                            id="max_price" 
                            min={defaultMinPrice} 
                            max={defaultMaxPrice} 
                            step="50" 
                            value={maxPrice}
                            onChange={handleMaxPriceChange}
                            className="slider"
                        />
                        <span className="badge">{maxPrice}</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
