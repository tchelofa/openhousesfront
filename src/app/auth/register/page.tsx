'use client';
import { instance as axios } from "@/lib/axiosConfig";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Env } from '../../../lib/Env';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAxiosError } from "axios";

export default function EmailSignIn() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formProps = Object.fromEntries(formData.entries());

        if (!formProps.name) {
            setIsLoading(false);
            return toast.error('Name is required');
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
            <main className="w-full max-w-lg mx-auto mt-10 px-4 flex flex-col items-start gap-4">
                <img src="/logo2.png" alt="Logo" className="w-[200px] mb-10" />
                <h1 className="font-bold text-2xl">Register your new account.</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    <label htmlFor="name">Name</label>
                    <input type="text" placeholder='First and Last Name' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md' name="name" id="name" />
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder='name@example.com' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md' name="email" id="email" />
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder='Minimun 6 characters' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md' name="password" id="password" />
                    <label htmlFor="mobile">Mobile</label>
                    <input type="text" placeholder='Your mobile number' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md' name="mobile" id="mobile" />
                    <button className='p-4 bg-sky-700 text-white w-full rounded-md hover:bg-sky-900'>Register</button>
                    <div>
                        Already have an account? <a href="/auth/signin">Sign In</a>
                    </div>
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
            </main>
        </>
    );
}
