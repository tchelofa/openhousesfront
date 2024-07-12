'use client';
import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Required for carousel styles
import { instance as axios } from '@/lib/axiosConfig';
import { Env } from '@/lib/Env';

interface ImageSchema {
    id: number;
    publicId: string;
    url: string;
    propertyId: string;
    updatedAt: string;
    createdAt: string;
}

interface CarrosselProps {
    propertyId: string;
}

export default function Carrossel({ propertyId }: CarrosselProps) {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get<{ data: ImageSchema[] }>(
                    `${Env.baseurl}/properties/getImages/${propertyId}`
                );
                const urls = response.data.data.map(image => image.url);
                setImages(urls);
            } catch (error) {
                console.error('Error fetching property images:', error);
                setImages([]); // Ensure images state is set to an empty array on error
            }
        };

        fetchImages();
    }, [propertyId]);

    const fallbackImage = "https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png";

    const imageElements = images.length > 0 ? images.map((image, index) => (
        <div key={index} className="carouselItem">
            <img src={image} alt={`Image ${index}`} className="carouselImage" />
        </div>
    )) : [(
        <div key="fallback" className="carouselItem">
            <img src={fallbackImage} alt="Fallback image" className="carouselImage" />
        </div>
    )];

    return (
        <div className="carouselContainer">
            <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
                {imageElements}
            </Carousel>
        </div>
    );
}
