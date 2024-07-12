'use client';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import LinkHeader from "./LinkHeader";
import { TiHeartOutline } from "react-icons/ti";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { RiMessageLine } from "react-icons/ri";
import { BsHouses } from "react-icons/bs";
import axios from "axios";
import { Env } from "@/lib/Env";

interface PropertySchema {
    id: number;
    publicId: string;
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
    userId: string;
    updatedAt: string;
    createdAt: string;
}

type ApiResponse<T> = {
    status: 'success' | 'error';
    message: string;
    data?: T;
    error?: string;
};

export default function Header() {
    const router = useRouter();
    const [activeItem, setActiveItem] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [rentCities, setRentCities] = useState<string[]>([]);
    const [sellCities, setSellCities] = useState<string[]>([]);

    const menuRef = useRef<HTMLDivElement>(null);

    const handleClick = (id: string) => {
        if (activeItem === id) {
            setActiveItem("");
        } else {
            setActiveItem(id);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setActiveItem("");
        }
    };

    const handleSignIn = () => {
        router.push('/auth/signin');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        setUserName(null);
        router.push('/');
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const id = localStorage.getItem("id")
                    const tokenResponse = await axios.post(`${Env.baseurl}/auth/token-validate`, { token }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (tokenResponse.status === 200) {
                        const userResponse = await axios.get(`${Env.baseurl}/users/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        setUserName(userResponse.data.name);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    localStorage.removeItem('token');
                }
            }
        };

        fetchUserData();

    }, []);

    const fetchCities = async (businessType: 'RENT' | 'SELL') => {
        try {
            const response = await axios.get<ApiResponse<PropertySchema[]>>(`${Env.baseurl}/properties/filtered`, {
                params: {
                    searchTerm: '',  // This can be adjusted if you need a specific search term
                    businessType
                }
            });
            const properties = response.data.data;

            if (Array.isArray(properties)) {
                const uniqueCities = Array.from(new Set(properties.map(property => property.city)));
                if (businessType === 'RENT') {
                    setRentCities(uniqueCities);
                } else if (businessType === 'SELL') {
                    setSellCities(uniqueCities);
                }
            } else {
                console.error('Response data is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    useEffect(() => {
        fetchCities('RENT');
        fetchCities('SELL');
    }, []);

    return (
        <header className="p-4 shadow-md flex items-center justify-between">
            <div>
                <a href="/"><img src="/logo.png" alt="Logo" className="w-64" /></a>
            </div>
            <div className="md:hidden">
                <button onClick={() => setSidebarOpen(true)}>
                    <FaBars className="w-6 h-6" />
                </button>
            </div>
            <nav className="hidden md:flex items-center gap-4" ref={menuRef}>
                <LinkHeader title="RENT" onClick={() => handleClick("RENT")}>
                    <div id="RENT" className={activeItem === "RENT" ? `p-10 absolute top-16 left-0 w-[400px] bg-white shadow-md z-40` : `hidden`}>
                        <h1 className="font-bold text-xl border-b-2 border-gray-200 mb-4">City</h1>
                        <ul className="flex flex-col gap-8">
                            {rentCities.map(city => (
                                <li key={city}><a href={`/property/filter/?searchTerm=${city}&businessType=RENT`}>{city}</a></li>
                            ))}
                        </ul>
                    </div>
                </LinkHeader>
                <LinkHeader title="SELL" onClick={() => handleClick("SELL")}>
                    <div id="SELL" className={activeItem === "SELL" ? `p-10 absolute top-16 left-0 w-[400px] bg-white shadow-md z-40` : `hidden`}>
                        <h1 className="font-bold text-xl border-b-2 border-gray-200 mb-4">City</h1>
                        <ul className="flex flex-col gap-8">
                            {sellCities.map(city => (
                                <li key={city}><a href={`/property/filter/?searchTerm=${city}&businessType=SELL`}>{city}</a></li>
                            ))}
                        </ul>
                    </div>
                </LinkHeader>

                <LinkHeader title="ADVERTISE" onClick={() => handleClick("ADVERTISE")}>
                    <div id="ADVERTISE" className={activeItem == "ADVERTISE" ? `p-10 absolute top-16 left-0 w-[400px] bg-white shadow-md z-40` : `hidden`}>
                        <h1 className="font-bold text-xl border-b-2 border-gray-200 mb-4">Advertise on OpenHouses</h1>
                        <ul className="flex flex-col gap-8">
                            <li><a href="/auth/register/advertisor">Advertise Houses</a></li>
                            <li><a href="/auth/register/advertisor">Advertise Flats</a></li>
                            <li><a href="/auth/register/advertisor">Advertise Single Room</a> </li>
                            <li><a href="/auth/register/advertisor">Advertise Shared Room</a> </li>
                            <li><a href="/auth/register/advertisor">Advertise Double Room</a> </li>
                        </ul>
                    </div>
                </LinkHeader>
                <LinkHeader title="USEFULL LINKS" onClick={() => handleClick("USEFULL")}>
                    <div id="USEFULL" className={activeItem == "USEFULL" ? `p-10 absolute top-16 left-0 min-w-52 bg-white shadow-md z-40` : `hidden`}>
                        <h1 className="font-bold text-xl border-b-2 border-gray-200 mb-4">Utilities</h1>
                        <ul className="flex flex-col gap-8">
                            <li><a href="https://www.rtb.ie" target="_blank">Residential Tenancies Board</a></li>
                        </ul>
                    </div>
                </LinkHeader>
                <LinkHeader title="HELP" onClick={() => handleClick("HELP")}>
                    <div id="HELP" className={activeItem == "HELP" ? `p-10 absolute top-16 left-0 min-w-64 bg-white shadow-md z-40` : `hidden`}>
                        <h1 className="font-bold text-xl border-b-2 border-gray-200 mb-4">Ask your questions</h1>
                        <ul className="flex flex-col gap-8">
                            <li><a href="/use-terms">Use Terms</a></li>
                            <li>Frequently Asked Questions</li>
                            <li>About OpenHouses</li>
                        </ul>
                    </div>
                </LinkHeader>
                <LinkHeader signin={true} title={userName ? userName : "SIGN IN"} onClick={() => handleClick("SIGNIN")}>
                    <div id="SIGNIN" className={activeItem == "SIGNIN" ? `p-10 absolute top-16 right-0 min-w-96 bg-white shadow-md z-50` : `hidden`}>
                        {userName ? (
                            <>
                                <h4 className="text-sm mb-4">Welcome, {userName}</h4>
                                <button className="bg-red-600 text-white w-full p-4 mb-4 rounded-md hover:bg-red-800" onClick={handleLogout}>Logout</button>
                                <ul className="flex flex-col gap-8">
                                    <li className="flex items-center gap-4"><TiHeartOutline /> <a href="/favorites">Favorites and Lists</a></li>
                                    <li className="flex items-center gap-4"><HiOutlineBellAlert />Alerts Created</li>
                                    <li className="flex items-center gap-4"><BsHouses /> <a href="/property/myproperties">My Properties</a></li>
                                    <li className="flex items-center gap-4"><RiMessageLine /> <a href="/messages">Messages</a></li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <h4 className="text-sm mb-4">Log in to see your favorites, visits, proposals and rentals</h4>
                                <button className="bg-sky-700 text-white w-full p-4 mb-4 rounded-md hover:bg-sky-900" onClick={handleSignIn}>Sign In / Register</button>
                                <ul className="flex flex-col gap-8">
                                </ul>
                            </>
                        )}
                    </div>
                </LinkHeader>
            </nav>
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden overflow-auto" onClick={() => setSidebarOpen(false)}>
                    <div className="fixed inset-y-0 left-0 w-2/3 bg-white shadow-md p-4 overflow-y-auto" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <img src="/logo.png" alt="Logo" className="w-48" />
                            <button onClick={() => setSidebarOpen(false)}>
                                <FaTimes className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-4  overflow-y-auto">
                            <LinkHeader title="RENT" onClick={() => handleClick("RENT")}>
                                <div id="RENT" className={activeItem === "RENT" ? `p-4 bg-white shadow-md` : `hidden`}>
                                    <h1 className="font-bold text-xl border-b-2 border-gray-200 mb-4">City</h1>
                                    <ul className="flex flex-col gap-8">
                                        {rentCities.map(city => (
                                            <li key={city}><a href={`/property/filter/?searchTerm=${city}&businessType=RENT`}>{city}</a></li>
                                        ))}
                                    </ul>
                                </div>
                            </LinkHeader>
                            <LinkHeader title="SELL" onClick={() => handleClick("SELL")}>
                                <div id="SELL" className={activeItem === "SELL" ? `p-4 bg-white shadow-md` : `hidden`}>
                                    <h1 className="font-bold text-xl border-b-2 border-gray-200 mb-4">City</h1>
                                    <ul className="flex flex-col gap-8">
                                        {sellCities.map(city => (
                                            <li key={city}><a href={`/property/filter/?searchTerm=${city}&businessType=SELL`}>{city}</a></li>
                                        ))}
                                    </ul>
                                </div>
                            </LinkHeader>
                            <LinkHeader title="ADVERTISE" onClick={() => handleClick("ADVERTISE")}>
                                <div id="ADVERTISE" className={activeItem == "ADVERTISE" ? `p-4 bg-white shadow-md` : `hidden`}>
                                    <h1 className="font-bold text-xl border-b-2 border-gray-200 mb-4">Advertise on OpenHouses</h1>
                                    <ul className="flex flex-col gap-4">
                                        <li><a href="/auth/register/advertisor">Advertise Houses</a></li>
                                        <li><a href="/auth/register/advertisor">Advertise Flats</a></li>
                                        <li><a href="/auth/register/advertisor">Advertise Single Room</a> </li>
                                        <li><a href="/auth/register/advertisor">Advertise Shared Room</a> </li>
                                        <li><a href="/auth/register/advertisor">Advertise Double Room</a> </li>
                                    </ul>
                                </div>
                            </LinkHeader>
                            <LinkHeader title="USEFUL LINKS" onClick={() => handleClick("USEFULL")}>
                                <div id="USEFULL" className={activeItem == "USEFULL" ? `p-4 bg-white shadow-md` : `hidden`}>
                                    <h1 className="font-bold text-xl border-b-2 border-gray-200 mb-4">Utilities</h1>
                                    <ul className="flex flex-col gap-4">
                                        <li><a href="https://www.rtb.ie" target="_blank">Residential Tenancies Board</a></li>
                                    </ul>
                                </div>
                            </LinkHeader>
                            <LinkHeader title="HELP" onClick={() => handleClick("HELP")}>
                                <div id="HELP" className={activeItem == "HELP" ? `p-4 bg-white shadow-md` : `hidden`}>
                                    <h1 className="font-bold text-xl border-b-2 border-gray-200 mb-4">Help Center</h1>
                                    <ul className="flex flex-col gap-4">
                                        <li>Frequently Asked Questions</li>
                                        <li>About OpenHouses</li>
                                    </ul>
                                </div>
                            </LinkHeader>
                            <LinkHeader signin={true} title={userName ? userName : "SIGN IN"} onClick={() => handleClick("SIGNIN")}>
                                <div id="SIGNIN" className={activeItem == "SIGNIN" ? `p-4 bg-white shadow-md` : `hidden`}>
                                    {userName ? (
                                        <>
                                            <h4 className="text-sm mb-4">Welcome, {userName}</h4>
                                            <button className="bg-red-600 text-white w-full p-4 mb-4 rounded-md hover:bg-red-800" onClick={handleLogout}>Logout</button>
                                            <ul className="flex flex-col gap-4">
                                                <li className="flex flex-row gap-1 items-center space-around"><TiHeartOutline /> <a href="/favorites">Favorites and Lists</a></li>
                                                <li className="flex flex-row gap-1 items-center space-around"><HiOutlineBellAlert /> Alerts Created</li>
                                                <li className="flex flex-row gap-1 items-center space-around"><BsHouses /> <a href="/property/myproperties">My Properties</a></li>
                                                <li className="flex flex-row gap-1 items-center space-around"><RiMessageLine /> <a href="/messages">Messages</a></li>
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="text-sm mb-4">Log in to see your favorites, visits, proposals and rentals</h4>
                                            <button className="bg-sky-700 text-white w-full p-4 mb-4 rounded-md hover:bg-sky-900" onClick={handleSignIn}>Sign In / Register</button>
                                            <ul className="flex flex-col gap-4">

                                            </ul>
                                        </>
                                    )}
                                </div>
                            </LinkHeader>
                        </nav>
                    </div>
                </div>
            )}

        </header>
    );
}
