'use client'
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Env } from '@/lib/Env';
import { instance as axios } from '@/lib/axiosConfig';

export default function PropertyUpdateForm({ propertyId }: { propertyId: string }) {
    const [property, setProperty] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchProperty = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${Env.baseurl}/properties/${propertyId}`);

                if (response.status === 200) {
                    setProperty(response.data.data);
                } else {
                    toast.error('Failed to fetch property details');
                }
            } catch (error) {
                console.error('Error fetching property details:', error);
                toast.error('Failed to fetch property details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperty();
    }, [propertyId]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await axios.put(`${Env.baseurl}/properties/${propertyId}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setIsLoading(false);

            if (response.status === 200) {
                toast.success('Property updated successfully');
            } else {
                toast.error('Failed to update property');
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error updating property:', error);
            toast.error('Failed to update property');
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!property) {
        return <p>Property not found.</p>;
    }

    return (
        <div className="w-full flex flex-col p-10 gap-10">
            <h1 className="text-2xl font-bold">Update Property</h1>
            <form className="flex flex-col gap-4 w-full mx-auto" onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    placeholder="Property Title"
                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                    name="title"
                    id="title"
                    defaultValue={property.title}
                />
                <label htmlFor="description">Description</label>
                <textarea
                    placeholder="Property Description"
                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                    name="description"
                    id="description"
                    defaultValue={property.description}
                ></textarea>
                {/* Adicionar mais campos de formulário conforme necessário */}
                <button className="p-4 bg-sky-700 text-white w-full rounded-md hover:bg-sky-900">
                    Update Property
                </button>
            </form>
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
