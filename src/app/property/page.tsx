'use client'
import { useEffect, useState, FormEvent } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Env } from "@/lib/Env";
import { instance as axios } from "@/lib/axiosConfig";
import 'react-toastify/dist/ReactToastify.css';

type ApiResponse<T> = {
    status: 'success' | 'error';
    message: string;
    data?: T;
    error?: string;
};

type Property = {
    publicId: string;
    title: string;
    description: string;
    address: string;
    // Adicione outros campos conforme necessário
};

export default function Page() {
    const [userid, setUserId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [propertyId, setPropertyId] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        const id = localStorage.getItem("id");
        if (id) {
            setUserId(id);
        }
    }, []);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get<ApiResponse<Property[]>>(`${Env.baseurl}/properties`);
                if (response.data.status === 'success') {
                    setProperties(response.data.data || []);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error: any) {
                console.error('Error fetching properties:', error);
                toast.error(error.response?.data?.message || 'Failed to fetch properties');
            }
        };

        fetchProperties();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        data.externalArea = formData.get('externalArea') === 'on' ? 'true' : 'false';

        const requiredFields = [
            'title', 'description', 'address', 'neighborhood', 'city', 'county', 
            'price', 'propertyType', 'rooms', 'capacity', 'toilets'
        ];

        for (const field of requiredFields) {
            if (!data[field]) {
                setIsLoading(false);
                return toast.error(`${field} is required`);
            }
        }

        try {
            const response = await axios.post<ApiResponse<Property>>(`${Env.baseurl}/properties/new`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setIsLoading(false);

            if (response.data.status === 'success') {
                toast.success(response.data.message);
                setPropertyId(response.data.data!.publicId);
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            setIsLoading(false);
            console.error('Error registering property:', error);
            toast.error(error.response?.data?.message || 'Failed to register property');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(event.target.files);
            setErrorMessage(null);
        }
    };

    const handleFileUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedFiles && propertyId) {
            let anyFileTooLarge = false;
            const maxFileSize = 3 * 1024 * 1024;

            const formData = new FormData();
            formData.append('publicId', propertyId);
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                if (file.size > maxFileSize) {
                    anyFileTooLarge = true;
                    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                    setErrorMessage(`File "${file.name}" (${fileSizeInMB}MB) exceeds the maximum allowable size of 3MB.`);
                    break;
                }
                formData.append('files', file);
            }

            if (anyFileTooLarge) {
                return;
            }

            try {
                const response = await axios.post<ApiResponse<any>>(`${Env.baseurl}/uploads/multiplefiles/${propertyId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.status === 'success') {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }

                console.log('Upload successful:', response.data);
            } catch (error: any) {
                console.error('Error uploading files:', error);
                toast.error(error.response?.data?.message || 'Failed to upload files');
            }
        } else {
            console.error('No files selected or property ID missing.');
        }
    };

    const propertyTypes = [
        { value: 'FLAT', label: 'Flat' },
        { value: 'HOUSE', label: 'House' },
        { value: 'SINGLEROOM', label: 'Single Room' },
        { value: 'SHAREDROOM', label: 'Shared Room' },
        { value: 'DOUBLEROOM', label: 'Double Room' },
    ];

    const counties = [
        "Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry",
        "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth",
        "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary",
        "Waterford", "Westmeath", "Wexford", "Wicklow"
    ];

    const removeFile = (index: number) => {
        if (selectedFiles) {
            const filesArray = Array.from(selectedFiles);
            filesArray.splice(index, 1);
            const newFileList = new DataTransfer();
            filesArray.forEach(file => newFileList.items.add(file));
            setSelectedFiles(newFileList.files);
        }
    };


    return (
        <div className="w-full flex flex-col p-10 gap-10">
            <h1 className="text-2xl font-bold">New Property</h1>
            <form className="flex flex-col gap-4 w-full mx-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                    <div className="flex flex-col gap-4 w-full lg:w-1/2">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            placeholder="Property Title"
                            className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                            name="title"
                            id="title"
                        />
                        <label htmlFor="description">Description</label>
                        <textarea
                            placeholder="Property Description"
                            className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                            name="description"
                            id="description"
                        ></textarea>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-4 w-full md:w-1/2">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    placeholder="256 Main Street"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="address"
                                    id="address"
                                />
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-1/2">
                                <label htmlFor="neighborhood">Neighborhood</label>
                                <input
                                    type="text"
                                    placeholder="Center"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="neighborhood"
                                    id="neighborhood"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-4 w-full md:w-1/2">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    placeholder="Cork"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="city"
                                    id="city"
                                />
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-1/2">
                                <label htmlFor="county">County</label>
                                <select
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="county"
                                    id="county"
                                >
                                    {counties.map((county) => (
                                        <option key={county} value={county}>{county}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="EIRCODE"
                            className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                            name="postcode"
                            id="postcode"
                        />
                        <input
                            type="text"
                            placeholder="Ireland"
                            className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                            name="country"
                            id="country"
                            disabled
                            value="Ireland"
                        />
                        <label htmlFor="businessType">Business Type</label>
                        <select name="businessType" id="businessType" className="border border-gray-300 p-4 w-full outline-none focus:shadow-md">
                            <option value="RENT">Rent</option>
                            <option value="SELL">Sell</option>
                        </select>
                        
                    </div>

                    <div className="flex flex-col gap-4 w-full lg:w-1/2">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-4 w-full md:w-1/2">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    placeholder="Price"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="price"
                                    id="price"
                                    min="0"
                                />
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-1/2">
                                <label htmlFor="propertyType">Property Type</label>
                                <select
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="propertyType"
                                    id="propertyType"
                                >
                                    {propertyTypes.map((type) => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-4 w-full md:w-1/3">
                                <label htmlFor="rooms">Rooms</label>
                                <input
                                    type="number"
                                    placeholder="Number of Rooms"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="rooms"
                                    id="rooms"
                                    min="0"
                                />
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-1/3">
                                <label htmlFor="capacity">Capacity</label>
                                <input
                                    type="number"
                                    placeholder="Capacity"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="capacity"
                                    id="capacity"
                                    min="0"
                                />
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-1/3">
                                <label htmlFor="toilets">Toilets</label>
                                <input
                                    type="number"
                                    placeholder="Number of Toilets"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="toilets"
                                    id="toilets"
                                    min="0"
                                />
                            </div>
                        </div>

                        <label htmlFor="externalArea" className="flex items-center my-4">
                            <input
                                type="checkbox"
                                className="mr-2"
                                name="externalArea"
                                id="externalArea"
                            />
                            External Area
                        </label>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-4 w-full md:w-1/2">
                                <label htmlFor="electricityFee">Electricity Fee</label>
                                <input
                                    type="number"
                                    placeholder="Electricity Fee"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="electricityFee"
                                    id="electricityFee"
                                    min="0"
                                />
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-1/2">
                                <label htmlFor="wifiFee">WiFi Fee</label>
                                <input
                                    type="number"
                                    placeholder="WiFi Fee"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="wifiFee"
                                    id="wifiFee"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-4 w-full md:w-1/2">
                                <label htmlFor="rubbishFee">Rubbish Fee</label>
                                <input
                                    type="number"
                                    placeholder="Rubbish Fee"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="rubbishFee"
                                    id="rubbishFee"
                                    min="0"
                                />
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-1/2">
                                <label htmlFor="depositFee">Deposit Fee</label>
                                <input
                                    type="number"
                                    placeholder="Deposit Fee"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="depositFee"
                                    id="depositFee"
                                    min="0"
                                />
                            </div>
                        </div>

                        <label htmlFor="timeRefundDeposit">Time Refund Deposit</label>
                        <input
                            type="number"
                            placeholder="Time Refund Deposit"
                            className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                            name="timeRefundDeposit"
                            id="timeRefundDeposit"
                            min="0"
                        />

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-4 w-full md:w-1/2">
                                <label htmlFor="availableAtInit">Available At Init</label>
                                <input
                                    type="datetime-local"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="availableAtInit"
                                    id="availableAtInit"
                                />
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-1/2">
                                <label htmlFor="availableAtEnd">Available At End</label>
                                <input
                                    type="datetime-local"
                                    className="border border-gray-300 p-4 w-full outline-none focus:shadow-md"
                                    name="availableAtEnd"
                                    id="availableAtEnd"
                                />
                            </div>
                        </div>
                        <input type="hidden" name="userId" value={userid} />
                        <button className="p-4 bg-sky-700 text-white w-full rounded-md hover:bg-sky-900">
                            {isLoading ? 'Registering...' : 'Register Property'}
                        </button>
                    </div>
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
            </form>

            {propertyId && (
                <form onSubmit={handleFileUpload} className="flex flex-col items-center p-4 border-2 border-dashed border-blue-400 rounded-lg bg-white shadow-lg">
                <input type="hidden" name="publicId" value="propertyId" />
                <div className="flex flex-col items-center justify-center w-full h-48 cursor-pointer" onClick={() => document.getElementById('fileInput')?.click()}>
                    <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.88 3.549a.999.999 0 00-1.39-.282L10 7.588 4.51 3.267A1 1 0 003.118 4.51l5 4.318V15a1 1 0 102 0v-6.172l4.882-4.048a.998.998 0 00.278-1.39z"></path>
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Browse Files to upload</p>
                </div>
                <input
                    id="fileInput"
                    type="file"
                    name="files"
                    onChange={handleFileChange}
                    multiple
                    accept="image/jpeg, image/png"
                    className="hidden"
                />
                <div className="w-full mt-4 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 12a4 4 0 100-8 4 4 0 000 8zm-2 2a6 6 0 0112 0v1H6v-1zm9 1h3v2H2v-2h3v-1a6 6 0 0112 0v1z"></path>
                        </svg>
                        <span className="text-sm text-gray-500">
                            {selectedFiles ? `${selectedFiles.length} file(s) selected` : "No selected File"}
                        </span>
                    </div>
                    {selectedFiles && (
                        <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => setSelectedFiles(null)}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 011-1h6a1 1 0 011 1v1h1a2 2 0 012 2v1H4V4a2 2 0 012-2h1V2zm2 5a1 1 0 012 0v8a1 1 0 11-2 0V7zm4 0a1 1 0 112 0v8a1 1 0 11-2 0V7z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    )}
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">Upload</button>
            </form>
            
            )}
            {selectedFiles && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from(selectedFiles).map((file, index) => (
                        <div key={index} className="relative">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-32 object-cover rounded-md shadow-md"
                            />
                            <button
                                type="button"
                                className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1 hover:text-red-700"
                                onClick={() => removeFile(index)}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 011-1h6a1 1 0 011 1v1h1a2 2 0 012 2v1H4V4a2 2 0 012-2h1V2zm2 5a1 1 0 012 0v8a1 1 0 11-2 0V7zm4 0a1 1 0 112 0v8a1 1 0 11-2 0V7z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
    );
}