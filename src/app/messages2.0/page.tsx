'use client';
import { useEffect, useState } from 'react';
import Chat from './components/chat';

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId);
  }, []);

  return (
    <div>

      <Chat userId={userId} />
    </div>
  );
}
