'use client'
import { useState, useEffect } from 'react'
import Favorite from './favorites'
import Carrossel from './carrossel'
import { Env } from '@/lib/Env'
import SendMessage from './sendMessage'

interface PropertySchema {
    id: number
    publicId: string
    title: string
    description: string
    address: string
    neighborhood: string
    city: string
    county: string
    country: string
    postcode: string
    price: string
    propertyType: string
    rooms: string
    capacity: string
    toilets: string
    externalArea: string
    electricityFee: string
    wifiFee: string
    rubbishFee: string
    depositFee: string
    timeRefundDeposit: string
    availableAtInit: string
    availableAtEnd: string
    active: boolean
    businessType: 'RENT' | 'SELL'
    userId: string
    updatedAt: string
    createdAt: string
}

interface CardProps {
    property: PropertySchema
}

const Card: React.FC<CardProps> = ({ property }) => {
    const [userId, setUserId] = useState<string>('')

    useEffect(() => {
        const id = localStorage.getItem("id")
        if (id) {
            setUserId(id)
        }
    }, [])

    return (

        <div className="card border rounded-lg overflow-hidden shadow-lg">
            <a href={`/property/details/?id=${property.publicId}`}><Carrossel propertyId={property.publicId} /></a>
            <div className="card-body p-4">
                <h5 className="card-title font-bold text-xl flex items-center justify-between">
                    <a href={`/property/details/?id=${property.publicId}`}>{property.title}</a>
                    <Favorite userId={userId} propertyId={property.publicId} />
                </h5>
                <a href={`/property/details/?id=${property.publicId}`}>
                    <p className="card-text text-gray-700">{property.description}</p>
                    <p className="card-text text-gray-700">
                        {property.address}, {property.neighborhood}, {property.city}, {property.county}, {property.country}
                    </p>
                    <p className="card-text text-gray-700">Price: {property.price}</p>
                    <p className="card-text text-gray-700">Type: {property.propertyType}</p>
                    <p className="card-text text-gray-700">Rooms: {property.rooms}</p>
                    <p className="card-text text-gray-700">Capacity: {property.capacity}</p>
                    <p className="card-text text-gray-700">Toilets: {property.toilets}</p>
                    <p className="card-text text-gray-700">Business Type: {property.businessType}</p>
                </a>
            </div>
        </div>

    )
}

export default Card
