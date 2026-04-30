"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, MessageSquare, Plus, ChevronDown, Building2, Loader2, Check, Trash2 } from "lucide-react";
import { logout } from "@/actions/auth";
import { Company } from "@/lib/db";

const STEP_LABELS = [
  "Choose a name",
  "Business structure",
  "File LLC",
  "Get EIN",
  "Bank account",
  "Credit card",
  "Accounting",
  "Launch",
];

interface Props {
  userEmail: string;
  companies: Company[];
  activeCompanyId: string;
  onSelectCompany: (company: Company) => void;
  onNewCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
}

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function send() {
    if (!message.trim()) return;
    setStatus("sending");
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
    } finally {
      setStatus("sent");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {status === "sent" ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Thanks for the feedback!</h3>
            <p className="text-gray-500 text-sm mb-5">We read every message.</p>
            <button onClick={onClose} className="bg-slate-900 text-white font-semibold px-6 py-2.5 rounded-xl text-sm">
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Leave feedback</h3>
            <p className="text-gray-500 text-sm mb-4">What&apos;s working? What&apos;s broken? What&apos;s missing?</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your feedback..."
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={send}
                disabled={!message.trim() || status === "sending"}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {status === "sending" ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</> : "Send feedback"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProfileDropdown({ userEmail, companies, activeCompanyId, onSelectCompany, onNewCompany, onDeleteCompany }: Props) {
  const [open, setOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setDeletingId(id);
    await fetch("/api/companies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    onDeleteCompany(id);
    setDeletingId(null);
  }
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleNewCompany() {
    setCreatingNew(true);
    try {
      const res = await fetch("/api/companies", { method: "POST" });
      const data = await res.json();
      onNewCompany(data.company);
      setOpen(false);
    } finally {
      setCreatingNew(false);
    }
  }

  const initials = userEmail.slice(0, 2).toUpperCase();

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full pl-1 pr-3 py-1 transition-colors"
        >
          <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <span className="hidden sm:block text-xs font-medium text-gray-700 max-w-[120px] truncate">{userEmail}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-40 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{userEmail}</p>
            </div>

            {/* Companies */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">My Businesses</p>
              {companies.length === 0 ? (
                <p className="text-xs text-gray-400 py-1">No businesses yet.</p>
              ) : (
                <div className="space-y-1">
                  {companies.map((c) => {
                    const isActive = c.id === activeCompanyId;
                    const stepLabel = c.done ? "Complete" : `Step ${c.current_step + 1} of 8 — ${STEP_LABELS[c.current_step]}`;
                    return (
                      <div key={c.id} className={`flex items-center gap-1 rounded-xl ${isActive ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
                        <button
                          onClick={() => { onSelectCompany(c); setOpen(false); }}
                          className="flex-1 min-w-0 text-left px-3 py-2.5 flex items-start gap-3"
                        >
                          <Building2 className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? "text-indigo-500" : "text-gray-300"}`} />
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold truncate ${isActive ? "text-indigo-700" : "text-gray-800"}`}>
                              {c.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{stepLabel}</p>
                            <div className="h-1 bg-gray-100 rounded-full mt-1.5 w-full">
                              <div
                                className="h-full bg-indigo-400 rounded-full transition-all"
                                style={{ width: `${c.done ? 100 : (c.current_step / 8) * 100}%` }}
                              />
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, c.id)}
                          disabled={deletingId === c.id}
                          className="shrink-0 p-2 mr-1 text-gray-300 hover:text-red-400 transition-colors rounded-lg"
                          title="Delete"
                        >
                          {deletingId === c.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={handleNewCompany}
                disabled={creatingNew}
                className="w-full mt-2 flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                {creatingNew ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Start a new business
              </button>
            </div>

            {/* Actions */}
            <div className="px-4 py-2">
              <button
                onClick={() => { setShowFeedback(true); setOpen(false); }}
                className="w-full flex items-center gap-2.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-gray-400" />
                Leave feedback
              </button>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2.5 text-sm text-red-500 hover:text-red-600 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </>
  );
}
