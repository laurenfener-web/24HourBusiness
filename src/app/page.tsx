import Link from "next/link";

const steps = [
  "Choose your business name",
  "Pick a business structure (LLC)",
  "File your LLC",
  "Get your EIN from the IRS",
  "Open a business bank account",
  "Get a business credit card",
  "Set up basic accounting",
  "Launch",
];

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="font-semibold text-lg tracking-tight">24HourBusiness</span>
        <Link
          href="/guide"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Start the guide →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 flex-1">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          Free. No account required.
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 max-w-2xl leading-tight">
          Start your business{" "}
          <span className="text-indigo-600">this weekend.</span>
        </h1>

        <p className="mt-6 text-xl text-gray-500 max-w-xl">
          We cut through the noise. 8 simple steps from idea to official
          business — LLC, EIN, bank account, and everything in between.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/guide"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Start for free →
          </Link>
          <span className="text-sm text-gray-400">Takes about a weekend</span>
        </div>
      </section>

      {/* Steps preview */}
      <section className="bg-gray-50 border-t border-gray-100 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-8 text-center">
            What you&apos;ll do
          </h2>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li
                key={i}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-700 font-medium">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 text-center">
            <Link
              href="/guide"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors inline-block"
            >
              Let&apos;s go →
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100">
        Built to help you stop waiting and start building.
      </footer>
    </main>
  );
}
