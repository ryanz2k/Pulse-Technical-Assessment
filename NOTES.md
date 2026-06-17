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
- **Call duration timer:** Live `🔴 0:42` timer displayed in the video overlay.
- **Minimizable Chat:** Chat collapses to a floating pill with Google Meet-style message toast notifications when minimized and a message arrives.
- **Typing indicator:** Lightweight `typing` signal sent over the WebRTC data channel triggers a bouncing-dot animation in the chat panel.
- **Message timestamps:** Each bubble shows the time it was sent.
- **EntryGate redesign:** Premium animated hero with grid background, radial glow, floating decorative map dots, feature pills, shimmer-on-hover button.
- **ConnectionPrompt redesign:** Pulsing ring animation for incoming requests, glassmorphism card.
- **Map dot polish:** Larger dots (16px), hover `"Connect"` tooltip via CSS `::after`, emerald green label pill for own location, larger ring animation.
- **Remote camera-off placeholder:** When the remote peer disables their camera, shows a pulsing avatar + message instead of black screen.

## Phase 3
*(To be completed)*

## Phase 4
*(To be completed)*
