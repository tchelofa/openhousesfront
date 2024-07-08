'use client';
import { instance as axios } from "@/lib/axiosConfig";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Env } from '@/lib/Env';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAxiosError } from "axios";

export default function EmailSignIn() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            axios.post(`${Env.baseurl}/auth/token-validate`, { token }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    setIsAuthenticated(true)
                    router.push("/property")
                }
            })
            .catch((error) => {
                console.error('Token verification failed', error)
                localStorage.removeItem('token')
                localStorage.removeItem('id')
            })
        }
    }, [])
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formProps = Object.fromEntries(formData.entries());

        if (!formProps.name) {
            setIsLoading(false);
            return toast.error('Name is required');
        }

        if (!formProps.postcode) {
            setIsLoading(false);
            return toast.error('Eircode is required');
        }

        if (!formProps.address) {
            setIsLoading(false);
            return toast.error('Address is required');
        }

        if (!formProps.neighborhood) {
            setIsLoading(false);
            return toast.error('Neighboorhood is required');
        }
        if (!formProps.city) {
            setIsLoading(false);
            return toast.error('City is required');
        }

        if (!formProps.county) {
            setIsLoading(false);
            return toast.error('County is required');
        }

        if (!formProps.email) {
            setIsLoading(false);
            return toast.error('Email is required');
        }
        if (!formProps.password) {
            setIsLoading(false);
            return toast.error('Password is required');
        }
        if (!formProps.mobile) {
            setIsLoading(false);
            return toast.error('Mobile number is required');
        }

        try {
            await axios.post(`${Env.baseurl}/users/new`, formProps);
            router.push('/auth/signin');
        } catch (error: any) {
            if (isAxiosError(error) && error.response) {
                const { message, errors } = error.response.data;
                toast.error(message);
                if (errors) {
                    errors.forEach((err: any) => {
                        toast.error(`${err.path}: ${err.message}`);
                    });
                }
                console.error(errors);
            } else {
                toast.error('An unexpected error occurred.');
                console.error(error);
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <main className="w-full max-w-2xl mx-auto mt-10 px-4 flex flex-col items-start gap-4">
                <img src="/logo.png" alt="Logo" className="w-[200px] mb-10" />
                <h1 className="font-bold text-2xl">Register your new account.</h1>
                <form className="flex flex-col gap-4 w-full"  onSubmit={handleSubmit} >
                    <div className="flex flex-col lg:flex-row gap-4 w-full">
                        <div className="flex flex-col gap-4 w-full lg:w-1/2">
                            <label htmlFor="name">Name</label>
                            <input type="text" placeholder='First and Last Name' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md'  name="name" id="name"/>
                            <label htmlFor="email">Email</label>
                            <input type="text" placeholder='name@example.com' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md'  name="email" id="email"/>
                            <label htmlFor="password">Password</label>
                            <input type="password" placeholder='Minimum 6 characters' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md'  name="password" id="password"/>
                            <label htmlFor="mobile">Mobile</label>
                            <input type="text" placeholder='Your mobile number' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md'  name="mobile" id="mobile"/>
                            <label htmlFor="mobile">Eircode</label>
                            <input type="text" placeholder='Your mobile number' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md'  name="postcode" id="postcode"/>
                        </div>
                        <div className="flex flex-col gap-4 w-full lg:w-1/2">
                            <label htmlFor="address">Address</label>
                            <input type="text" placeholder='256 Main Street' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md'  name="address" id="address"/>
                            <label htmlFor="neighborhood">Neighborhood</label>
                            <input type="text" placeholder='Center' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md'  name="neighborhood" id="neighborhood"/>
                            <label htmlFor="city">City</label>
                            <input type="text" placeholder='Cork' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md'  name="city" id="city"/>
                            <label htmlFor="county">County</label>
                            <input type="text" placeholder='Co. Cork' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md'  name="county" id="county"/>
                            <input type="text" placeholder='Ireland' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md'  name="country" id="country" disabled />
                        </div>
                        <input type="hidden" name="accountType" value="ADVISOR" />
                    </div>
                    <button className='p-4 bg-sky-700 text-white w-full rounded-md hover:bg-sky-900'>Register</button>
                </form>
                <div className="mt-4">
                    Already have an account? <a href="/auth/signin" className="text-sky-700 hover:underline">Sign In</a>
                </div>
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
            </main>
        </>
    )
}
