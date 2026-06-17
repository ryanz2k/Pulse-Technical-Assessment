"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Map as MapboxMap, Marker } from "mapbox-gl";
import type { PeerDot } from "@/lib/types";

const TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ??
  "pk.eyJ1IjoicHVsc2UtbWFwIiwiYSI6ImNrMDBkZW1vMDAwMDAwMDAifQ.AAAAAAAAAAAAAAAAAAAAAA";

function dotColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return `hsl(${Math.abs(hash) % 360}, 75%, 62%)`;
}

export default function WorldMap({
  peers,
  me,
  onPeerClick,
  canConnect,
}: {
  peers: PeerDot[];
  me: { lat: number; lng: number } | null;
  onPeerClick: (id: string) => void;
  canConnect: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const meMarkerRef = useRef<Marker | null>(null);
  const [ready, setReady] = useState(false);
  const [isGlobe, setIsGlobe] = useState(true);

  const onPeerClickRef = useRef(onPeerClick);
  const canConnectRef = useRef(canConnect);
  useEffect(() => {
    onPeerClickRef.current = onPeerClick;
    canConnectRef.current = canConnect;
  });

  // Initialise the map once.
  useEffect(() => {
    if (!TOKEN || !containerRef.current) return;
    let cancelled = false;
    const markers = markersRef.current;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !containerRef.current) return;
      mapboxgl.accessToken = TOKEN;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: me ? [me.lng, me.lat] : [0, 20],
        zoom: me ? 4 : 1.8,
        attributionControl: true,
        antialias: true,
        projection: "globe",
      });

      map.on("load", () => {
        if (cancelled) return;
        // Atmospheric fog for depth
        map.setFog({
          color: "rgb(8, 8, 16)",
          "high-color": "rgb(16, 24, 40)",
          "horizon-blend": 0.06,
          "space-color": "rgb(4, 4, 12)",
          "star-intensity": 0.8,
        });
        setReady(true);
      });

      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }),
        "top-right",
      );
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      markers.forEach((m) => m.remove());
      markers.clear();
      meMarkerRef.current?.remove();
      meMarkerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle globe / flat projection
  const toggleProjection = async () => {
    const map = mapRef.current;
    if (!map) return;
    const mapboxgl = (await import("mapbox-gl")).default;
    const next = !isGlobe;
    setIsGlobe(next);
    map.setProjection(next ? "globe" : "mercator");
    if (next) {
      // Zoom out to see the globe nicely
      map.easeTo({ zoom: 1.5, duration: 600 });
      // Configure dark space and fog for the globe view
      map.setFog({
        color: "rgb(5, 5, 10)",
        "high-color": "rgb(16, 24, 40)",
        "horizon-blend": 0.06,
        "space-color": "rgb(4, 4, 12)",
        "star-intensity": 0.9,
      });
    } else {
      map.easeTo({ zoom: me ? 3 : 1.8, duration: 600 });
    }
    void mapboxgl; // satisfy import
  };

  // Show / move the user's own pin.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !me) return;
    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled) return;
      if (!meMarkerRef.current) {
        const el = document.createElement("div");
        el.className = "pulse-me";
        el.title = "You are here";
        el.innerHTML = `<span class="pulse-me-label">Me</span>📍`;
        meMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([me.lng, me.lat])
          .addTo(map);
      } else {
        meMarkerRef.current.setLngLat([me.lng, me.lat]);
      }
    })();

    return () => { cancelled = true; };
  }, [me, ready]);

  // Reconcile peer markers.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled) return;
      const markers = markersRef.current;
      const seen = new Set<string>();

      for (const peer of peers) {
        seen.add(peer.id);
        let marker = markers.get(peer.id);
        if (!marker) {
          const el = document.createElement("button");
          el.className = "pulse-dot";
          el.style.background = dotColor(peer.id);
          el.title = "Tap to connect";
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            if (canConnectRef.current) onPeerClickRef.current(peer.id);
          });
          marker = new mapboxgl.Marker({ element: el })
            .setLngLat([peer.lng, peer.lat])
            .addTo(map);
          markers.set(peer.id, marker);
        }
        const elem = marker.getElement();
        elem.style.opacity = peer.busy ? "0.3" : "1";
        elem.style.pointerEvents = peer.busy || !canConnect ? "none" : "auto";
      }

      for (const [id, marker] of markers) {
        if (!seen.has(id)) {
          marker.remove();
          markers.delete(id);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [peers, ready, canConnect]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full bg-zinc-950" />

      {!TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <p className="max-w-md rounded-lg bg-zinc-800 p-4 text-sm text-zinc-200">
            Set{" "}
            <code className="text-emerald-400">NEXT_PUBLIC_MAPBOX_TOKEN</code> in{" "}
            <code>.env</code> to load the map.
          </p>
        </div>
      )}

      {/* Top-left: App name overlay */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/80 px-4 py-2 shadow-lg backdrop-blur-md">
          <span className="text-base font-bold tracking-wide text-white">Pulse</span>
          <span className="h-3.5 w-px bg-zinc-700" />
          <span className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {peers.length} live
          </span>
        </div>
      </div>

      {/* Bottom-left: controls */}
      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2">
        {me && (
          <button
            onClick={() =>
              mapRef.current?.flyTo({ center: [me.lng, me.lat], zoom: 4, pitch: 0, bearing: 0 })
            }
            className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-zinc-300 shadow-lg backdrop-blur-md transition-colors hover:bg-zinc-800/90 hover:text-white"
          >
            📍 Center on me
          </button>
        )}

        <button
          onClick={toggleProjection}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-zinc-300 shadow-lg backdrop-blur-md transition-colors hover:bg-zinc-800/90 hover:text-white"
          title={isGlobe ? "Switch to flat view" : "Switch to globe view"}
        >
          {isGlobe ? "🗺️ Flat view" : "🌍 Globe view"}
        </button>
      </div>
    </div>
  );
}
