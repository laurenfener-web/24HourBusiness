"use client";

import { useState } from "react";
import { ArrowRight, RefreshCw, Sparkles, Download, Check } from "lucide-react";

interface Props {
  businessName: string;
  onComplete: () => void;
}

const INDUSTRIES = [
  "Tech / Software", "Food & Drink", "Health & Wellness", "Creative & Design",
  "Finance", "Professional Services", "Retail", "Real Estate", "Fitness",
  "Education", "Beauty & Fashion", "Other",
];

const MOODS = ["Modern & Clean", "Bold & Strong", "Playful & Fun", "Elegant & Premium", "Friendly & Warm", "Edgy & Dark"];

const PALETTES = [
  { name: "Gold",    color: "#D4AF37" },
  { name: "Ocean",   color: "#0891b2" },
  { name: "Forest",  color: "#059669" },
  { name: "Crimson", color: "#dc2626" },
  { name: "Violet",  color: "#7c3aed" },
  { name: "Rose",    color: "#e11d48" },
  { name: "Slate",   color: "#334155" },
  { name: "Amber",   color: "#d97706" },
];

interface LogoConcept {
  concept: string;
  svg: string;
}

function scopeIds(svg: string, prefix: string): string {
  return svg
    .replace(/\bid="([^"]+)"/g, (_, id) => `id="${prefix}-${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${prefix}-${id})`)
    .replace(/href="#([^"]+)"/g, (_, id) => `href="#${prefix}-${id}"`);
}

function downloadSvg(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function buildFullLogoSvg(iconSvg: string, businessName: string): string {
  const inner = iconSvg.replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
  const fontSize = businessName.length > 16 ? 18 : businessName.length > 10 ? 22 : 26;
  const approxTextWidth = businessName.length * fontSize * 0.58;
  const width = Math.round(120 + approxTextWidth);
  return `<svg width="${width}" height="100" viewBox="0 0 ${width} 100" xmlns="http://www.w3.org/2000/svg">
  <g>${inner}</g>
  <text x="115" y="${50 + fontSize * 0.36}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="${fontSize}" fill="#111111" letter-spacing="-0.3">${businessName}</text>
</svg>`;
}

function downloadPng(svg: string, filename: string, size = 1000) {
  const withSize = svg.replace(/<svg /, `<svg width="${size}" height="${size}" `);
  const blob = new Blob([withSize], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return;
      const pngUrl = URL.createObjectURL(pngBlob);
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(pngUrl);
    }, "image/png");
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

export default function StepLogo({ businessName, onComplete }: Props) {
  const [industry, setIndustry] = useState("");
  const [mood, setMood] = useState("Modern & Clean");
  const [color, setColor] = useState("#D4AF37");
  const [customColor, setCustomColor] = useState("");
  const [description, setDescription] = useState("");
  const [logos, setLogos] = useState<LogoConcept[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bg, setBg] = useState<"white" | "dark">("white");
  const [viewMode, setViewMode] = useState<"icon" | "full">("icon");

  const activeColor = customColor.match(/^#[0-9a-fA-F]{6}$/) ? customColor : color;
  const slug = businessName.toLowerCase().replace(/\s+/g, "-");

  async function generate() {
    setLoading(true);
    setError("");
    setLogos([]);
    setSelected(null);
    try {
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, industry, mood, color: activeColor, description }),
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

  const selectedLogo = selected !== null ? logos[selected] : null;
  const fullLogoSvg = selectedLogo ? buildFullLogoSvg(selectedLogo.svg, businessName) : "";

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        AI generates 6 distinct logo concepts for <strong className="text-gray-700">{businessName || "your business"}</strong> — covering lettermarks, icons, geometric marks, and more. Pick one, download the files.
      </p>

      {/* Industry */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Industry <span className="font-normal text-gray-400">(optional)</span></label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustry(industry === ind ? "" : ind)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                industry === ind
                  ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                  : "border-gray-200 text-gray-600 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/8"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Mood</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                mood === m
                  ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                  : "border-gray-200 text-gray-600 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/8"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Brand color</label>
        <div className="flex items-center gap-3 flex-wrap">
          {PALETTES.map((p) => (
            <button
              key={p.color}
              onClick={() => { setColor(p.color); setCustomColor(""); }}
              title={p.name}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                activeColor === p.color ? "border-gray-800 scale-110 shadow-sm" : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: p.color }}
            />
          ))}
          <div className="flex items-center gap-2 ml-1">
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-200 shrink-0"
              style={{ backgroundColor: customColor.match(/^#[0-9a-fA-F]{6}$/) ? customColor : "#e5e7eb" }}
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="#hex"
              maxLength={7}
              className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Describe your vision <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Something with an upward arrow or mountain, feels premium and trustworthy"
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none text-sm leading-relaxed"
        />
      </div>

      {/* Generate */}
      <button
        onClick={generate}
        disabled={loading || !businessName}
        className="w-full bg-[#D4AF37] hover:bg-[#B8962E] disabled:bg-[#D4AF37]/40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        {loading ? (
          <><RefreshCw className="w-4 h-4 animate-spin" /> Generating 6 concepts...</>
        ) : logos.length > 0 ? (
          <><RefreshCw className="w-4 h-4" /> Regenerate</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Generate logo concepts</>
        )}
      </button>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {/* Results grid */}
      {logos.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pick your favorite</p>
          <div className="grid grid-cols-3 gap-2.5">
            {logos.map((logo, i) => {
              const scoped = scopeIds(logo.svg, `g${i}`);
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`relative flex flex-col items-center gap-2.5 rounded-xl border-2 p-4 transition-all ${
                    selected === i
                      ? "border-[#D4AF37] bg-[#D4AF37]/8 shadow-sm"
                      : "border-gray-100 bg-gray-50 hover:border-[#D4AF37]/40 hover:bg-white"
                  }`}
                >
                  {selected === i && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="w-14 h-14" dangerouslySetInnerHTML={{ __html: scoped }} />
                  <p className="text-xs font-semibold text-gray-600 text-center leading-tight">{logo.concept}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected logo panel */}
      {selectedLogo && (
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          {/* Tabs + bg toggle */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5 bg-gray-50">
            <div className="flex gap-1">
              {(["icon", "full"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    viewMode === mode ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {mode === "icon" ? "Icon" : "Full logo"}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {(["white", "dark"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBg(b)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    bg === b ? "border-[#D4AF37] scale-110" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: b === "white" ? "#ffffff" : "#111111" }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="flex items-center justify-center py-10 px-6 transition-colors min-h-32"
            style={{ backgroundColor: bg === "dark" ? "#111111" : "#ffffff" }}
          >
            {viewMode === "icon" ? (
              <div
                className="w-24 h-24"
                dangerouslySetInnerHTML={{ __html: scopeIds(selectedLogo.svg, "preview") }}
              />
            ) : (
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 shrink-0"
                  dangerouslySetInnerHTML={{ __html: scopeIds(selectedLogo.svg, "full-preview") }}
                />
                <span
                  className="font-bold text-2xl leading-tight"
                  style={{ color: bg === "dark" ? "#ffffff" : "#111111", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
                >
                  {businessName}
                </span>
              </div>
            )}
          </div>

          {/* Downloads */}
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Download</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => downloadSvg(selectedLogo.svg.replace(/<svg /, '<svg width="400" height="400" '), `${slug}-icon.svg`)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 border border-gray-200 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/8 rounded-lg px-3 py-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> SVG icon
              </button>
              <button
                onClick={() => downloadSvg(fullLogoSvg, `${slug}-logo.svg`)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 border border-gray-200 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/8 rounded-lg px-3 py-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Full logo SVG
              </button>
              <button
                onClick={() => downloadPng(selectedLogo.svg, `${slug}-icon-1000px.png`, 1000)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 border border-gray-200 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/8 rounded-lg px-3 py-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> PNG 1000×1000
              </button>
            </div>
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
            Use this logo — Continue <ArrowRight className="w-4 h-4" />
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
          Skip for now →
        </button>
      </div>
    </div>
  );
}
