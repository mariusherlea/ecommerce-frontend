// app/success/page.tsx
import { Suspense } from 'react';
import SuccessClient from './SuccessClient';

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessClient />
    </Suspense>
  );
}

function SuccessFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur p-6 shadow-xl">
        <p className="text-gray-300">Confirm page is loading...</p>
      </div>
    </div>
  );
}
