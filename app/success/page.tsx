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
    <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-[#e9e8e1] bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-[#eaf1e5] border-t-[#79a875] animate-spin" />

        <h1 className="text-xl font-bold text-[#243b2e]">
          Confirming your order...
        </h1>

        <p className="mt-2 text-sm text-[#89938c]">
          Please wait while we retrieve your order details.
        </p>
      </div>
    </main>
  );
}
