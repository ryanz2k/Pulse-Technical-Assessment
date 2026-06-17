# Pulse Assessment Notes

## Phase 1
- **Bug 1:** The "heartbeat" mechanism in `app/api/poll/route.ts` updated the `lastSeen` timestamp for *all* rows instead of just the caller. This caused users to appear online indefinitely (the "dots stayed on the map for ages" bug). **Fix:** Added a `where: { id }` clause to the `updateMany` call.
- **Bug 2:** Chat messages were not received. In `lib/webrtc.ts`, `sendChat` sent messages with `t: "msg"`, but the data channel's `onmessage` handler checked for `msg.t === "chat"`. **Fix:** Changed `sendChat` to send `{ t: "chat", text }`.
- **Bug 3:** WebRTC connections failed randomly. In `lib/webrtc.ts`, when an "offer" was received, pending ICE candidates were flushed *before* the remote description was set, violating WebRTC protocol. **Fix:** Swapped the order to `setRemoteDescription` first, then `flushPendingCandidates`.
- **Bug 4:** Users remained stuck in "busy" state after a connection ended. In `app/api/signal/route.ts`, the `busy` flag was not reset to `false` when the signal type was `"end"`. **Fix:** Updated the logic to set `busy: false` for both `"decline"` and `"end"` signals.

## Phase 2
- **Video Layout & Options:** Completely reworked `VideoPanel`. Fixed PIP overlap by moving it above the control bar. Added a live call duration timer. Added SVG icon-based Mute/Stop Video/End Call controls with labeled buttons.
- **Remote Video-Off Indicator:** When the remote peer disables their camera (or has no stream yet), a pulsing avatar placeholder is shown instead of a black screen. Tracks `MediaStreamTrack.mute` events to react in real-time.
- **Minimizable Chat:** `ChatPanel` now has a minimize button (–) that collapses it to a floating pill in the bottom-right corner. When minimized and the stranger sends a message, a Google Meet-style toast slides in from the right. Chat restores on click.
- **Chat While on Video:** `VideoPanel` is layout-aware — when the chat is open, the video shrinks to avoid overlap. When minimized, it fills the full screen.
- **Typing Indicator:** Sending a message emits a lightweight `"typing"` control signal over the WebRTC data channel. When received, a bouncing dot animation ("Stranger is typing…") appears in the chat panel.
- **Message Timestamps:** Every message bubble now shows the time it was sent.
- **EntryGate Redesign:** Premium animated hero screen with a grid background, radial glow, floating decorative map dots, feature pills, and a shimmer-on-hover button.
- **ConnectionPrompt Redesign:** Replaced the plain dialog with a pulsing ring animation (like an incoming phone call) and glassmorphism styling.

## Phase 3
*(To be completed)*

## Phase 4
*(To be completed)*
