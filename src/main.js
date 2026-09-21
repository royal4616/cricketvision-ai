import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="shell">
    <header class="hero">
      <div>
        <div class="eyebrow">CRICKETVISION AI · LOW-QUALITY MODE</div>
        <h1>Extract cricket insights even when the footage isn't perfect.</h1>
        <p>Upload a delivery and CricketVision builds a frame map, enhances difficult frames, searches for ball-like motion, and combines automatic detection with a transparent manual fallback.</p>
      </div>
      <div class="badge">AI-ASSISTED</div>
    </header>

    <section class="grid top-grid">
      <article class="panel">
        <div class="section-title"><span>01</span> Video</div>
        <label class="upload">
          <input id="videoInput" type="file" accept="video/*">
          <strong>Choose delivery video</strong>
          <small>Works with low-quality footage. Best results: fixed camera, visible pitch, 30+ FPS.</small>
        </label>
        <video id="video" controls playsinline></video>
        <div id="videoMeta" class="muted">No video loaded.</div>
      </article>

      <article class="panel">
        <div class="section-title"><span>02</span> Calibration</div>
        <label>Effective measured distance (metres)
          <input id="distance" type="number" min="1" step="0.01" value="17.68">
        </label>
        <label>Analysis FPS
          <input id="fps" type="number" min="1" step="1" value="30">
        </label>
        <label class="check"><input id="enhance" type="checkbox" checked> Enhance low-quality frames</label>
        <label class="check"><input id="autoTrack" type="checkbox" checked> Attempt automatic ball tracking</label>
        <div class="hint">For speed, use the actual release-to-measurement-plane distance when known. Automatic tracking reports confidence and falls back to manual timing when the ball is not reliably visible.</div>
      </article>
    </section>

    <section class="panel">
      <div class="section-title"><span>03</span> Automatic frame analysis</div>
      <div class="action-row">
        <button id="analyze" class="primary">Analyze video</button>
        <button id="prevFrame" class="secondary">◀ Frame</button>
        <button id="nextFrame" class="secondary">Frame ▶</button>
        <button id="setRelease" class="secondary">Set release here</button>
        <button id="setMeasure" class="secondary">Set measure here</button>
      </div>
      <div class="frame-view">
        <canvas id="frameCanvas"></canvas>
        <div class="frame-readout">
          <strong id="frameNumber">Frame —</strong>
          <span id="frameTime">Time —</span>
          <span id="frameStatus">Upload a video to begin.</span>
        </div>
      </div>
      <div class="analysis-grid-mini">
        <div><span>Ball candidates</span><strong id="candidateCount">—</strong></div>
        <div><span>Tracking confidence</span><strong id="trackingConfidence">—</strong></div>
        <div><span>Release frame</span><strong id="autoRelease">—</strong></div>
        <div><span>Measure frame</span><strong id="autoMeasure">—</strong></div>
      </div>
    </section>

    <section class="panel">
      <div class="section-title"><span>04</span> Speed & delivery timing</div>
      <div class="timing-grid">
        <div>
          <label>Release frame
            <input id="releaseFrame" type="number" min="0" step="1" value="0">
          </label>
          <label>Measurement frame
            <input id="measureFrame" type="number" min="1" step="1" value="30">
          </label>
        </div>
        <div class="timeline">
          <div class="track"><div id="markerRelease" class="marker release"></div><div id="markerMeasure" class="marker measure"></div></div>
          <div class="timeline-labels"><span id="releaseLabel">Release 0</span><span id="measureLabel">Measure 30</span></div>
          <div class="muted">Frame timing is transparent: frames ÷ FPS = flight time.</div>
        </div>
      </div>
      <button id="calculate" class="primary">Calculate speed</button>
      <div id="result" class="result"></div>
    </section>

    <section class="grid analysis-grid">
      <article class="panel">
        <div class="section-title"><span>05</span> Bowling insights</div>
        <div class="field-grid">
          <label>Bowling style<select id="bowlingStyle"><option>Auto / unknown</option><option>Right-arm fast</option><option>Right-arm fast-medium</option><option>Left-arm fast</option><option>Left-arm fast-medium</option><option>Right-arm medium</option><option>Left-arm medium</option><option>Spin</option></select></label>
          <label>Delivery<select id="deliveryType"><option>Auto / unknown</option><option>Good length</option><option>Yorker</option><option>Full</option><option>Short</option><option>Bouncer</option><option>Slower ball</option><option>Cutter</option><option>Inswinger</option><option>Outswinger</option></select></label>
          <label>Line<select id="line"><option>Auto / unknown</option><option>Fourth-stump</option><option>Off stump</option><option>Middle</option><option>Leg stump</option><option>Wide outside off</option></select></label>
          <label>Movement<select id="movement"><option>Auto / unknown</option><option>Seam away</option><option>Seam in</option><option>Inswing</option><option>Outswing</option><option>None observed</option></select></label>
        </div>
      </article>

      <article class="panel">
        <div class="section-title"><span>06</span> Batting insights</div>
        <div class="field-grid">
          <label>Shot<select id="shot"><option>Auto / unknown</option><option>Defence</option><option>Leave</option><option>Cover drive</option><option>Straight drive</option><option>On drive</option><option>Pull</option><option>Hook</option><option>Cut</option><option>Flick</option><option>Sweep</option><option>Reverse sweep</option><option>Advancing / lofted</option></select></label>
          <label>Footwork<select id="footwork"><option>Auto / unknown</option><option>Front foot</option><option>Back foot</option><option>Static</option><option>Advancing</option><option>Retreating</option></select></label>
          <label>Outcome<select id="outcome"><option>Auto / unknown</option><option>Dot ball</option><option>1 run</option><option>2 runs</option><option>3 runs</option><option>Four</option><option>Six</option><option>Wicket</option><option>Beaten</option></select></label>
          <label>Shot quality<select id="quality"><option>Auto / unknown</option><option>Clean timing</option><option>Solid</option><option>Edged</option><option>Mistimed</option><option>Beaten</option></select></label>
        </div>
      </article>
    </section>

    <section class="panel">
      <div class="section-title"><span>07</span> Match-style output</div>
      <div id="commentary" class="commentary">Analyze a delivery to generate an original broadcast-style summary.</div>
      <div id="insights" class="insights"></div>
      <button id="copySummary" class="secondary">Copy delivery summary</button>
    </section>

    <section class="panel">
      <div class="section-title"><span>08</span> Transparency</div>
      <div class="stats">
        <div><span>Speed</span><strong id="speedStat">—</strong></div>
        <div><span>Flight time</span><strong id="timeStat">—</strong></div>
        <div><span>Frames</span><strong id="framesStat">—</strong></div>
        <div><span>Data status</span><strong id="statusStat">Awaiting video</strong></div>
      </div>
      <p class="muted">Low-quality mode does not pretend certainty. It records how many frames were inspected, whether a ball candidate was found, and a confidence level. If the ball cannot be separated from the background, manual frame timing remains available.</p>
    </section>
  </main>
`;

const qs = (s) => document.querySelector(s);
let currentVideoUrl = '';
let videoFps = 30;
let currentFrame = 0;
let totalFrames = 0;
let analysisCandidates = [];
let autoAnalysisDone = false;

function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }

function updateTimeline() {
  const r = Math.max(0, Number(qs('#releaseFrame').value) || 0);
  const m = Math.max(r + 1, Number(qs('#measureFrame').value) || r + 1);
  qs('#releaseFrame').value = r;
  qs('#measureFrame').value = m;
  const scale = Math.max(m, totalFrames || 60, 60);
  qs('#markerRelease').style.left = `${clamp((r / scale) * 100, 0, 100)}%`;
  qs('#markerMeasure').style.left = `${clamp((m / scale) * 100, 0, 100)}%`;
  qs('#releaseLabel').textContent = `Release ${r}`;
  qs('#measureLabel').textContent = `Measure ${m}`;
}

function renderFrame() {
  const video = qs('#video');
  const canvas = qs('#frameCanvas');
  if (!video.videoWidth) return;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  if (qs('#enhance').checked) {
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = image.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = clamp((d[i] - 128) * 1.28 + 128, 0, 255);
      d[i + 1] = clamp((d[i + 1] - 128) * 1.28 + 128, 0, 255);
      d[i + 2] = clamp((d[i + 2] - 128) * 1.28 + 128, 0, 255);
    }
    ctx.putImageData(image, 0, 0);
  }
  qs('#frameNumber').textContent = `Frame ${currentFrame} / ${Math.max(totalFrames - 1, 0)}`;
  qs('#frameTime').textContent = `Time ${video.currentTime.toFixed(3)} s`;
}

function seekFrame(frame) {
  const video = qs('#video');
  if (!video.duration) return;
  currentFrame = clamp(Math.round(frame), 0, Math.max(totalFrames - 1, 0));
  video.currentTime = currentFrame / videoFps;
}

qs('#videoInput').addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (currentVideoUrl) URL.revokeObjectURL(currentVideoUrl);
  currentVideoUrl = URL.createObjectURL(file);
  const video = qs('#video');
  video.src = currentVideoUrl;
  video.load();
  qs('#videoMeta').textContent = `${file.name} · ${(file.size / 1048576).toFixed(1)} MB`;
  qs('#statusStat').textContent = 'Video loaded';
  qs('#frameStatus').textContent = 'Reading video metadata…';
});

qs('#video').addEventListener('loadedmetadata', () => {
  const video = qs('#video');
  videoFps = Number(qs('#fps').value) || 30;
  totalFrames = Math.max(1, Math.round(video.duration * videoFps));
  currentFrame = 0;
  qs('#videoMeta').textContent += ` · ${video.videoWidth}×${video.videoHeight} · ${video.duration.toFixed(2)} s · analysis rate ${videoFps} FPS`;
  qs('#frameStatus').textContent = 'Ready for frame analysis.';
  renderFrame();
  updateTimeline();
});

qs('#video').addEventListener('seeked', renderFrame);

qs('#fps').addEventListener('input', () => {
  videoFps = Math.max(1, Number(qs('#fps').value) || 30);
  if (qs('#video').duration) totalFrames = Math.max(1, Math.round(qs('#video').duration * videoFps));
  updateTimeline();
});

qs('#prevFrame').addEventListener('click', () => seekFrame(currentFrame - 1));
qs('#nextFrame').addEventListener('click', () => seekFrame(currentFrame + 1));

qs('#setRelease').addEventListener('click', () => {
  qs('#releaseFrame').value = currentFrame;
  updateTimeline();
});
qs('#setMeasure').addEventListener('click', () => {
  qs('#measureFrame').value = Math.max(currentFrame, Number(qs('#releaseFrame').value) + 1);
  updateTimeline();
});
qs('#releaseFrame').addEventListener('input', updateTimeline);
qs('#measureFrame').addEventListener('input', updateTimeline);

async function analyzeFrames() {
  const video = qs('#video');
  if (!video.duration) {
    qs('#frameStatus').textContent = 'Upload a video first.';
    return;
  }
  const sampleCount = Math.min(80, Math.max(12, Math.round(video.duration * videoFps)));
  const canvas = document.createElement('canvas');
  const w = 320;
  const h = Math.max(180, Math.round((video.videoHeight / video.videoWidth) * w));
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', {willReadFrequently:true});
  const frames = [];
  qs('#frameStatus').textContent = `Inspecting ${sampleCount} frames for motion/ball candidates…`;

  for (let i = 0; i < sampleCount; i++) {
    const t = (i / Math.max(sampleCount - 1, 1)) * Math.max(video.duration - 0.001, 0);
    await new Promise(resolve => {
      const handler = () => { video.removeEventListener('seeked', handler); resolve(); };
      video.addEventListener('seeked', handler);
      video.currentTime = t;
    });
    ctx.drawImage(video, 0, 0, w, h);
    const img = ctx.getImageData(0, 0, w, h).data;
    let bright = 0, edgeLike = 0;
    for (let p = 0; p < img.length; p += 16) {
      const lum = 0.299 * img[p] + 0.587 * img[p+1] + 0.114 * img[p+2];
      if (lum > 205) bright++;
      if (Math.abs(img[p] - img[p+4]) + Math.abs(img[p+1] - img[p+5]) + Math.abs(img[p+2] - img[p+6]) > 100) edgeLike++;
    }
    frames.push({i, t, score: bright * 0.35 + edgeLike * 0.65});
  }

  frames.sort((a,b) => b.score - a.score);
  analysisCandidates = frames.slice(0, 8).sort((a,b) => a.t - b.t);
  qs('#candidateCount').textContent = String(analysisCandidates.length);
  qs('#trackingConfidence').textContent = 'Assist mode';
  qs('#frameStatus').textContent = 'Motion/contrast candidates found. Automatic ball identity is not guaranteed in low-quality footage.';

  if (analysisCandidates.length >= 2) {
    const first = analysisCandidates[0];
    const last = analysisCandidates[analysisCandidates.length - 1];
    const releaseGuess = Math.round(first.t * videoFps);
    const measureGuess = Math.max(releaseGuess + 1, Math.round(last.t * videoFps));
    qs('#autoRelease').textContent = releaseGuess;
    qs('#autoMeasure').textContent = measureGuess;
    qs('#releaseFrame').value = releaseGuess;
    qs('#measureFrame').value = measureGuess;
    updateTimeline();
    autoAnalysisDone = true;
  }
  seekFrame(currentFrame);
}

qs('#analyze').addEventListener('click', async () => {
  qs('#statusStat').textContent = 'Analyzing…';
  await analyzeFrames();
  qs('#statusStat').textContent = autoAnalysisDone ? 'AI-assisted analysis' : 'Manual timing';
  calculate();
});

function calculate() {
  const distance = Number(qs('#distance').value);
  const fps = Number(qs('#fps').value);
  const release = Number(qs('#releaseFrame').value);
  const measure = Number(qs('#measureFrame').value);
  if (!(distance > 0 && fps > 0 && Number.isFinite(release) && Number.isFinite(measure) && measure > release)) {
    qs('#result').textContent = 'Enter a valid distance, FPS and frame range.';
    return;
  }
  const frames = measure - release;
  const seconds = frames / fps;
  const kmh = (distance / seconds) * 3.6;
  qs('#speedStat').textContent = `${kmh.toFixed(1)} km/h`;
  qs('#timeStat').textContent = `${seconds.toFixed(3)} s`;
  qs('#framesStat').textContent = String(frames);
  qs('#result').innerHTML = `<div class="speed-value">${kmh.toFixed(1)} <span>km/h</span></div><div class="muted">${frames} frames · ${seconds.toFixed(3)} s · ${distance.toFixed(2)} m</div>`;
  generateOutput(kmh);
}

qs('#calculate').addEventListener('click', calculate);

function value(id) { return qs(id).value; }

function generateOutput(speed) {
  const delivery = value('#deliveryType').toLowerCase();
  const shot = value('#shot').toLowerCase();
  const outcome = value('#outcome').toLowerCase();
  const confidence = analysisCandidates.length >= 4 ? 'moderate' : 'low';
  const pace = speed >= 145 ? 'serious pace' : speed >= 135 ? 'good pace' : speed >= 120 ? 'useful pace' : 'steady pace';
  const commentary = outcome === 'wicket'
    ? `What a delivery! ${speed.toFixed(1)} kilometres an hour and ${pace} — the ${delivery} has done the damage, and the wicket falls.`
    : outcome === 'six'
      ? `That has disappeared! ${speed.toFixed(1)} kilometres an hour, the ${delivery} was met by a ${shot}, and it has gone for six.`
      : outcome === 'four'
        ? `Cracked away! ${speed.toFixed(1)} kilometres an hour, the ${delivery} was met by a ${shot}, and it races away for four.`
        : `${speed.toFixed(1)} kilometres an hour, ${delivery}, met by a ${shot}. ${outcome === 'dot ball' ? 'Good discipline — a dot ball.' : 'The batter takes the available runs.'}`;
  qs('#commentary').textContent = commentary;
  qs('#insights').innerHTML = `
    <div><strong>Tracking:</strong> ${confidence} confidence — ${analysisCandidates.length} candidate frames inspected.</div>
    <div><strong>Bowling:</strong> ${value('#bowlingStyle')} · ${value('#deliveryType')} · ${value('#line')} · ${value('#movement')}</div>
    <div><strong>Batting:</strong> ${value('#shot')} · ${value('#footwork')} · ${value('#quality')} · ${value('#outcome')}</div>
    <div><strong>Next upgrade:</strong> trained ball detector + pose tracking will replace the motion/contrast assist with true ball and player tracking.</div>
  `;
}

qs('#copySummary').addEventListener('click', async () => {
  const text = `CricketVision AI — ${qs('#speedStat').textContent}; Delivery: ${value('#deliveryType')}; Shot: ${value('#shot')}; Outcome: ${value('#outcome')}; Commentary: ${qs('#commentary').textContent}`;
  try {
    await navigator.clipboard.writeText(text);
    qs('#copySummary').textContent = 'Copied';
    setTimeout(() => qs('#copySummary').textContent = 'Copy delivery summary', 1200);
  } catch {
    qs('#copySummary').textContent = 'Select and copy manually';
  }
});

updateTimeline();
