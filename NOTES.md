# Pulse Assessment Notes

## Phase 1
- **Bug 1:** The "heartbeat" mechanism in `app/api/poll/route.ts` updated the `lastSeen` timestamp for *all* rows instead of just the caller. This caused users to appear online indefinitely (the "dots stayed on the map for ages" bug). **Fix:** Added a `where: { id }` clause to the `updateMany` call.
- **Bug 2:** Chat messages were not received. In `lib/webrtc.ts`, `sendChat` sent messages with `t: "msg"`, but the data channel's `onmessage` handler checked for `msg.t === "chat"`. **Fix:** Changed `sendChat` to send `{ t: "chat", text }`.
- **Bug 3:** WebRTC connections failed randomly. In `lib/webrtc.ts`, when an "offer" was received, pending ICE candidates were flushed *before* the remote description was set, violating WebRTC protocol. **Fix:** Swapped the order to `setRemoteDescription` first, then `flushPendingCandidates`.
- **Bug 4:** Users remained stuck in "busy" state after a connection ended. In `app/api/signal/route.ts`, the `busy` flag was not reset to `false` when the signal type was `"end"`. **Fix:** Updated the logic to set `busy: false` for both `"decline"` and `"end"` signals.

## Phase 2
*(To be completed)*

## Phase 3
*(To be completed)*

## Phase 4
*(To be completed)*
