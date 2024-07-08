export default function EmailSignIn() {
    return (
        <>
            <main className="w-full max-w-lg mx-auto mt-10 px-4 flex flex-col items-start gap-4">
                <img src="/logo.png" alt="Logo" className="w-[200px] mb-10" />
                <h1 className="font-bold text-2xl">Recovery your password</h1>
                <form action="" className="flex flex-col gap-4 w-full">
                    <label htmlFor="email">Email</label>
                    <input type="text" placeholder='name@example.com' className='border border-gray-300 p-4 w-full outline-none focus:shadow-md'    />
                    <button className='p-4 bg-sky-700 text-white w-full rounded-md hover:bg-sky-900'>Send Email</button>
                    <div>
                        <a href="/auth/signin">Sign In</a>
                    </div>
                </form>
            </main>
        </>
    )
}