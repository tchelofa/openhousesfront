'use client'
import { Env } from '@/lib/Env'
import { instance as axios } from '@/lib/axiosConfig';
import { SpinningCircles } from 'react-loading-icons'
import { FormEvent, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EmailSignIn() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [email, setEmail ] = useState<string>("")

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const formProps = Object.fromEntries(formData.entries())

        if (!formProps.email) {
            setIsLoading(false)
            return toast.error('Email is required')
        }

        const userEmail = formProps.email.toString()
        setEmail(userEmail)

        try {
            const response = await axios.get(`${Env.baseurl}/auth/recovery/${userEmail}`)
            toast.success(response.data.message)
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                toast.error('An error occurred. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <main className="w-full max-w-lg mx-auto mt-10 px-4 flex flex-col items-start gap-4">
                <img src="/logo2.png" alt="Logo" className="w-[200px] mb-10" />
                <h1 className="font-bold text-2xl">Recover your password</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        placeholder='name@example.com' 
                        id="email" 
                        name="email" 
                        className='border border-gray-300 p-4 w-full outline-none focus:shadow-md' 
                        required 
                    />
                    <button 
                        type="submit"
                        className='p-4 bg-sky-700 text-white w-full rounded-md hover:bg-sky-900 flex items-center justify-center'
                        disabled={isLoading}
                    >
                        { !isLoading ? "Send Email" : <SpinningCircles className='w-5 h-5' /> }
                    </button>
                    <div>
                        <a href="/auth/signin">Already have an account? Sign In</a>
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
    )
}
