'use client'
import { BsGoogle } from "react-icons/bs";
import { FaApple } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function Signin() {
    const router = useRouter()

    const handleEmail = () => {
        router.push('/auth/signin/email')
    }

    return (
        <div>
            
            <main className="w-full max-w-md mx-auto mt-10 px-4 flex flex-col items-start gap-4">
                <img src="/logo.png" alt="Logo" className="w-[200px] mb-10 self-center"/>
                <h1 className="font-bold text-2xl">Sign in or create your account.</h1>
                <h4 className="text-sm my-5">OpenDoors, Open Minds. Find Your Irish Home Now.</h4>
                <button className="w-full bg-red-700 p-4 rounded-md hover:bg-red-900 flex items-center justify-center gap-4 text-white" disabled>
                    <BsGoogle /> Sign In With Google 
                </button>
                <button className="w-full bg-gray-100 p-4 rounded-md hover:bg-gray-200 flex items-center justify-center gap-4" disabled>
                    <FaApple /> Sign In With Apple
                </button>
                <button 
                    className="w-full bg-gray-100 p-4 rounded-md hover:bg-gray-200 flex items-center justify-center gap-4"
                    onClick={() => handleEmail()}    
                >
                    <MdEmail /> Sign In With Email
                </button>
                <div className=" w-full h-4 border-b-2"></div>
                <h1 className="text-xl font-bold">Are you new here?</h1>  <a href="/auth/register">Create an account.</a>
                <footer className="w-full text-center mt-4">
                    By continuing, you agree to the <a href="/terms-use" className="border-b-2">Terms of Use</a> and are aware of the <a href="/private-police" className="border-b-2">Privacy Policy</a>.
                </footer>
            </main>
        </div>
    )
}
