"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { ArrowRight, ExternalLink, RefreshCw, Sparkles, ChevronDown, ChevronUp, Send, X, Plus } from "lucide-react";

interface Props {
  businessName: string;
  userEmail: string;
  onComplete: () => void;
}

export default function Step8Launch({ businessName, userEmail, onComplete }: Props) {
  const [tell10Open, setTell10Open] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [inputEmail, setInputEmail] = useState("");
  const [inputError, setInputError] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addRecipient() {
    const email = inputEmail.trim();
    if (!email) return;
    if (!email.includes("@")) {
      setInputError("Enter a valid email address");
      return;
    }
    if (recipients.includes(email)) {
      setInputError("Already added");
      return;
    }
    if (recipients.length >= 10) {
      setInputError("Maximum 10 recipients");
      return;
    }
    setRecipients((prev) => [...prev, email]);
    setInputEmail("");
    setInputError("");
    inputRef.current?.focus();
  }

  function removeRecipient(email: string) {
    setRecipients((prev) => prev.filter((e) => e !== email));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addRecipient();
    }
  }

  async function generateTemplate() {
    setGenLoading(true);
    setGenError("");
    try {
      const res = await fetch("/api/generate-announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, senderEmail: userEmail }),
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
    // mailto: "from" is always the user's email client account — we can't set it here
    const parts: string[] = [];
    if (recipients.length > 0) parts.push(`bcc=${recipients.map(encodeURIComponent).join(",")}`);
    if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
    if (body) parts.push(`body=${encodeURIComponent(body)}`);
    window.location.href = `mailto:?${parts.join("&")}`;
  }

  const OTHER_ACTIONS = [
    { emoji: "💼", title: "Post on LinkedIn", desc: "Your professional network is your first warm audience. Be specific about what you do." },
    { emoji: "📧", title: "Reach out to 3 potential customers", desc: "Don't broadcast — go direct. A personal message beats a post every time." },
    { emoji: "💳", title: "Set up payment processing", desc: "Stripe, Square, or Venmo Business — make it easy to pay you before you need it." },
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
              className="w-full flex items-start gap-4 bg-gray-50 px-4 py-4 text-left hover:bg-[#D4AF37]/10 transition-colors"
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
                    Recipients <span className="text-gray-400 font-normal">({recipients.length}/10)</span>
                  </label>

                  {/* Pill list */}
                  {recipients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {recipients.map((email) => (
                        <span
                          key={email}
                          className="inline-flex items-center gap-1 bg-[#D4AF37]/10 text-[#B8962E] border border-[#D4AF37]/20 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                          {email}
                          <button
                            onClick={() => removeRecipient(email)}
                            className="text-[#D4AF37] hover:text-[#B8962E] transition-colors ml-0.5"
                            aria-label={`Remove ${email}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Input + add button */}
                  {recipients.length < 10 && (
                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="email"
                        value={inputEmail}
                        onChange={(e) => { setInputEmail(e.target.value); setInputError(""); }}
                        onKeyDown={handleKeyDown}
                        placeholder="friend@example.com"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                      <button
                        onClick={addRecipient}
                        className="shrink-0 w-9 h-9 flex items-center justify-center bg-[#D4AF37] hover:bg-[#B8962E] text-white rounded-lg transition-colors"
                        aria-label="Add recipient"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {inputError && <p className="text-xs text-red-500 mt-1">{inputError}</p>}
                  <p className="text-xs text-gray-400 mt-1">Press Enter or + to add each address</p>
                </div>

                <button
                  onClick={generateTemplate}
                  disabled={genLoading || !businessName}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8962E] disabled:bg-[#D4AF37]/40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
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
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Body <span className="text-gray-400 font-normal">(editable)</span>
                      </label>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={10}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-y font-mono leading-relaxed"
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
                      Opens your email app with recipients in BCC and the template pre-filled. Sends from whichever account your email app is signed into.
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
          className="flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:border-[#D4AF37]/70 hover:bg-[#D4AF37]/10 transition-colors"
        >
          Stripe <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <a
          href="https://carrd.co"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:border-[#D4AF37]/70 hover:bg-[#D4AF37]/10 transition-colors"
        >
          Carrd.co <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-white font-bold py-5 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg shadow-lg shadow-[#D4AF37]/20"
      >
        I&apos;m launched. Let&apos;s go. <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
