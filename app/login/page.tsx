//app/login/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      login(data.user, data.jwt);

      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-16 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-3xl font-extrabold tracking-tight text-[#243b2e]"
          >
            fresh<span className="text-[#79a875]">&</span>ready.
          </Link>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#79a875]">
            Fresh food, made easy
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#243b2e]">
            Welcome back<span className="text-[#79a875]">.</span>
          </h1>

          <p className="mt-3 text-sm text-[#89938c]">
            Sign in to continue enjoying fresh food.
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="rounded-3xl border border-[#e9e8e1] bg-white p-7 sm:p-9 shadow-sm space-y-5"
        >
          <div>
            <label
              htmlFor="identifier"
              className="block mb-2 text-sm font-semibold text-[#243b2e]"
            >
              Email or username
            </label>

            <input
              id="identifier"
              type="text"
              placeholder="Enter your email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-xl border border-[#e1e5dc] bg-[#faf9f6] px-4 py-3 text-sm text-[#243b2e] outline-none transition placeholder:text-[#a0a89f] focus:border-[#79a875] focus:ring-2 focus:ring-[#79a875]/15"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-semibold text-[#243b2e]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#e1e5dc] bg-[#faf9f6] px-4 py-3 text-sm text-[#243b2e] outline-none transition placeholder:text-[#a0a89f] focus:border-[#79a875] focus:ring-2 focus:ring-[#79a875]/15"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#243b2e] px-6 py-4 font-semibold text-white transition hover:bg-[#344f3d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>

          <div className="border-t border-[#eeeee8] pt-5 text-center">
            <p className="text-sm text-[#89938c]">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-[#79a875] hover:text-[#243b2e] transition"
              >
                Create account
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-7 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-[#79a875] hover:text-[#243b2e] transition"
          >
            ← Back to home
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-[#a0a89f]">
          Fresh food. Simple ordering. Secure shopping.
        </p>
      </div>
    </main>
  );
}
