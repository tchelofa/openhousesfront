import { useState, useEffect } from 'react';
import { getMyConversations, getMyMessagesWith, sendMessage } from '@/services/messagesApi';
import { format } from 'date-fns';
import { MdOutlineMarkEmailRead, MdOutlineMarkEmailUnread } from "react-icons/md";

interface User {
    publicId: string;
    name: string;
    avatar?: string;
    online?: boolean;
    unreadMessagesCount?: number;
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
    const [loadingConversations, setLoadingConversations] = useState<boolean>(false);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
    const [sendingMessage, setSendingMessage] = useState<boolean>(false);

    useEffect(() => {
        if (userId) {
            const fetchConversations = async () => {
                setLoadingConversations(true);
                try {
                    const response = await getMyConversations(userId);
                    setConversations(response.data.data);
                } catch (error) {
                    console.error("Failed to fetch conversations:", error);
                } finally {
                    setLoadingConversations(false);
                }
            };

            fetchConversations();
        }
    }, [userId]);

    const openChat = async (contactId: string, contactName: string) => {
        if (userId) {
            setLoadingMessages(true);
            try {
                const response = await getMyMessagesWith(userId, contactId);
                setMessages(response.data.data);
                setCurrentChat(contactId);
                setCurrentContactName(contactName);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setLoadingMessages(false);
            }
        }
    };

    const handleSendMessage = async () => {
        if (userId && newMessage.trim() !== '') {
            setSendingMessage(true);
            try {
                await sendMessage({ userFromId: userId, userToId: currentChat!, message: newMessage });
                setNewMessage('');
                openChat(currentChat!, currentContactName); // Refresh messages
            } catch (error) {
                console.error("Failed to send message:", error);
            } finally {
                setSendingMessage(false);
            }
        }
    };

    return (
        <div className="flex h-[calc(100vh-88.52px)] w-screen">
            <div className="w-1/3 shadow-md bg-[#111b21] text-white overflow-y-auto border-r border-[#222d34]">
                {loadingConversations ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="loader"></div>
                    </div>
                ) : (
                    conversations.map((conversation) => (
                        <div
                            key={conversation.publicId}
                            className="flex items-center p-4 cursor-pointer hover:bg-[#202c33] border-b border-[#222d34]"
                            onClick={() => openChat(conversation.publicId, conversation.name)}
                        >
                            <div className="font-bold flex justify-between items-center w-full">
                                <div>{conversation.name}</div>
                                <div>
                                {conversation.unreadMessagesCount && conversation.unreadMessagesCount > 0 ? (
                                    <div className="ml-2 text-sm bg-[#005c4b] text-white rounded-full w-10 h-10 flex items-center justify-center">
                                        {conversation.unreadMessagesCount}
                                    </div>
                                ):(
                                    ""
                                )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {currentChat && (
                <div className="w-2/3 flex flex-col">
                    <div className="p-4 shadow-inner bg-[#202c33]">
                        <h2 className="text-xl text-white font-bold">{currentContactName}</h2>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto bg-[#121b21]">
                        {loadingMessages ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="loader"></div>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.publicId}
                                    className={`mb-4 ${message.userFrom.publicId === userId ? 'text-right' : 'text-left'}`}
                                >
                                    <div
                                        className={`inline-block p-3 rounded-lg max-w-xs ${message.userFrom.publicId === userId ? 'bg-[#005c4b] text-white' : 'bg-[#202c33] text-white'
                                            }`}
                                    >
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col'>
                                                <div>{message.message}</div>
                                                <div className='text-sm flex items-center gap-2 justify-end min-w-40'>
                                                    <div className='text-xs'>{format(new Date(message.createdAt), 'MMMM dd - HH:mm')}</div>
                                                    <div className='italic'>
                                                        {
                                                            message.status == "READ" ? <MdOutlineMarkEmailRead className='h-5 w-5' /> : <MdOutlineMarkEmailUnread className='h-5 w-5' />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 flex flex-col gap-4 sm:flex-row bg-[#202c33]">
                        <input
                            type="text"
                            className="flex-1 p-4 rounded-lg outline-none bg-[#2a3942]"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Enter your message here"
                            disabled={sendingMessage}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !sendingMessage) {
                                    e.preventDefault(); // Evita a quebra de linha ao pressionar Enter
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button
                            className={`ml-2 p-2 px-5 rounded-lg text-white ${sendingMessage ? 'bg-gray-500' : 'bg-[#005c4b] hover:bg-[#257567]'}`}
                            onClick={handleSendMessage}
                            disabled={sendingMessage}
                        >
                            {sendingMessage ? (
                                <div className="loader"></div>
                            ) : (
                                "Send"
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
