'use client';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Env } from '@/lib/Env';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

interface SendMessageProps {
    propertyOwnerId: string; // ID do proprietário da propriedade
}

export default function SendMessage({ propertyOwnerId }: SendMessageProps) {
    const router = useRouter()
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    useEffect(() => {
        const userIdFromLocalStorage = localStorage.getItem("id");
        if (userIdFromLocalStorage) {
            setUserId(userIdFromLocalStorage);
        }

    }, []);

    const openModal = () => {
        if (!userId) {
            toast.error('Please sign in to send a message.');
            return;
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSendMessage = async () => {
        if (!message.trim()) {
            toast.error('Message cannot be empty.');
            return;
        }

        try {
            const response = await axios.post(`${Env.baseurl}/messages/send`, {
                userFromId: userId,
                userToId: propertyOwnerId,
                message
            });
            console.log(userId, propertyOwnerId, message)

            if (response.status === 200) {
                toast.success('Message sent successfully.');
                setMessage('');
                closeModal();
            } else {
                toast.error('Failed to send message.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Error sending message.');
        }
    };

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
                    }
                })
                .catch((error) => {
                    console.error('Token verification failed', error)
                    localStorage.removeItem('token')
                    localStorage.removeItem('id')
                })
        }
    }, [])

    return (
        <>
            {isAuthenticated ? (
                <button
                    className="bg-sky-800 text-white p-2 my-4 rounded-md cursor-pointer"
                    onClick={openModal}
                >
                    Send Message
                </button>
            ) : (
                <p className='bg-red-800 text-white p-4 my-4'>Please sign in to send a message.</p>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                ariaHideApp={false}
                contentLabel="Send Message"
                className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10 z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <h2 className="text-xl font-bold mb-4">Send Message</h2>
                <textarea
                    className="w-full border p-2 rounded-md mb-4"
                    rows={5}
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button
                    className="bg-sky-800 text-white p-2 rounded-md cursor-pointer"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
                <button
                    className="bg-gray-500 text-white p-2 rounded-md cursor-pointer ml-4"
                    onClick={closeModal}
                >
                    Cancel
                </button>
            </Modal>
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
        </>
    );
}
