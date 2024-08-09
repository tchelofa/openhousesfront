'use client'
import { useState, useEffect } from 'react'
import Favorite from './favorites'
import Carrossel from './carrossel'
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
            <div className="image-container">
                <Carrossel propertyId={property.publicId} />
            </div>
            <div className="card-body p-4">
                <h5 className="card-title font-bold text-xl flex items-center justify-between mb-4">
                    <a href={`/property/details/?id=${property.publicId}`}>{property.title}</a>
                    <Favorite userId={userId} propertyId={property.publicId} />
                </h5>
                <a href={`/property/details/?id=${property.publicId}`}>
                    <p className="card-text text-gray-700">{property.description}</p>
                    <p className="card-text text-gray-700 mb-4">
                        {property.address}, {property.neighborhood}, {property.city}, {property.county}, {property.country}
                    </p>
                    <p className="card-text text-gray-700"><strong>Price:</strong> € {property.price}</p><hr className='my-2'/>
                    <p className="card-text text-gray-700"><strong>Type:</strong> {property.propertyType}</p><hr className='my-2'/>
                    <p className="card-text text-gray-700"><strong>Rooms:</strong> {property.rooms}</p><hr className='my-2'/>
                    <p className="card-text text-gray-700"><strong>Capacity:</strong> {property.capacity}</p><hr className='my-2'/>
                    <p className="card-text text-gray-700"><strong>Toilets:</strong> {property.toilets}</p><hr className='my-2'/>
                    <p className="card-text text-gray-700"><strong>Business Type: </strong> {property.businessType}</p>
                </a>
            </div>
        </div>
    )
}

export default Card
