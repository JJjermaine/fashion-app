import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-1 w-full max-w-6xl mx-auto items-center justify-center gap-8">
        {/* Left: Title and Intro (60%) */}
        <section className="w-full lg:w-3/5 flex flex-col gap-8 items-center lg:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-4xl font-bold text-center lg:text-left">
            Welcome
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center lg:text-left max-w-md">
            Sign in to your account to continue exploring the latest fashion trends and connect with our community.
          </p>

        </section>
        {/* Right: Sign-in (40%) */}
        <section className="w-full lg:w-2/5 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
          <h3 className="text-lg font-medium mb-4 text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 underline">
              Create an account now.
            </Link>
          </h3>
          <form className="flex flex-col gap-4 w-full">
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>
        </section>
      </main>
      <footer className="flex gap-[24px] flex-wrap items-center justify-center mt-12">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
} 