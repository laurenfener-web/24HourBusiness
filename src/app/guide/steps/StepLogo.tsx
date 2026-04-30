"use client";

import { useState } from "react";
import { ArrowRight, RefreshCw, Sparkles, Download, Check } from "lucide-react";

interface Props {
  businessName: string;
  onComplete: () => void;
}

const STYLES = ["Minimal", "Bold", "Playful", "Elegant", "Tech"];

const PALETTES = [
  { name: "Indigo",   color: "#FF8C42" },
  { name: "Ocean",    color: "#0891b2" },
  { name: "Forest",   color: "#059669" },
  { name: "Crimson",  color: "#dc2626" },
  { name: "Amber",    color: "#d97706" },
  { name: "Violet",   color: "#7c3aed" },
  { name: "Rose",     color: "#e11d48" },
  { name: "Slate",    color: "#475569" },
];

interface LogoConcept {
  concept: string;
  svg: string;
}

function downloadSvg(svg: string, businessName: string) {
  const full = svg.replace(
    /<svg /,
    `<svg width="400" height="400" `
  );
  const blob = new Blob([full], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${businessName.toLowerCase().replace(/\s+/g, "-")}-logo.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function StepLogo({ businessName, onComplete }: Props) {
  const [style, setStyle] = useState("Minimal");
  const [color, setColor] = useState("#FF8C42");
  const [description, setDescription] = useState("");
  const [logos, setLogos] = useState<LogoConcept[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setLogos([]);
    setSelected(null);
    try {
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, style, color, description }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLogos(data.logos);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pick a style and color, then let AI generate four icon concepts for <strong className="text-gray-700">{businessName || "your business"}</strong>. Choose one, download the SVG, and you&apos;re done.
      </p>

      {/* Style */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Style</label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                style === s
                  ? "bg-[#FF8C42] text-white border-[#FF8C42]"
                  : "border-gray-200 text-gray-600 hover:border-[#FF8C42]/70 hover:bg-[#FF8C42]/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {PALETTES.map((p) => (
            <button
              key={p.color}
              onClick={() => setColor(p.color)}
              title={p.name}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                color === p.color ? "border-gray-800 scale-110" : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: p.color }}
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Describe your vision <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Something with a mountain or upward arrow, feels modern and trustworthy"
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent resize-none text-sm leading-relaxed"
        />
      </div>

      {/* Generate */}
      <button
        onClick={generate}
        disabled={loading || !businessName}
        className="w-full bg-[#FF8C42] hover:bg-[#E87030] disabled:bg-[#FF8C42]/40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        {loading ? (
          <><RefreshCw className="w-4 h-4 animate-spin" /> Generating logos...</>
        ) : logos.length > 0 ? (
          <><RefreshCw className="w-4 h-4" /> Regenerate</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Generate logo concepts</>
        )}
      </button>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      {/* Results grid */}
      {logos.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pick your favorite</p>
          <div className="grid grid-cols-2 gap-3">
            {logos.map((logo, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all ${
                  selected === i
                    ? "border-[#FF8C42] bg-[#FF8C42]/10"
                    : "border-gray-100 bg-gray-50 hover:border-[#FF8C42]/40 hover:bg-white"
                }`}
              >
                {selected === i && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#FF8C42] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className="w-16 h-16"
                  dangerouslySetInnerHTML={{ __html: logo.svg }}
                />
                <p className="text-xs font-semibold text-gray-600 text-center leading-tight">{logo.concept}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Download + preview */}
      {selected !== null && logos[selected] && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 shrink-0"
                dangerouslySetInnerHTML={{ __html: logos[selected].svg }}
              />
              <div>
                <p className="font-bold text-gray-900 text-sm">{businessName}</p>
                <p className="text-xs text-gray-400">{logos[selected].concept}</p>
              </div>
            </div>
            <button
              onClick={() => downloadSvg(logos[selected].svg, businessName)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#FF8C42] hover:text-[#E87030] border border-[#FF8C42]/40 rounded-lg px-3 py-2 hover:bg-[#FF8C42]/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download SVG
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-1">
        {selected !== null ? (
          <button
            onClick={onComplete}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            Use this logo <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            disabled={logos.length === 0}
            className="w-full bg-slate-900 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            Select a logo to continue
          </button>
        )}
        <button
          onClick={onComplete}
          className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium py-2 transition-colors"
        >
          Skip this step →
        </button>
      </div>
    </div>
  );
}
