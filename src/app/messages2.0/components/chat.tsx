import { useState, useEffect } from 'react';
import { getMyConversations, getMyMessagesWith, sendMessage, markMessageAsRead } from '@/services/messagesApi';
import { format } from 'date-fns';

interface User {
    publicId: string;
    name: string;
    avatar?: string;
    online?: boolean;
}

interface Message {
    publicId: string;
    message: string;
    status: string;
    userFrom: User;
    userTo: User;
    createdAt: string;
}

interface ChatProps {
    userId: string | null;
}

const Chat: React.FC<ChatProps> = ({ userId }) => {
    const [conversations, setConversations] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentChat, setCurrentChat] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState<string>('');
    const [currentContactName, setCurrentContactName] = useState<string>('');

    useEffect(() => {
        if (userId) {
            const fetchConversations = async () => {
                try {
                    const response = await getMyConversations(userId);
                    setConversations(response.data.data);
                } catch (error) {
                    console.error("Failed to fetch conversations:", error);
                }
            };

            fetchConversations();
        }
    }, [userId]);

    const openChat = async (contactId: string, contactName: string) => {
        if (userId) {
            try {
                const response = await getMyMessagesWith(userId, contactId);
                setMessages(response.data.data);
                setCurrentChat(contactId);
                setCurrentContactName(contactName);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        }
    };

    const handleSendMessage = async () => {
        if (userId && newMessage.trim() !== '') {
            try {
                await sendMessage({ userFromId: userId, userToId: currentChat!, message: newMessage });
                setNewMessage('');
                openChat(currentChat!, currentContactName); // Refresh messages
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        }
    };

    const handleMarkAsRead = async (messageId: string) => {
        try {
            await markMessageAsRead(messageId);
        } catch (error) {
            console.error("Failed to mark message as read:", error);
        }
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/3 bg-gray-800 text-white overflow-y-auto">
                {conversations.map((conversation) => (
                    <div
                        key={conversation.publicId}
                        className="flex items-center p-4 cursor-pointer hover:bg-gray-700"
                        onClick={() => openChat(conversation.publicId, conversation.name)}
                    >
                        <div>
                            <div className="font-bold">{conversation.name}</div>
                        </div>
                    </div>
                ))}
            </div>

            {currentChat && (
                <div className="w-2/3 flex flex-col">
                    <div className="p-4 bg-gray-100 border-b border-gray-300">
                        <h2 className="text-xl font-bold">Conversation with {currentContactName}</h2>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((message) => (
                            <div
                                key={message.publicId}
                                className={`mb-4 ${message.userFrom.publicId === userId ? 'text-right' : 'text-left'}`}
                                onClick={() => handleMarkAsRead(message.publicId)}
                            >
                                <div
                                    className={`inline-block p-3 rounded-lg max-w-xs ${message.userFrom.publicId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                        }`}
                                >
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-col'>
                                            <div>{message.message}</div>
                                            <div className='text-sm flex flex-col'>
                                                <div>{message.status}</div> <div>{format(new Date(message.createdAt), 'MMMM dd - HH:mm')}</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-100 border-t border-gray-300 flex">
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded-lg"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Enter your message here, please"
                        />
                        <button
                            className="ml-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
                            onClick={handleSendMessage}
                        >
                            SEND
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
