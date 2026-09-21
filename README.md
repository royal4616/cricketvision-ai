# CricketVision AI

AI-assisted cricket video analysis designed to extract useful insights from ordinary and low-quality footage.

## Current build

- Local video upload and playback
- Frame-by-frame stepping
- Automatic frame sampling for motion/contrast candidates
- Low-quality frame enhancement
- Automatic release/measurement **assist** with transparent confidence
- Calibrated bowling-speed calculation
- Bowling and batting tagging
- Original broadcast-style delivery summary
- Manual fallback when automatic ball identification is unreliable

## Important accuracy design

CricketVision does not treat every bright/moving object as the ball. The current browser-only tracker is an assist layer that finds motion/contrast candidates; it explicitly reports low confidence when the ball cannot be isolated.

For production-grade automatic analysis, the next model layer should add:
1. Small-object ball detection trained on cricket footage.
2. Multi-frame ball tracking with Kalman/trajectory constraints.
3. Bowler and batter pose tracking.
4. Pitch/crease perspective calibration.
5. Automatic release, bounce and impact detection.
6. Delivery classification (length, line, swing/seam/cutters).
7. Shot classification and outcome detection.
8. Confidence intervals rather than a single unqualified speed number.

## Speed

speed (km/h) = measured distance (m) / flight time (s) × 3.6

flight time = frame difference / FPS

The measured distance must correspond to the release-to-measurement plane. The app exposes the frames, FPS and distance so results remain auditable.
