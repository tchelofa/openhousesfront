'use client'
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { instance as axios } from '@/lib/axiosConfig';
import { SpinningCircles } from 'react-loading-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Env } from '@/lib/Env';

export default function ChangePassword() {
    const params = useParams();
    const router = useRouter();
    const token = Array.isArray(params.token) ? params.token[0] : params.token;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [rpPassword, setRpPassword] = useState<string>('');

    useEffect(() => {
        if (token) {
            validateToken(token);
        }
    }, [token]);

    const validateToken = async (token: string) => {
        try {
            const response = await axios.get(`${Env.baseurl}/auth/validatedRecoveryPassword/${token}`);
            if (response.status === 200) {
                setIsTokenValid(true);
            }
        } catch (error: any) {
            toast.error('Invalid or expired token');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== rpPassword) {
            return toast.error('Passwords do not match');
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${Env.baseurl}/auth/reset-password`, { token, password });
            toast.success('Password reset successful');
            router.push('/auth/signin');
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <main className="w-full max-w-lg mx-auto mt-10 px-4 flex flex-col items-center">
                <SpinningCircles className='w-10 h-10' />
            </main>
        );
    }

    return (
        <>
            <main className="w-full max-w-lg mx-auto mt-10 px-4 flex flex-col items-start gap-4">
                <img src="/logo2.png" alt="Logo" className="w-[200px] mb-10" />
                <h1 className="font-bold text-2xl">Change your password</h1>
                {isTokenValid ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                        <label htmlFor="password">New Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder='Minimum 6 characters' 
                            className='border border-gray-300 p-4 w-full outline-none focus:shadow-md' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        <label htmlFor="rpPassword">Repeat Password</label>
                        <input 
                            type="password" 
                            name="rpPassword" 
                            id="rpPassword" 
                            className='border border-gray-300 p-4 w-full outline-none focus:shadow-md' 
                            value={rpPassword}
                            onChange={(e) => setRpPassword(e.target.value)}
                            required 
                            placeholder='Repeat your password'
                        />
                        <button 
                            type="submit"
                            className='p-4 bg-sky-700 text-white w-full rounded-md hover:bg-sky-900'
                            disabled={isLoading}
                        >
                            { !isLoading ? "Reset Password" : <SpinningCircles className='w-5 h-5' /> }
                        </button>
                    </form>
                ) : (
                    <p>Invalid or expired token. Please try requesting a new password reset.</p>
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
            </main>
        </>
    );
}
