import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#253b2d]">
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="mb-6 inline-block rounded-full bg-[#e9f0e5] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#527c50]">
            Fresh food, made easy
          </span>

          <h1 className="max-w-xl text-5xl leading-[1.1] font-extrabold tracking-tight md:text-7xl">
            Eat fresh.
            <br />
            Feel <span className="text-[#78a66a]">good.</span>
            <br />
            Live better.
          </h1>

          <p className="mt-7 max-w-md text-lg leading-8 text-[#777d73]">
            Delicious ready-made meals, fresh salads and naturally sweet fruit
            bowls. Good food, made simple.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-full bg-[#253b2d] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#3e6047]"
            >
              Explore our menu →
            </Link>
          </div>

          <div className="mt-12 flex gap-10">
            <div>
              <p className="text-2xl font-bold">Fresh</p>
              <p className="mt-1 text-xs text-[#858b81]">Quality ingredients</p>
            </div>
            <div>
              <p className="text-2xl font-bold">Easy</p>
              <p className="mt-1 text-xs text-[#858b81]">Simple ordering</p>
            </div>
            <div>
              <p className="text-2xl font-bold">Tasty</p>
              <p className="mt-1 text-xs text-[#858b81]">Made to enjoy</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className="aspect-[4/3] rounded-[2rem] bg-cover bg-center shadow-xl"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=90')",
            }}
          />
          <div className="absolute -bottom-5 -left-4 rounded-2xl bg-white px-6 py-4 shadow-lg md:-left-8">
            <p className="text-sm font-bold">Good food, good mood.</p>
            <p className="mt-1 text-xs text-gray-500">
              Your everyday fresh choice
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#edf1e9] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold tracking-widest text-[#78a66a] uppercase">
              Why choose us
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Freshness in every bite.
            </h2>
          </div>

          <div className="grid gap-10 text-center md:grid-cols-3">
            {[
              {
                icon: '🌿',
                title: 'Fresh Ingredients',
                description:
                  'Carefully selected ingredients for delicious meals.',
              },
              {
                icon: '🍽️',
                title: 'Ready to Enjoy',
                description:
                  'Convenient meals that make everyday eating easier.',
              },
              {
                icon: '🔒',
                title: 'Secure Checkout',
                description: 'Simple and secure online payment experience.',
              },
            ].map((item) => (
              <div key={item.title}>
                <div className="text-4xl">{item.icon}</div>
                <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#777d73]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#253b2d] px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
          <Link href="/" className="text-2xl font-extrabold">
            fresh<span className="text-[#a5cc8e]">&</span>ready.
          </Link>

          <p className="text-sm text-white/60">
            Fresh food. Simple choices. Better days.
          </p>

          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Fresh & Ready
          </p>
        </div>
      </footer>
    </main>
  );
}
