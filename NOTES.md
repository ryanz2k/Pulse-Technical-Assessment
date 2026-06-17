# Pulse Assessment Notes

## Phase 1
- **Bug 1:** The "heartbeat" mechanism in `app/api/poll/route.ts` updated the `lastSeen` timestamp for *all* rows instead of just the caller. This caused users to appear online indefinitely (the "dots stayed on the map for ages" bug). **Fix:** Added a `where: { id }` clause to the `updateMany` call.
- **Bug 2:** Chat messages were not received. In `lib/webrtc.ts`, `sendChat` sent messages with `t: "msg"`, but the data channel's `onmessage` handler checked for `msg.t === "chat"`. **Fix:** Changed `sendChat` to send `{ t: "chat", text }`.
- **Bug 3:** WebRTC connections failed randomly. In `lib/webrtc.ts`, when an "offer" was received, pending ICE candidates were flushed *before* the remote description was set, violating WebRTC protocol. **Fix:** Swapped the order to `setRemoteDescription` first, then `flushPendingCandidates`.
- **Bug 4:** Users remained stuck in "busy" state after a connection ended. In `app/api/signal/route.ts`, the `busy` flag was not reset to `false` when the signal type was `"end"`. **Fix:** Updated the logic to set `busy: false` for both `"decline"` and `"end"` signals.

## Phase 2
### Bug Fixes
- **Refresh disconnect:** On `pagehide`/`beforeunload`, the app now sends an `"end"` signal to the connected peer via `navigator.sendBeacon` before tearing down. This ensures the peer's session closes immediately on refresh instead of waiting for the stale-presence timeout.
- **"Stranger turned off camera" showing incorrectly:** The original approach used `MediaStreamTrack.mute` events, which only fire when RTP packets stop entirely—not when `track.enabled = false`. Fixed by adding `camera-off` / `camera-on` WebRTC data channel control signals. When a user toggles their camera, the correct signal is sent and the remote side updates a `remoteVideoEnabled` prop instead of guessing from track state.
- **Video layout not pushing chat aside:** The `VideoPanel` previously used `padding-right` on an `absolute inset-0` div, which has no effect on child positioning. Fixed by using `right-96` / `right-0` on the panel itself, matching the `w-96` chat panel width.
- **Broken SVG icons when muted/stopped:** The complex heroicons 20×20 paths rendered incorrectly in the browser. Replaced all inline SVG icons with `lucide-react` (`Mic`, `MicOff`, `Video`, `VideoOff`, `PhoneOff`) which are reliable and well-tested.

### UI/UX Improvements
- **Call duration timer:** Live timer displayed in the video overlay.
- **Minimizable Chat:** Chat collapses to a floating pill with Google Meet-style message toast notifications when minimized and a message arrives.
- **Typing indicator:** Lightweight `typing` signal sent over the WebRTC data channel triggers a bouncing-dot animation in the chat panel.
- **Message timestamps:** Each bubble shows the time it was sent.
- **EntryGate redesign:** Premium animated hero with grid background, radial glow, floating decorative map dots, feature pills, shimmer-on-hover button.
- **ConnectionPrompt redesign:** Pulsing ring animation for incoming requests, glassmorphism card.
## Phase 3: Security & Performance
*(To be completed)*

## Phase 4: Polish & Features
### Interactive & Fun Features
- **🌍 Globe view toggle:** A "Globe view" button on the map switches Mapbox to a globe projection with atmospheric fog, dark space colors, and stars. Toggling back returns to the flat map. The map now starts in Globe view by default.
- **🎉 Confetti blast:** Clicking the 🎉 emoji in the chat triggers a full-screen confetti explosion for both users (using `canvas-confetti` and a WebRTC control signal).
- **😂 Spam-able Emoji Reactions:** The chat's reaction bar is now permanently expanded. Users can spam reactions (👋, 😂, ❤️, 🔥, etc.), which float up like Facebook/Instagram Live reactions.
- **🕵️ Anonymous Stranger Names:** Each peer is assigned a consistent, deterministic name (e.g. "Silent Wave") derived from their ID hash. This name appears in the video header, chat header, and toast notifications.

### UI & Layout Adjustments
- **PIP aspect ratio:** Fixed local "You" camera from portrait to landscape 16:9 (`160×90`), showing the full camera width.
- **Video Call Header:** Added a top overlay inside the video stream showing the stranger's name and a live call timer side by side.
- **End Call icon:** Simplified the icon from a crossed-out phone to a plain red handset.
- **App Name & Live Count:** Added a glassmorphism "Pulse · N live" pill overlay to the top-left of the World Map.
- **Disabled background dots:** While in a call, other peer dots become non-interactive (`pointer-events: none`) to prevent accidental connection attempts.
