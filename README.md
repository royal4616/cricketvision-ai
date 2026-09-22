# CricketVision AI

AI-powered cricket video intelligence: turn ordinary cricket footage into structured coaching and performance insights.

## Current architecture

**Video → browser metadata → Jev decision layer → confidence-aware UI**

Jev is used for fast, typed decisions rather than video/image understanding. The future computer-vision pipeline will provide the actual ball/player evidence; Jev will sit above it as the decision and uncertainty layer.

### Jev decisions

- Delivery category
- Video-quality assessment
- Human-review escalation
- Confidence-aware outputs

The API key is server-side only. It is read from `TYPESAFE_API_KEY` and never shipped to the browser.

## Run locally

```bash
npm install
npm run dev
```

For the Jev endpoint, deploy on a platform that supports the included `api/jev.js` serverless function and configure `TYPESAFE_API_KEY`.

The official TypeSafe API exposes a System One endpoint for typed decisions. Check the current TypeSafe API documentation for available model names and request schema.
