import { Moon } from "lucide-react";

interface Props {
  dark?: boolean;
  size?: "sm" | "md";
}

export default function Logo({ dark = false, size = "md" }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Moon
        className={size === "sm" ? "w-4 h-4" : "w-5 h-5"}
        fill="currentColor"
        strokeWidth={0}
        style={{ color: dark ? "#a5b4fc" : "#4f46e5" }}
      />
      <span
        className={`font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"} ${size === "sm" ? "text-sm" : "text-base"}`}
      >
        The Midnight Founder
      </span>
    </div>
  );
}
