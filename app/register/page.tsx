'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Registration failed');
      }

      localStorage.setItem('jwt', data.jwt);

      router.push('/');
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
            Join Fresh&Ready<span className="text-[#79a875]">.</span>
          </h1>

          <p className="mt-3 text-sm text-[#89938c]">
            Create your account and enjoy fresh food every day.
          </p>
        </div>

        {/* Register Card */}
        <form
          onSubmit={handleRegister}
          className="rounded-3xl border border-[#e9e8e1] bg-white p-7 sm:p-9 shadow-sm space-y-5"
        >
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-semibold text-[#243b2e]"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-[#e1e5dc] bg-[#faf9f6] px-4 py-3 text-sm text-[#243b2e] outline-none transition placeholder:text-[#a0a89f] focus:border-[#79a875] focus:ring-2 focus:ring-[#79a875]/15"
              required
              autoComplete="username"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-semibold text-[#243b2e]"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#e1e5dc] bg-[#faf9f6] px-4 py-3 text-sm text-[#243b2e] outline-none transition placeholder:text-[#a0a89f] focus:border-[#79a875] focus:ring-2 focus:ring-[#79a875]/15"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#e1e5dc] bg-[#faf9f6] px-4 py-3 text-sm text-[#243b2e] outline-none transition placeholder:text-[#a0a89f] focus:border-[#79a875] focus:ring-2 focus:ring-[#79a875]/15"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#243b2e] px-6 py-4 font-semibold text-white transition hover:bg-[#344f3d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account →'}
          </button>

          {/* Login link */}
          <div className="border-t border-[#eeeee8] pt-5 text-center">
            <p className="text-sm text-[#89938c]">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-[#79a875] hover:text-[#243b2e] transition"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
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
