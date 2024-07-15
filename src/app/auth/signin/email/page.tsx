'use client'
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import { instance as axios } from '@/lib/axiosConfig';
import { SpinningCircles } from 'react-loading-icons'
import { Env } from '@/lib/Env'

export default function EmailSignIn() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
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
                    router.push("/")
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
        setIsLoading(true)
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const formProps = Object.fromEntries(formData.entries())

        if (!formProps.email) {
            setIsLoading(false)
            return toast.error('Email is required')
        }
        if (!formProps.password) {
            setIsLoading(false)
            return toast.error('Password is required')
        }

        try {
            await axios.post(`${Env.baseurl}/auth/signin`, formProps)
                .then((response) => {
                    localStorage.setItem('token', response.data.token)
                    localStorage.setItem('id', response.data.id)
                    setIsAuthenticated(true)
                    router.push('/')
                })
                .catch((error) => {
                    if (error.response) {
                        toast.error(error.response.data.message)
                    }
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }

    return (
        <>
            <main className="w-full max-w-lg mx-auto mt-10 px-4 flex flex-col items-start gap-4">
                <img src="/logo2.png" alt="Logo" className="w-[200px] mb-10" />
                <h1 className="text-xl font-bold">Are you new here?</h1>  <a href="/auth/register">Create an account.</a>
                <div className=" w-full h-4 border-b-2"></div>
                <h1 className="font-bold text-2xl">Sign in with email.</h1>
                {isAuthenticated ? (
                    <div className="flex flex-col gap-4">
                        Redirecting....
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                        <label htmlFor="email">Email</label>
                        <input type="text" placeholder='name@example.com' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md' id='email' name='email' />
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder='Your password' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md' id='password' name='password'/>
                        <button className='p-4 bg-sky-700 text-white w-full rounded-md hover:bg-sky-900' type='submit'>
                            {isLoading ? <SpinningCircles className='w-5 h-5' /> : "Sign In"}
                        </button>
                        <div>
                            <a href="/auth/recovery">Forgot your password?</a>
                        </div>
                    </form>
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
    )
}
