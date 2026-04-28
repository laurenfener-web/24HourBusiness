"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Step {
  id: string;
  title: string;
  time: string;
  description: string;
  actions: string[];
  links?: { label: string; url: string }[];
}

const STEPS: Step[] = [
  {
    id: "name",
    title: "Choose your business name",
    time: "30 min",
    description:
      "Your business name is your first impression. Pick something memorable and make sure it's available.",
    actions: [
      "Brainstorm 3–5 names you love",
      "Search your state's business name database to check availability",
      "Search the USPTO trademark database to avoid conflicts",
      "Check that the .com domain is available",
    ],
    links: [
      { label: "Search trademarks (USPTO)", url: "https://www.uspto.gov/trademarks/search" },
      { label: "Check domain on Namecheap", url: "https://www.namecheap.com" },
    ],
  },
  {
    id: "structure",
    title: "Choose your business structure",
    time: "20 min",
    description:
      "For most solo founders, an LLC is the right move. It protects your personal assets and is simple to run.",
    actions: [
      "Understand the options: Sole Proprietorship, LLC, S-Corp, C-Corp",
      "For most people: choose LLC — it gives liability protection with minimal paperwork",
      "If you're bringing on investors or going big, talk to a lawyer about C-Corp",
    ],
    links: [
      { label: "LLC vs S-Corp explained (IRS)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/llcs" },
    ],
  },
  {
    id: "llc",
    title: "File your LLC",
    time: "1–2 hours",
    description:
      "Filing an LLC is a state-level process. You'll pay a fee ($50–$500 depending on your state) and submit Articles of Organization.",
    actions: [
      "Go to your state's Secretary of State website",
      "File Articles of Organization (the main LLC formation doc)",
      "Choose a registered agent (can be yourself)",
      "Pay the filing fee",
      "Wait for approval (same day to 4 weeks depending on state)",
    ],
    links: [
      { label: "Find your state's filing portal", url: "https://www.sos.ca.gov/business-programs/business-entities" },
      { label: "Use Stripe Atlas if you want Delaware LLC (fast)", url: "https://stripe.com/atlas" },
    ],
  },
  {
    id: "ein",
    title: "Get your EIN (Employer Identification Number)",
    time: "10 min",
    description:
      "Your EIN is like a Social Security number for your business. You need it to open a bank account and pay taxes. It's free from the IRS.",
    actions: [
      "Go to the IRS EIN application page",
      "Apply online — it's free and takes about 10 minutes",
      "You'll get your EIN immediately after completing the form",
      "Save the confirmation letter (you'll need this forever)",
    ],
    links: [
      { label: "Apply for EIN (IRS — free)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" },
    ],
  },
  {
    id: "bank",
    title: "Open a business bank account",
    time: "30–60 min",
    description:
      "Keep business money completely separate from personal money. This is non-negotiable for legal and accounting reasons.",
    actions: [
      "Gather your LLC formation docs + EIN",
      "Choose a bank (Mercury and Relay are great for startups — no fees)",
      "Apply online or in-person",
      "Fund the account with a small deposit",
    ],
    links: [
      { label: "Mercury (no fees, online)", url: "https://mercury.com" },
      { label: "Relay (great for budgeting)", url: "https://relayfi.com" },
    ],
  },
  {
    id: "creditcard",
    title: "Get a business credit card",
    time: "20 min",
    description:
      "A business credit card builds your business credit score, separates expenses, and often comes with great rewards.",
    actions: [
      "Apply for a business credit card in your LLC's name",
      "Use it for all business expenses — never personal ones",
      "Pay it off in full every month to build credit",
    ],
    links: [
      { label: "Chase Ink Business Cash", url: "https://creditcards.chase.com/business-credit-cards/ink/cash" },
      { label: "American Express Blue Business Cash", url: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-blue-business-cash-credit-card/" },
      { label: "Brex (no personal guarantee)", url: "https://www.brex.com" },
    ],
  },
  {
    id: "accounting",
    title: "Set up basic accounting",
    time: "30 min",
    description:
      "You need to track income and expenses from day one. Don't let this pile up — it becomes a nightmare at tax time.",
    actions: [
      "Sign up for accounting software",
      "Connect your business bank account",
      "Set up basic expense categories",
      "Plan to review your books monthly",
    ],
    links: [
      { label: "Wave (free)", url: "https://www.waveapps.com" },
      { label: "QuickBooks (most popular)", url: "https://quickbooks.intuit.com" },
      { label: "Bench (done-for-you bookkeeping)", url: "https://bench.co" },
    ],
  },
  {
    id: "launch",
    title: "Launch",
    time: "You decide",
    description:
      "You're officially a business owner. Now it's time to get your first customer. Don't wait until everything is perfect.",
    actions: [
      "Tell 10 people what you're doing",
      "Post on LinkedIn or social media",
      "Reach out to your first potential customer directly",
      "Set a revenue goal for your first 30 days",
    ],
    links: [
      { label: "Build a simple landing page with Carrd", url: "https://carrd.co" },
      { label: "Accept payments with Stripe", url: "https://stripe.com" },
    ],
  },
];

export default function GuideClient() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string>(STEPS[0].id);

  useEffect(() => {
    const saved = localStorage.getItem("24hb-completed");
    if (saved) setCompleted(new Set(JSON.parse(saved)));
  }, []);

  function toggle(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("24hb-completed", JSON.stringify([...next]));
      return next;
    });
  }

  const progress = Math.round((completed.size / STEPS.length) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          24HourBusiness
        </Link>
        <span className="text-sm text-gray-500">
          {completed.size} of {STEPS.length} done
        </span>
      </nav>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto w-full px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Your business checklist
        </h1>
        <p className="text-gray-500 mb-10">
          Work through each step at your own pace. Your progress is saved automatically.
        </p>

        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const done = completed.has(step.id);
            const isOpen = open === step.id;

            return (
              <div
                key={step.id}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  done
                    ? "border-indigo-200 bg-indigo-50/40"
                    : "border-gray-200 bg-white"
                }`}
              >
                {/* Step header */}
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? "" : step.id)}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(step.id);
                    }}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      done
                        ? "bg-indigo-600 border-indigo-600"
                        : "border-gray-300 hover:border-indigo-400"
                    }`}
                  >
                    {done && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400">
                        Step {i + 1}
                      </span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{step.time}</span>
                    </div>
                    <p
                      className={`font-semibold mt-0.5 ${
                        done ? "text-indigo-700 line-through decoration-indigo-300" : "text-gray-900"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>

                  <svg
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-5 pb-6 border-t border-gray-100">
                    <p className="text-gray-600 mt-4 mb-5">{step.description}</p>

                    <ul className="space-y-2 mb-5">
                      {step.actions.map((action, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
                            {j + 1}
                          </span>
                          {action}
                        </li>
                      ))}
                    </ul>

                    {step.links && step.links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {step.links.map((link, j) => (
                          <a
                            key={j}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {link.label}
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                              <path
                                d="M3.5 8.5l5-5M5 3.5h3.5v3.5"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => toggle(step.id)}
                      className={`mt-6 w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                        done
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {done ? "Mark as incomplete" : "Mark as complete ✓"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {completed.size === STEPS.length && (
          <div className="mt-10 text-center bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-10">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You&apos;re officially in business!
            </h2>
            <p className="text-gray-500">
              You&apos;ve done what most people only dream about. Now go get your first customer.
            </p>
          </div>
        )}
      </div>

      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100">
        Built to help you stop waiting and start building.
      </footer>
    </div>
  );
}
