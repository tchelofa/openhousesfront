'use client'
import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { instance as axios } from '@/lib/axiosConfig';
import { Env } from '@/lib/Env';

function ActivateAccountPage() {
  const params = useParams();
  const { userID, token } = params;
  
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    if (userID && token) {
      const activateAccount = async () => {
        try {
          const response = await axios.put(`${Env.baseurl}/users/activateAccount/${userID}/${token}`, {
            userID,
            token
          });
          setResponseMessage(response.data.message);
          setStatus(response.status);
        } catch (error: any) {
          if (error.response) {
            setResponseMessage(error.response.data.message);
            setStatus(error.response.status);
          } else {
            setResponseMessage('Erro ao ativar a conta. Por favor, tente novamente.');
            setStatus(500); // Internal Server Error
          }
        } finally {
          setLoading(false);
        }
      };

      activateAccount();
    }
  }, [userID, token]);

  if (loading) {
    return <p className="text-center text-lg font-semibold text-gray-700">Carregando...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gray-100">
      <img src='/logo.png' alt='logotipo' width="350" className='my-4'/>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <p className={`text-lg font-semibold mb-4 ${status === 200 ? 'text-green-600' : 'text-red-600'}`}>
          {responseMessage}
        </p>
        {status === 200 && (
          <a 
            href="/auth/signin" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Sign In
          </a>
        )}
        {(status === 400 || status === 403) && (
          <p className="text-gray-700 mt-4">If you need help, contact technical support. support@openhouses.ie</p>
        )}
      </div>
    </div>
  );
}

export default function ActivateAccount() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActivateAccountPage />
    </Suspense>
  );
}
