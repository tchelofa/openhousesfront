'use client';
import { useEffect, useState } from 'react';
import { instance as axios } from '@/lib/axiosConfig';
import { Env } from '@/lib/Env';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SyncLoader } from 'react-spinners';

interface FavoritesProps {
    userId: string;
    propertyId: string;
}

export default function Favorites({ userId, propertyId }: FavoritesProps) {
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const isFavoriteCheck = async () => {
            if (userId) {
                try {
                    setIsLoading(true);
                    const response = await axios.get<boolean>(`${Env.baseurl}/properties/checkFavorite/${propertyId}/${userId}`);
                    setIsFavorite(response.data);
                } catch (error) {
                    toast.error("Error: " + error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        isFavoriteCheck();
    }, [userId, propertyId]);

    const handleToggleFavorite = async () => {
        try {
            setIsLoading(true);
            const response = await axios.put<boolean>(`${Env.baseurl}/properties/toggleFavorite/${propertyId}/${userId}`);
            setIsFavorite(response.data);
        } catch (error) {
            toast.error("Error: " + error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-fit h-9">
            {isLoading ? (
                <div className="flex items-center justify-center ">
                    <SyncLoader size={5} color={"#c70000"} loading={isLoading} />
                </div>
            ) : (
                <div
                    className={`flex gap-2 items-center text-sm hover:cursor-pointer ${isFavorite ? 'text-red-700' : ''}`}
                    onClick={handleToggleFavorite}
                >
                    {isFavorite ? <GoHeartFill /> : <GoHeart />} Favorite
                </div>
            )}

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
