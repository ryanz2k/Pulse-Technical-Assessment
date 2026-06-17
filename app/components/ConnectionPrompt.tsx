"use client";

export default function ConnectionPrompt({
  title,
  subtitle,
  acceptLabel,
  declineLabel,
  onAccept,
  onDecline,
}: {
  title: string;
  subtitle?: string;
  acceptLabel: string;
  declineLabel: string;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="relative w-full max-w-xs overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/95 p-6 text-center text-zinc-100 shadow-2xl">
        {/* Incoming ring animation */}
        <div className="mb-4 flex justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-20 w-20 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "1.5s" }} />
            <div className="absolute h-14 w-14 rounded-full bg-emerald-500/30 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.3s" }} />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/60 bg-zinc-800 text-3xl shadow-lg shadow-emerald-500/20">
              {acceptLabel === "Accept" ? "👤" : "📹"}
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}

        <div className="mt-5 flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 rounded-full border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800 transition-colors"
          >
            {declineLabel}
          </button>
          <button
            onClick={onAccept}
            className="flex-1 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/30"
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
