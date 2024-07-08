import Header from "@/app/components/Header";

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {

  return (
    <>
      <Header />
      <div className="flex items-center justify-center ">
        {children}
      </div>
    </>

  )
}