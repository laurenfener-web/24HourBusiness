"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, ArrowRight, Check, Globe, AlertCircle } from "lucide-react";

interface NameResult {
  name: string;
  tagline: string;
  why: string;
  domain: string;
  domainAvailable: boolean | null;
}

interface Props {
  onComplete: (data: { businessName: string }) => void;
}

const VIBES = ["Professional", "Fun & Playful", "Bold & Edgy", "Clean & Minimal", "Trustworthy"];

function DomainBadge({ available, domain }: { available: boolean | null; domain: string }) {
  if (available === null) return null;

  if (available) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
        <Globe className="w-3 h-3" />
        {domain} available
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
      <AlertCircle className="w-3 h-3" />
      {domain} taken
    </div>
  );
}

export default function Step1Name({ onComplete }: Props) {
  const [mode, setMode] = useState<"generate" | "existing">("generate");
  const [existingName, setExistingName] = useState("");
  const [description, setDescription] = useState("");
  const [vibe, setVibe] = useState("");
  const [results, setResults] = useState<NameResult[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!description.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    setSelected("");
    try {
      const res = await fetch("/api/generate-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, vibe }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.names);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  }

  const selectedResult = results.find((r) => r.name === selected);

  if (mode === "existing") {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Your business name
          </label>
          <input
            type="text"
            value={existingName}
            onChange={(e) => setExistingName(e.target.value)}
            placeholder="e.g. Acme"
            autoFocus
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-semibold"
          />
        </div>
        <button
          onClick={() => onComplete({ businessName: existingName.trim() })}
          disabled={!existingName.trim()}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          Use &ldquo;{existingName.trim() || "…"}&rdquo; <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setMode("generate")}
          className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium py-1 transition-colors"
        >
          ← Help me come up with a name instead
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="text-gray-500 text-sm mb-5 leading-relaxed">
          Describe your business idea and our AI will generate single-word name options — each checked for <strong className="text-gray-700">.com domain availability</strong> in real time.
        </p>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          What does your business do?
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. A service that helps landlords find reliable tenants using background checks and credit scores"
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm leading-relaxed"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Brand vibe <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((v) => (
            <button
              key={v}
              onClick={() => setVibe(vibe === v ? "" : v)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                vibe === v
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        disabled={!description.trim() || loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Generating &amp; checking availability...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate business names
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Pick one you love
          </p>
          {results.filter((r) => r.domainAvailable !== false).map((r) => (
            <button
              key={r.name}
              onClick={() => setSelected(r.name)}
              className={`w-full text-left border rounded-xl p-5 transition-all ${
                selected === r.name
                  ? "border-indigo-500 bg-indigo-50 shadow-sm"
                  : "border-gray-100 bg-gray-50 hover:border-indigo-200 hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <p className="font-bold text-gray-900 text-xl">{r.name}</p>
                    <DomainBadge available={r.domainAvailable} domain={r.domain} />
                  </div>
                  <p className="text-indigo-600 text-sm font-medium mt-1">&ldquo;{r.tagline}&rdquo;</p>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">{r.why}</p>

                  {/* Trademark check link */}
                  <a
                    href={`https://www.uspto.gov/trademarks/search?query=${encodeURIComponent(r.name)}&searchType=wordmark`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-600 mt-2 transition-colors underline underline-offset-2"
                  >
                    Check trademark →
                  </a>
                </div>
                <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 ${
                  selected === r.name ? "bg-indigo-600 border-indigo-600" : "border-gray-200"
                }`}>
                  {selected === r.name && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </button>
          ))}

          <button
            onClick={generate}
            className="w-full flex items-center justify-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Generate different names
          </button>
        </div>
      )}

      {selected && (
        <div className="space-y-3">
          {selectedResult?.domainAvailable === false && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>{selectedResult.domain}</strong> is taken, but you can still use this name — many businesses use .co, .io, or a creative variation. Or regenerate for more options.
              </p>
            </div>
          )}
          <button
            onClick={() => onComplete({ businessName: selected })}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base shadow-sm"
          >
            Use &ldquo;{selected}&rdquo;
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="pt-2 border-t border-gray-100 text-center">
        <button
          onClick={() => setMode("existing")}
          className="text-sm text-gray-400 hover:text-indigo-600 font-medium transition-colors"
        >
          I already have a name →
        </button>
      </div>
    </div>
  );
}
