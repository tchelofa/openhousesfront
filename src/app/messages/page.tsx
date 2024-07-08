'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { instance as axios } from '@/lib/axiosConfig';
import { SpinningCircles } from 'react-loading-icons';
import { Env } from '@/lib/Env';
import io from 'socket.io-client';

interface Message {
  id: number;
  userFromId: string;
  userToId: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const publicId = localStorage.getItem("id");
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Fetch conversations when the component mounts
    axios.get(`${Env.baseurl}/messages/conversations`)
      .then(response => setConversations(response.data))
      .catch(error => console.error('Error fetching conversations:', error));
  }, []);

  useEffect(() => {
    if (publicId) {
      // Fetch messages for the selected conversation
      axios.get(`${Env.baseurl}/messages/conversations/${publicId}/messages`)
        .then(response => {
          setMessages(response.data);
          // Mark messages as read
          axios.patch(`${Env.baseurl}/messages/conversations/${publicId}/read`)
            .catch(error => console.error('Error marking messages as read:', error));
        })
        .catch(error => console.error('Error fetching messages:', error));
    }
  }, [publicId]);

  const handleSendMessage = () => {
    if (newMessage.trim() && publicId) {
      axios.post(`${Env.baseurl}/messages`, {
        userToId: publicId,
        message: newMessage
      })
        .then(response => {
          setMessages(prevMessages => [...prevMessages, response.data]);
          setNewMessage('');
          if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        })
        .catch(error => console.error('Error sending message:', error));
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <main className="w-screen h-[calc(100vh-88.52px)] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="flex flex-col w-full lg:w-1/3 h-[calc(100vh-88.52px)] border p-4 bg-gray-100 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map(conversation => (
            <div
              key={conversation.id}
              className="flex flex-col mb-4 border-b pb-4 cursor-pointer"
              onClick={() => router.push(`/messages?id=${conversation.id}`)}
            >
              <div className="font-bold">{conversation.name}</div>
              <div className="text-gray-500">{conversation.lastMessage}</div>
            </div>
          ))
        ) : (
          <div>You haven't started any conversations yet</div>
        )}
      </aside>

      {/* Chat Section */}
      <section className="flex flex-col w-full lg:w-2/3 h-[calc(100vh-88.52px)] border p-4">
        {publicId ? (
          <>
            {/* Chat Header */}
            <div className="border-b pb-4 mb-4">
              <h1 className="font-bold text-lg">Chat with {publicId}</h1>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto mb-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col mb-4 ${msg.userFromId === 'currentUserPublicId' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`p-4 rounded-lg max-w-xs ${msg.userFromId === 'currentUserPublicId' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    {msg.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getMessageStatusText(msg.status)}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t pt-4 flex items-center">
              <input
                type="text"
                className="border border-gray-300 p-2 w-full rounded-lg outline-none"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white p-2 rounded-lg ml-4"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            Select a conversation to start chatting
          </div>
        )}
      </section>
    </main>
  );
};

function getMessageStatusText(status: 'SENT' | 'DELIVERED' | 'READ') {
  switch (status) {
    case 'SENT':
      return 'Sent';
    case 'DELIVERED':
      return 'Delivered';
    case 'READ':
      return 'Read';
    default:
      return '';
  }
}

export default Messages;
