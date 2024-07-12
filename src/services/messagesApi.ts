import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/messages', // Altere para a URL do seu backend
});

interface SendMessageData {
  userFromId: string;
  userToId: string;
  message: string;
}

export const sendMessage = async (data: SendMessageData) => {
  return await api.post('/send', data);
};

export const getMyConversations = async (publicId: string) => {
  return await api.get(`/myConversations/${publicId}`);
};

export const getMyMessagesWith = async (myId: string, contactId: string) => {
  return await api.get(`/myMessagesWith/${myId}/${contactId}`);
};

export const markMessageAsRead = async (publicId: string) => {
  return await api.patch(`/messageRead/${publicId}`);
};
