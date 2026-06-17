"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff,
} from "lucide-react";

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
  let btnClass =
    "flex h-13 w-13 items-center justify-center rounded-full transition-all duration-200 shadow-lg hover:scale-105 ";

  if (danger) {
    btnClass += "bg-red-600 text-white hover:bg-red-500";
  } else if (active === false) {
    btnClass += "bg-red-600 text-white hover:bg-red-500";
  } else {
    btnClass += "bg-zinc-700/90 text-white hover:bg-zinc-600";
  }

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 group" title={title}>
      <div className={btnClass} style={{ height: 52, width: 52 }}>
        {children}
      </div>
      <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 transition-colors">
        {title}
      </span>
    </button>
  );
}

export default function VideoPanel({
  localStream,
  remoteStream,
  remoteVideoEnabled,
  onEnd,
  onCameraToggle,
  isChatMinimized,
}: {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  remoteVideoEnabled: boolean;
  onEnd: () => void;
  onCameraToggle: (enabled: boolean) => void;
  isChatMinimized?: boolean;
}) {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [duration, setDuration] = useState(0);

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
    if (!el || el.srcObject === remoteStream) return;
    el.srcObject = remoteStream;
  }, [remoteStream]);

  const toggleAudio = () => {
    if (localStream) {
      const next = !isAudioEnabled;
      localStream.getAudioTracks().forEach((t) => (t.enabled = next));
      setIsAudioEnabled(next);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const next = !isVideoEnabled;
      localStream.getVideoTracks().forEach((t) => (t.enabled = next));
      setIsVideoEnabled(next);
      onCameraToggle(next);
    }
  };

  // Layout: when chat is open, leave right=96 (384px) for chat panel
  const rightClass = isChatMinimized ? "right-0" : "right-96";

  return (
    <div className={`absolute z-30 inset-y-0 left-0 flex flex-col bg-zinc-950 transition-all duration-300 ${rightClass}`}>
      <div className="relative flex-1 overflow-hidden">
        {/* Remote video area */}
        {remoteStream ? (
          <>
            <video
              ref={remoteRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
            {!remoteVideoEnabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-900">
                <div className="relative flex h-28 w-28 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-zinc-700/40 animate-pulse" />
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-700 text-5xl shadow-xl">
                    👤
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm font-medium text-zinc-300">Stranger turned off their camera</p>
                  <p className="text-xs text-zinc-500">Audio is still connected</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-zinc-900">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-700 text-5xl shadow-xl">
                👤
              </div>
            </div>
            <p className="text-sm font-medium text-zinc-400">Waiting for stranger&rsquo;s video…</p>
          </div>
        )}

        {/* Local PIP — always stays in the video area's bottom-right */}
        <div className="absolute bottom-24 right-4 z-10">
          <div className="relative h-36 w-24 overflow-hidden rounded-xl border border-white/20 bg-zinc-800 shadow-2xl">
            <video
              ref={localRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover transition-opacity duration-300 ${!isVideoEnabled ? "opacity-0" : "opacity-100"}`}
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-zinc-500">
                <VideoOff size={20} />
                <span className="text-[9px]">Camera off</span>
              </div>
            )}
            <div className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-white/60">You</div>
          </div>
        </div>

        {/* Call duration timer */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/50 px-4 py-1.5 text-xs font-mono text-zinc-300 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          {formatDuration(duration)}
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-center gap-8 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent px-8 py-5 pb-7">
        <ControlButton onClick={toggleAudio} active={isAudioEnabled} title={isAudioEnabled ? "Mute" : "Unmute"}>
          {isAudioEnabled ? <Mic size={22} /> : <MicOff size={22} />}
        </ControlButton>

        <ControlButton onClick={toggleVideo} active={isVideoEnabled} title={isVideoEnabled ? "Stop Video" : "Start Video"}>
          {isVideoEnabled ? <Video size={22} /> : <VideoOff size={22} />}
        </ControlButton>

        <ControlButton onClick={onEnd} danger title="End Call">
          <PhoneOff size={22} />
        </ControlButton>
      </div>
    </div>
  );
}
