"use client";

import { useState } from "react";
import { ArrowRight, ExternalLink, Mail, RefreshCw, Sparkles, ChevronDown, ChevronUp, Send } from "lucide-react";

interface Props {
  businessName: string;
  userEmail: string;
  onComplete: () => void;
}

export default function Step8Launch({ businessName, userEmail, onComplete }: Props) {
  const [tell10Open, setTell10Open] = useState(false);
  const [senderEmail, setSenderEmail] = useState(userEmail || "");
  const [recipientsRaw, setRecipientsRaw] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState("");

  const recipients = recipientsRaw
    .split(/[\n,;]+/)
    .map((e) => e.trim())
    .filter((e) => e.includes("@"))
    .slice(0, 10);

  async function generateTemplate() {
    setGenLoading(true);
    setGenError("");
    try {
      const res = await fetch("/api/generate-announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, senderEmail }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSubject(data.subject);
      setBody(data.body);
    } catch {
      setGenError("Something went wrong — please try again.");
    } finally {
      setGenLoading(false);
    }
  }

  function openInEmail() {
    const params = new URLSearchParams();
    if (recipients.length > 0) params.set("bcc", recipients.join(","));
    if (subject) params.set("subject", subject);
    if (body) params.set("body", body);
    window.location.href = `mailto:${senderEmail}?${params.toString()}`;
  }

  const OTHER_ACTIONS = [
    { emoji: "💼", title: "Post on LinkedIn", desc: "Your professional network is your first warm audience. Be specific about what you do." },
    { emoji: "📧", title: "Reach out to 3 potential customers", desc: "Don't broadcast — go direct. A personal message beats a post every time." },
    { emoji: "💳", title: "Set up payment processing", desc: "Stripe, Square, or Venmo Business — make it easy to pay you before you need it." },
    { emoji: "🌐", title: "Build a simple website", desc: "Carrd.co lets you launch a clean, professional page in under an hour." },
    { emoji: "🎯", title: "Set a 30-day revenue goal", desc: "What does success look like this month? Write it down. Make it specific." },
  ];

  return (
    <div className="space-y-7">
      <div className="text-center py-6 border-b border-gray-100">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {businessName ? `${businessName} is officially open for business.` : "You're officially open for business."}
        </h2>
        <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
          The hard part is done. Most people never get past the &ldquo;thinking about it&rdquo; stage. You&apos;re already lapping them.
        </p>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-800 mb-4">Your launch checklist</p>
        <ul className="space-y-3">

          {/* Tell 10 people — interactive */}
          <li className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setTell10Open((o) => !o)}
              className="w-full flex items-start gap-4 bg-gray-50 px-4 py-4 text-left hover:bg-indigo-50 transition-colors"
            >
              <span className="text-2xl shrink-0 leading-none mt-0.5">📣</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">Tell 10 people</p>
                <p className="text-sm text-gray-500 mt-0.5">Send a personal launch email to your network — we&apos;ll write it for you.</p>
              </div>
              {tell10Open
                ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
              }
            </button>

            {tell10Open && (
              <div className="px-4 pb-5 pt-3 border-t border-gray-100 space-y-4 bg-white">

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Your email address <span className="text-gray-400 font-normal">(so recipients know who it&apos;s from)</span>
                  </label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Recipient emails <span className="text-gray-400 font-normal">(up to 10, comma or line separated)</span>
                  </label>
                  <textarea
                    value={recipientsRaw}
                    onChange={(e) => setRecipientsRaw(e.target.value)}
                    placeholder={"friend@gmail.com\ncolleague@work.com, family@example.com"}
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  {recipients.length > 0 && (
                    <p className="text-xs text-indigo-600 mt-1 font-medium">{recipients.length} recipient{recipients.length !== 1 ? "s" : ""} detected</p>
                  )}
                </div>

                <button
                  onClick={generateTemplate}
                  disabled={genLoading || !businessName}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {genLoading ? (
                    <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Writing your email...</>
                  ) : body ? (
                    <><RefreshCw className="w-3.5 h-3.5" /> Regenerate email</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5" /> Generate email template</>
                  )}
                </button>

                {genError && (
                  <p className="text-xs text-red-500 text-center">{genError}</p>
                )}

                {body && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subject</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Body <span className="text-gray-400 font-normal">(editable)</span></label>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={10}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y font-mono leading-relaxed"
                      />
                    </div>
                    <button
                      onClick={openInEmail}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Open in email app
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      Opens your default email app with recipients in BCC and the template pre-filled.
                    </p>
                  </div>
                )}
              </div>
            )}
          </li>

          {OTHER_ACTIONS.map((a) => (
            <li key={a.title} className="flex items-start gap-4 bg-gray-50 rounded-xl px-4 py-4 border border-gray-100">
              <span className="text-2xl shrink-0 leading-none mt-0.5">{a.emoji}</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{a.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href="https://stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
        >
          Stripe <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <a
          href="https://carrd.co"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
        >
          Carrd.co <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg shadow-lg shadow-indigo-500/20"
      >
        I&apos;m launched. Let&apos;s go. <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
