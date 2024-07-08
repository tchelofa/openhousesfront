import { IoArrowBackSharp } from "react-icons/io5";

export default function SignInHeader() {
    return (
        <header className="w-full h-20 shadow-md flex items-center p-4">
            <a href="/"className="w-16 h-16 rounded-full flex items-center justify-center text-2xl hover:bg-gray-100 transition ease-in-out hover:transition-all duration-300">
                <IoArrowBackSharp  className="text-gray-700"/>
            </a>
        </header>
    )
}