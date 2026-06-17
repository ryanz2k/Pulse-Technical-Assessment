"use client";

import { useState } from "react";

export default function EntryGate({
  onReady,
}: {
  onReady: (lat: number, lng: number) => void;
}) {
  const [status, setStatus] = useState<"idle" | "locating" | "error">("idle");
  const [error, setError] = useState<string>("");

  function enter() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("Your browser doesn't support location access.");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => onReady(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        setStatus("error");
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission is required to place you on the map."
            : "Couldn't get your location. Please try again.",
        );
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    );
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden bg-zinc-950 p-6 text-zinc-100">
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[100px]" />
      </div>

      {/* Animated dots mockup */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[
          { top: "22%", left: "18%", color: "#34d399", delay: "0s", size: 10 },
          { top: "35%", left: "65%", color: "#60a5fa", delay: "0.4s", size: 12 },
          { top: "60%", left: "30%", color: "#f59e0b", delay: "0.8s", size: 9 },
          { top: "70%", left: "72%", color: "#a78bfa", delay: "0.2s", size: 11 },
          { top: "15%", left: "52%", color: "#f87171", delay: "1s", size: 10 },
          { top: "80%", left: "50%", color: "#34d399", delay: "0.6s", size: 8 },
          { top: "45%", left: "85%", color: "#fb923c", delay: "0.3s", size: 10 },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 border-white/80"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              backgroundColor: dot.color,
              boxShadow: `0 0 0 0 ${dot.color}80`,
              animation: `entry-pulse 2.5s ease-out ${dot.delay} infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 shadow-xl shadow-emerald-500/10">
            <span className="text-3xl">🌐</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Pulse
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-xs">
            A living globe of anonymous strangers. Drop onto the map, find a dot, and connect.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {["🌍 Live map", "💬 Peer-to-peer chat", "📹 Video calls", "🔒 No accounts"].map((f) => (
            <span
              key={f}
              className="rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400"
            >
              {f}
            </span>
          ))}
        </div>

        <button
          onClick={enter}
          disabled={status === "locating"}
          className="group relative overflow-hidden rounded-full bg-emerald-500 px-10 py-3.5 font-semibold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/50 disabled:opacity-60 disabled:hover:scale-100"
        >
          <span className="relative z-10">
            {status === "locating" ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Locating…
              </span>
            ) : (
              "Enter Pulse"
            )}
          </span>
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
        </button>

        {status === "error" && (
          <p className="max-w-sm rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        <p className="text-center text-xs text-zinc-600">
          Your dot is placed 1–3 km from your real location. No data is ever stored.
        </p>
      </div>

      <style>{`
        @keyframes entry-pulse {
          0% { box-shadow: 0 0 0 0 var(--pulse-color, rgba(255,255,255,0.4)); }
          70% { box-shadow: 0 0 0 10px rgba(0,0,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
        }
      `}</style>
    </div>
  );
}
