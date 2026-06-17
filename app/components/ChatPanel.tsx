"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { strangerName } from "@/lib/webrtc";

export interface ChatMessage {
  id: number;
  mine: boolean;
  text: string;
  ts: number;
}

interface ToastMsg {
  id: number;
  text: string;
}

interface FloatingReaction {
  id: number;
  emoji: string;
  tx: number;
  rightOffset: number;
  scale: number;
}

function formatTime(ms: number) {
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <span className="ml-1 text-xs text-zinc-500">Stranger is typing…</span>
    </div>
  );
}

const REACTIONS = ["🎉", "👋", "😂", "❤️", "🔥", "😮", "👍"];

export default function ChatPanel({
  messages,
  connected,
  videoBusy,
  onSend,
  onStartVideo,
  onEnd,
  isMinimized,
  onToggleMinimize,
  isTyping,
  onReaction,
  floatingReactions,
  peerId,
  onTyping,
}: {
  messages: ChatMessage[];
  connected: boolean;
  videoBusy: boolean;
  onSend: (text: string) => void;
  onStartVideo: () => void;
  onEnd: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  isTyping: boolean;
  onReaction: (emoji: string) => void;
  floatingReactions: FloatingReaction[];
  peerId?: string;
  onTyping?: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(messages.length);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const name = peerId ? strangerName(peerId) : "Stranger";

  useEffect(() => {
    if (!isMinimized) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMinimized]);

  // Toast when minimized
  useEffect(() => {
    const prev = prevCountRef.current;
    const curr = messages.length;
    if (isMinimized && curr > prev) {
      const newMsg = messages[curr - 1];
      if (newMsg && !newMsg.mine) {
        const toast: ToastMsg = { id: newMsg.id, text: newMsg.text };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToasts((t) => [...t, toast]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== toast.id)), 4500);
      }
    }
    prevCountRef.current = curr;
  }, [messages, isMinimized]);

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (draft.trim() && connected) {
        onSend(draft.trim());
        setDraft("");
      }
    },
    [draft, connected, onSend],
  );

  function handleType(e: React.ChangeEvent<HTMLInputElement>) {
    setDraft(e.target.value);
    if (!typingTimeoutRef.current && onTyping && connected) {
      onTyping();
      typingTimeoutRef.current = setTimeout(() => {
        typingTimeoutRef.current = null;
      }, 1000);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(e as unknown as React.FormEvent);
    }
  };

  return (
    <>
      {/* Floating emoji reactions — shown on both sides */}
      <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
        {floatingReactions.map((r) => {
          return (
            <div
              key={r.id}
              className="absolute bottom-24 text-4xl"
              style={{
                right: `${r.rightOffset}px`,
                // @ts-expect-error dynamic CSS properties are fine
                "--tx": `${r.tx}px`,
                "--s": r.scale,
                animation: "float-up 2.5s ease-out forwards",
              }}
            >
              {r.emoji}
            </div>
          );
        })}
      </div>

      {/* Toast notifications when minimized */}
      <div className="absolute right-4 top-20 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-2 rounded-xl bg-zinc-800/95 px-4 py-3 shadow-xl backdrop-blur-md text-sm text-zinc-100 max-w-xs"
          >
            <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
            <span className="line-clamp-2">{t.text}</span>
          </div>
        ))}
      </div>

      {/* Minimized pill */}
      {isMinimized ? (
        <button
          onClick={onToggleMinimize}
          className="absolute bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-zinc-800/90 px-4 py-2.5 text-sm font-medium text-zinc-100 shadow-xl backdrop-blur-md hover:bg-zinc-700/90 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M3.505 2.365A41.369 41.369 0 0 1 9 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 0 0-.577-.069 43.141 43.141 0 0 0-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 0 1 5 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914Z" />
            <path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.32 9 8.998v2.24c0 1.678 1.158 2.85 2.729 2.936.576.032 1.157.049 1.74.049.42 0 .836-.01 1.249-.029l2.459 2.459a.75.75 0 0 0 1.28-.531v-2.07c1.453-.195 2.543-1.333 2.543-2.833V8.998c0-1.678-1.158-2.85-2.729-2.936A41.645 41.645 0 0 0 14 6Z" />
          </svg>
          Chat
          {messages.length > 0 && (
            <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-xs font-bold text-white">
              {messages.length}
            </span>
          )}
        </button>
      ) : (
        <div className="absolute inset-y-0 right-0 z-40 flex w-96 flex-col border-l border-white/10 bg-zinc-950/85 backdrop-blur-xl text-zinc-100 shadow-2xl">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="font-semibold tracking-wide">{name}</p>
              <p className="text-xs text-zinc-500">
                {connected ? "Connected — peer-to-peer" : "Connecting…"}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {!videoBusy && (
                <button
                  onClick={onStartVideo}
                  disabled={!connected}
                  title="Start video call"
                  className="rounded-full border border-zinc-700 p-2 text-zinc-300 hover:border-zinc-500 hover:text-white disabled:opacity-40 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h7.5A2.25 2.25 0 0 0 13 13.75v-7.5A2.25 2.25 0 0 0 10.75 4h-7.5ZM19 7.5a.75.75 0 0 0-1.218-.585l-3.032 2.42V10.665l3.032 2.42A.75.75 0 0 0 19 12.5v-5Z" />
                  </svg>
                </button>
              )}
              <button
                onClick={onToggleMinimize}
                title="Minimize chat"
                className="rounded-full border border-zinc-700 p-2 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={onEnd}
                title="End connection"
                className="rounded-full bg-red-600/90 p-2 text-white hover:bg-red-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 16.352V17.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="mt-8 text-center text-sm text-zinc-500">
                Say hello 👋 Messages are peer-to-peer and never stored.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col gap-0.5 ${m.mine ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.mine
                      ? "bg-emerald-500 text-white rounded-br-sm"
                      : "bg-zinc-800/90 text-zinc-100 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-zinc-600">{formatTime(m.ts)}</span>
              </div>
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={endRef} />
          </div>

          {/* Emoji reactions bar */}
          {connected && (
            <div className="border-t border-white/5 px-3 py-2">
              <div className="flex gap-1 justify-between">
                {REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onReaction(emoji)}
                    className="rounded-lg px-2 py-1 text-xl transition-all hover:scale-125 hover:bg-zinc-800 active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={submit}
            className="flex gap-2 border-t border-white/10 p-3"
          >
            <input
              value={draft}
              onChange={handleType}
              onKeyDown={handleKeyDown}
              placeholder={connected ? "Type a message…" : "Connecting…"}
              disabled={!connected}
              className="flex-1 rounded-full bg-zinc-800/80 px-4 py-2 text-sm outline-none placeholder:text-zinc-600 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 transition-shadow"
            />
            <button
              type="submit"
              disabled={!connected || !draft.trim()}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 hover:bg-emerald-400 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          15% { opacity: 1; transform: translateY(-40px) translateX(calc(var(--tx) * 0.2)) scale(1.2); }
          100% { opacity: 0; transform: translateY(-400px) translateX(var(--tx)) scale(var(--s)); }
        }
      `}</style>
    </>
  );
}
