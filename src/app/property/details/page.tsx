'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Env } from '@/lib/Env';
import { useRouter } from 'next/navigation';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Required for carousel styles
import { Carousel } from 'react-responsive-carousel';
import { MdArrowBackIos } from "react-icons/md";
import Favorites from '../components/favorites';
import SendMessage from '../components/sendMessage';
import Carrossel from '../components/carrossel';

interface HouseDetails {
    id: number;
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
    publicId: string;
    images: string[]; // Array of image URLs
}

interface ImageSchema {
    id: number;
    publicId: string;
    url: string;
    propertyId: string;
    updatedAt: string;
    createdAt: string;
}

const HouseDetailsComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const propertyId = searchParams.get('id'); // Ensure you are getting the correct parameter name

    const [houseDetails, setHouseDetails] = useState<HouseDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [images, setImages] = useState<string[]>([]);
    const [userId, setUserId] = useState<any>(null);

    useEffect(() => {
        const userIdFromLocalStorage = localStorage.getItem("id");
        if (userIdFromLocalStorage) {
            setUserId(userIdFromLocalStorage);
        }
    }, []);

    useEffect(() => {
        const fetchHouseDetails = async () => {
            try {
                const response = await axios.get<{ data: HouseDetails }>(`${Env.baseurl}/properties/getDetails/${propertyId}`);
                const property = response.data.data;
                if (!property.active) {
                    router.push('/');
                } else {
                    setHouseDetails(property);
                }
            } catch (error) {
                console.error('Error fetching house details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchImages = async () => {
            try {
                if (propertyId) {
                    const response = await axios.get<{ images: ImageSchema[] }>(`${Env.baseurl}/properties/getImages/${propertyId}`);
                    const urls = response.data.images.map(image => image.url);
                    setImages(urls);
                }
            } catch (error) {
                console.error('Error fetching property images:', error);
                setImages([]); // Ensure images state is set to an empty array on error
            }
        };

        if (propertyId) {
            fetchHouseDetails();
            fetchImages();
        }
    }, [propertyId, userId]);

    const calculateDaysPassed = (createdAt: string) => {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();
        const differenceInTime = currentDate.getTime() - createdDate.getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays;
    };

    return (
        <div className="w-full flex flex-col p-10 mx-auto gap-10">
            <h1 className="text-md font-bold w-fit hover:bg-gray-100 p-4 rounded-md">
                <a href="/" className='flex items-center gap-4'>
                    <MdArrowBackIos />{`Back`}
                </a>
            </h1>

            {isLoading ? (
                <p className="text-lg">Loading...</p>
            ) : houseDetails ? (
                <div className="flex flex-col sm:flex-row">
                    {/* Main content */}
                    <div className="sm:w-2/3 p-4">
                        <Carrossel
                        propertyId={houseDetails.publicId}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="sm:w-1/3 p-4">
                        <div className="">
                            <h2 className="text-3xl font-semibold mb-4">{houseDetails.title}</h2>
                            <Favorites userId={userId} propertyId={houseDetails.publicId} />
                        </div>
                        <p className="text-lg mb-4">{houseDetails.description}</p>
                        <div className='font-bold text-xl'>Details</div>
                        <table className="table w-full">
                            <tbody>
                                <tr>
                                    <td className="font-bold">Address:</td>
                                    <td>{`${houseDetails.address}, ${houseDetails.neighborhood}, ${houseDetails.city}, ${houseDetails.county}, ${houseDetails.country}`}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Eircode:</td>
                                    <td>{houseDetails.postcode}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Price:</td>
                                    <td>€ {houseDetails.price}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Electricity Fee:</td>
                                    <td>€ {houseDetails.electricityFee}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">WiFi Fee:</td>
                                    <td>€ {houseDetails.wifiFee}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Rubbish Fee:</td>
                                    <td>€ {houseDetails.rubbishFee}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Deposit Fee:</td>
                                    <td>€ {houseDetails.depositFee}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Type:</td>
                                    <td>{houseDetails.propertyType}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Rooms:</td>
                                    <td>{houseDetails.rooms}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Capacity:</td>
                                    <td>{houseDetails.capacity}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Toilets:</td>
                                    <td>{houseDetails.toilets}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">External Area:</td>
                                    <td>{houseDetails.externalArea ? "Yes" : "No"}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Time Refund Deposit:</td>
                                    <td>{houseDetails.timeRefundDeposit} days</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Available From:</td>
                                    <td>{new Date(houseDetails.availableAtInit).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Available Until:</td>
                                    <td>{new Date(houseDetails.availableAtEnd).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Type Advertisement:</td>
                                    <td>{houseDetails.businessType}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Last Updated:</td>
                                    <td>{new Date(houseDetails.updatedAt).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Created At:</td>
                                    <td>{calculateDaysPassed(houseDetails.createdAt)} days ago</td>
                                </tr>
                            </tbody>
                        </table>
                        <SendMessage />
                    </div>
                </div>
            ) : (
                <p className="text-lg">House not found.</p>
            )}
        </div>
    );
};

const HouseDetailsPage = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <HouseDetailsComponent />
    </Suspense>
);

export default HouseDetailsPage;
