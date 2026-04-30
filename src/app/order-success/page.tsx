import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-6">
      <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-8">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-4xl font-bold text-white mb-4">
        You&apos;re all set.
      </h1>
      <p className="text-slate-400 text-lg max-w-md mb-3">
        We received your filing request and will handle everything from here.
      </p>
      <p className="text-slate-500 text-sm max-w-sm mb-10">
        You&apos;ll hear from us once your filing is submitted and again when it&apos;s approved. Check your email for a confirmation.
      </p>

      <Link
        href="/guide"
        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
      >
        Back to your guide
      </Link>
    </div>
  );
}
