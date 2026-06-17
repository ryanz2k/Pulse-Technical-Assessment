"use client";

import { useEffect, useRef, useState } from "react";

// SVG Icon components — no icon library needed
function MicOnIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
      <path d="M5.5 9.643a.75.75 0 0 0-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5H10.5v-1.546A6.001 6.001 0 0 0 16 10v-.357a.75.75 0 0 0-1.5 0V10a4.5 4.5 0 0 1-9 0v-.357Z" />
    </svg>
  );
}
function MicOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a6 6 0 0 0 1.715-4.602.75.75 0 1 0-1.498.135 4.5 4.5 0 0 1-1.303 3.43l-.73-.73A3 3 0 0 0 13 10V5.56l-2-2H7a3 3 0 0 0-2.976 2.671L3.28 2.22ZM7 4h1.56l5 5H13V4a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v6c0 .295.043.58.124.849L7 10.748V4ZM10.5 15.954V17.5H12a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1 0-1.5h1.5v-1.546A6.001 6.001 0 0 1 4 10v-.357a.75.75 0 0 1 1.5 0V10a4.5 4.5 0 0 0 6.382 4.087l-1.06-1.06A3 3 0 0 1 7 10V8.81L5.344 7.154A5.972 5.972 0 0 0 4 10a6.001 6.001 0 0 0 6.5 5.954Z" />
    </svg>
  );
}
function CameraOnIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h7.5A2.25 2.25 0 0 0 13 13.75v-7.5A2.25 2.25 0 0 0 10.75 4h-7.5ZM19 7.5a.75.75 0 0 0-1.218-.585l-3.032 2.42V10.665l3.032 2.42A.75.75 0 0 0 19 12.5v-5Z" />
    </svg>
  );
}
function CameraOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M1 4.75A.75.75 0 0 1 1.75 4h.77l13.83 13.83a.75.75 0 0 1-1.06 1.06L12.54 16H3.25A2.25 2.25 0 0 1 1 13.75v-9ZM3.28 4h7.47A2.25 2.25 0 0 1 13 6.25v4.8l.004-.003.031-.025 2.657-2.127a1.5 1.5 0 0 1 2.438 1.171v5.154a1.5 1.5 0 0 1-.756 1.302L3.28 4Z" />
    </svg>
  );
}
function PhoneDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 16.352V17.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
    </svg>
  );
}

function ControlButton({
  onClick,
  active,
  danger,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  const base = "flex flex-col items-center gap-1 group transition-all";
  const btnBase =
    "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 shadow-lg";

  let btnClass = btnBase;
  if (danger) {
    btnClass += " bg-red-600 text-white hover:bg-red-500 hover:scale-105";
  } else if (active === false) {
    // toggled OFF (e.g. muted)
    btnClass += " bg-red-600/90 text-white hover:bg-red-500 hover:scale-105";
  } else {
    btnClass += " bg-zinc-700/80 text-white hover:bg-zinc-600 hover:scale-105";
  }

  return (
    <button onClick={onClick} className={base} title={title}>
      <div className={btnClass}>{children}</div>
      <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 transition-colors">
        {title}
      </span>
    </button>
  );
}

export default function VideoPanel({
  localStream,
  remoteStream,
  onEnd,
  isChatMinimized,
}: {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEnd: () => void;
  isChatMinimized?: boolean;
}) {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [remoteVideoActive, setRemoteVideoActive] = useState(false);
  const [duration, setDuration] = useState(0);

  // Timer for call duration
  useEffect(() => {
    const interval = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (localRef.current && localRef.current.srcObject !== localStream) {
      localRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    const el = remoteRef.current;
    if (!el) return;
    if (el.srcObject !== remoteStream) {
      el.srcObject = remoteStream;
    }
    if (!remoteStream) {
      setRemoteVideoActive(false);
      return;
    }
    // Listen for track mute/unmute to detect remote camera toggle
    const checkTracks = () => {
      const vt = remoteStream.getVideoTracks();
      setRemoteVideoActive(vt.length > 0 && vt.some((t) => t.enabled && !t.muted));
    };
    checkTracks();
    const tracks = remoteStream.getTracks();
    tracks.forEach((t) => {
      t.addEventListener("mute", checkTracks);
      t.addEventListener("unmute", checkTracks);
    });
    // Also poll on the video element playing state
    el.addEventListener("playing", checkTracks);
    return () => {
      tracks.forEach((t) => {
        t.removeEventListener("mute", checkTracks);
        t.removeEventListener("unmute", checkTracks);
      });
      el.removeEventListener("playing", checkTracks);
    };
  }, [remoteStream]);

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((t) => (t.enabled = !isAudioEnabled));
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((t) => (t.enabled = !isVideoEnabled));
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  // Right padding shifts content left when chat is open
  const contentRight = isChatMinimized ? "pr-0" : "pr-80";

  return (
    <div className={`absolute inset-0 z-30 flex flex-col bg-zinc-950 transition-all duration-300 ${contentRight}`}>
      <div className="relative flex-1 overflow-hidden">
        {/* Remote video or placeholder */}
        {remoteStream ? (
          <>
            <video
              ref={remoteRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
            {!remoteVideoActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-900">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-700 text-5xl shadow-xl">
                  👤
                </div>
                <p className="text-sm font-medium text-zinc-300">Stranger turned off camera</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-zinc-900">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-700 text-5xl shadow-xl animate-pulse">
              👤
            </div>
            <p className="text-sm font-medium text-zinc-400">Waiting for stranger&rsquo;s video…</p>
          </div>
        )}

        {/* Local PIP */}
        <div className="absolute bottom-24 right-4 flex flex-col items-end gap-2">
          <div className="relative h-36 w-24 overflow-hidden rounded-xl border border-white/20 bg-zinc-800 shadow-2xl">
            <video
              ref={localRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover transition-opacity ${!isVideoEnabled ? "opacity-0" : "opacity-100"}`}
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-zinc-500">
                <CameraOffIcon />
                <span className="text-[9px]">You</span>
              </div>
            )}
          </div>
        </div>

        {/* Call duration overlay */}
        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-xs font-mono text-zinc-300 backdrop-blur-sm">
          🔴 {formatDuration(duration)}
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-center gap-6 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent px-8 py-5">
        <ControlButton onClick={toggleAudio} active={isAudioEnabled} title={isAudioEnabled ? "Mute" : "Unmute"}>
          {isAudioEnabled ? <MicOnIcon /> : <MicOffIcon />}
        </ControlButton>

        <ControlButton onClick={toggleVideo} active={isVideoEnabled} title={isVideoEnabled ? "Stop Video" : "Start Video"}>
          {isVideoEnabled ? <CameraOnIcon /> : <CameraOffIcon />}
        </ControlButton>

        <ControlButton onClick={onEnd} danger title="End Call">
          <PhoneDownIcon />
        </ControlButton>
      </div>
    </div>
  );
}
