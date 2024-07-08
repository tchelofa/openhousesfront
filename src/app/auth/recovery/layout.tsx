import SignInHeader from "@/app/components/SignInHeader";

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {

  return (
    <>
      <SignInHeader />
      <div className="flex items-center justify-center ">
        {children}
      </div>
    </>

  )
}