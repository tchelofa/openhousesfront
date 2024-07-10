'use client'
import Header from "./components/Header";
import MessageHeader from "./components/MessageHeader";
import MainPage from "./main/page";


export default function Home() {


  return (
    <div>
      <MessageHeader />
      <Header />
      <MainPage />
    </div>
  );
}
