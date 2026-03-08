'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
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
      console.log('🧠 Strapi register response:', data);

      if (!res.ok) {
        throw new Error(data.error?.message || 'Registration failed');
      }

      // ✅ Salvăm JWT-ul în localStorage
      localStorage.setItem('jwt', data.jwt);

      // ✅ Redirect către homepage sau profil
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Create an account</h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <input
          type="text"
          placeholder="User name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Account is building...' : 'Register'}
        </button>

        <p className="text-sm text-center text-gray-600">
          You already has an account ?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
