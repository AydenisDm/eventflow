import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-indigo-950 text-white px-6">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">EventFlow</h1>
        <p className="text-lg text-slate-300">
          The complete event registration, attendance, and payment
          management platform for conferences, churches, and organizations.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium hover:bg-indigo-500 transition"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-700 px-6 py-3 font-medium hover:bg-slate-800 transition"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
