'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from './actions';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-lg border border-cream-dark p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-honey/10 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-honey" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: 'var(--font-serif)' }}>
            HomeBaked
          </h1>
          <p className="text-warm-gray text-sm mt-1">Internal Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl bg-charcoal text-cream font-medium hover:bg-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
