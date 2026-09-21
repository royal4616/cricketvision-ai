import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="shell">
    <header class="hero">
      <div>
        <div class="eyebrow">CRICKETVISION AI · MVP</div>
        <h1>Turn a 60 FPS delivery into a cricket analysis report.</h1>
        <p>Upload a delivery, calibrate the measurement distance, mark the release and measurement frames, then review speed, delivery type, shot selection and original commentary.</p>
      </div>
      <div class="badge">60 FPS FIRST</div>
    </header>

    <section class="grid top-grid">
      <article class="panel">
        <div class="section-title"><span>01</span> Video</div>
        <label class="upload">
          <input id="videoInput" type="file" accept="video/*">
          <strong>Choose delivery video</strong>
          <small>Best results: tripod/steady camera, 60 FPS, side-on or behind-bowler view.</small>
        </label>
        <video id="video" controls playsinline></video>
        <div id="videoMeta" class="muted">No video loaded.</div>
      </article>

      <article class="panel">
        <div class="section-title"><span>02</span> Calibration</div>
        <label>Measured distance (metres)
          <input id="distance" type="number" min="1" step="0.01" value="17.68">
        </label>
        <label>FPS
          <input id="fps" type="number" min="1" step="1" value="60">
        </label>
        <div class="hint">Use the actual release-to-measurement-plane distance, not automatically the full pitch length.</div>
      </article>
    </section>

    <section class="panel">
      <div class="section-title"><span>03</span> Frame timing</div>
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
          <div class="muted">At 60 FPS, each frame is 16.67 ms.</div>
        </div>
      </div>
      <button id="calculate" class="primary">Calculate delivery</button>
      <div id="result" class="result"></div>
    </section>

    <section class="grid analysis-grid">
      <article class="panel">
        <div class="section-title"><span>04</span> Bowling analysis</div>
        <div class="field-grid">
          <label>Bowling style<select id="bowlingStyle"><option>Right-arm fast</option><option>Right-arm fast-medium</option><option>Left-arm fast</option><option>Left-arm fast-medium</option><option>Right-arm medium</option><option>Left-arm medium</option><option>Spin</option></select></label>
          <label>Delivery<select id="deliveryType"><option>Good length</option><option>Yorker</option><option>Full</option><option>Short</option><option>Bouncer</option><option>Slower ball</option><option>Cutter</option><option>Inswinger</option><option>Outswinger</option><option>Leg-cutter</option><option>Off-cutter</option></select></label>
          <label>Line<select id="line"><option>Fourth-stump</option><option>Off stump</option><option>Middle</option><option>Leg stump</option><option>Wide outside off</option></select></label>
          <label>Movement<select id="movement"><option>Seam away</option><option>Seam in</option><option>Inswing</option><option>Outswing</option><option>None observed</option></select></label>
        </div>
      </article>

      <article class="panel">
        <div class="section-title"><span>05</span> Batsman shot</div>
        <div class="field-grid">
          <label>Shot<select id="shot"><option>Defence</option><option>Leave</option><option>Cover drive</option><option>Straight drive</option><option>On drive</option><option>Pull</option><option>Hook</option><option>Cut</option><option>Flick</option><option>Sweep</option><option>Reverse sweep</option><option>Advancing / lofted</option></select></label>
          <label>Footwork<select id="footwork"><option>Front foot</option><option>Back foot</option><option>Static</option><option>Advancing</option><option>Retreating</option></select></label>
          <label>Outcome<select id="outcome"><option>Dot ball</option><option>1 run</option><option>2 runs</option><option>3 runs</option><option>Four</option><option>Six</option><option>Wicket</option><option>Beaten</option></select></label>
          <label>Shot quality<select id="quality"><option>Clean timing</option><option>Solid</option><option>Edged</option><option>Mistimed</option><option>Beaten</option></select></label>
        </div>
      </article>
    </section>

    <section class="panel">
      <div class="section-title"><span>06</span> Original commentary</div>
      <div id="commentary" class="commentary">Calculate a delivery to generate commentary.</div>
      <button id="copySummary" class="secondary">Copy delivery summary</button>
    </section>

    <section class="panel">
      <div class="section-title"><span>07</span> Analyst notes</div>
      <div class="stats">
        <div><span>Speed</span><strong id="speedStat">—</strong></div>
        <div><span>Flight time</span><strong id="timeStat">—</strong></div>
        <div><span>Frames</span><strong id="framesStat">—</strong></div>
        <div><span>Data status</span><strong id="statusStat">Awaiting video</strong></div>
      </div>
      <p class="muted">Future AI layer: automatic ball tracking, release detection, pitch/crease calibration, delivery classification, shot recognition and confidence scoring.</p>
    </section>
  </main>
`;

const qs = (s) => document.querySelector(s);
let currentVideoUrl = '';

function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }

function updateTimeline() {
  const r = Math.max(0, Number(qs('#releaseFrame').value) || 0);
  const m = Math.max(r + 1, Number(qs('#measureFrame').value) || r + 1);
  qs('#releaseFrame').value = r;
  qs('#measureFrame').value = m;
  const scale = Math.max(m, 60);
  qs('#markerRelease').style.left = `${clamp((r / scale) * 100, 0, 100)}%`;
  qs('#markerMeasure').style.left = `${clamp((m / scale) * 100, 0, 100)}%`;
  qs('#releaseLabel').textContent = `Release ${r}`;
  qs('#measureLabel').textContent = `Measure ${m}`;
}
qs('#releaseFrame').addEventListener('input', updateTimeline);
qs('#measureFrame').addEventListener('input', updateTimeline);

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
});

qs('#calculate').addEventListener('click', () => {
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
  qs('#statusStat').textContent = 'Calculated';

  qs('#result').innerHTML = `
    <div class="speed-value">${kmh.toFixed(1)} <span>km/h</span></div>
    <div class="muted">${frames} frames · ${seconds.toFixed(3)} s · ${distance.toFixed(2)} m</div>
  `;

  const delivery = qs('#deliveryType').value.toLowerCase();
  const shot = qs('#shot').value.toLowerCase();
  const outcome = qs('#outcome').value.toLowerCase();
  const commentary = buildCommentary(kmh, delivery, shot, outcome);
  qs('#commentary').textContent = commentary;
});

function buildCommentary(speed, delivery, shot, outcome) {
  const pace = speed >= 145 ? 'serious pace' : speed >= 135 ? 'good pace' : speed >= 120 ? 'useful pace' : 'steady pace';
  if (outcome === 'wicket') return `What a delivery! ${speed.toFixed(1)} kilometres an hour and ${pace} — the ${delivery} has done the damage, and the wicket falls!`;
  if (outcome === 'six') return `That has disappeared! ${speed.toFixed(1)} kilometres an hour, the ${delivery} was met by a ${shot}, and it has sailed all the way for six!`;
  if (outcome === 'four') return `Cracked away! ${speed.toFixed(1)} kilometres an hour, the ${delivery} offered just enough, and the ${shot} races away for four!`;
  if (outcome === 'beaten') return `Excellent bowling. ${speed.toFixed(1)} kilometres an hour, ${delivery}, and the batter is beaten by the ${delivery}.`;
  return `${speed.toFixed(1)} kilometres an hour, ${delivery}, met by a ${shot}. ${outcome === 'dot ball' ? 'Good discipline from the bowler — a dot ball.' : `They pick up ${outcome}.`}`;
}

qs('#copySummary').addEventListener('click', async () => {
  const text = `CricketVision AI — ${qs('#speedStat').textContent}; Delivery: ${qs('#deliveryType').value}; Shot: ${qs('#shot').value}; Outcome: ${qs('#outcome').value}; Commentary: ${qs('#commentary').textContent}`;
  try {
    await navigator.clipboard.writeText(text);
    qs('#copySummary').textContent = 'Copied';
    setTimeout(() => qs('#copySummary').textContent = 'Copy delivery summary', 1200);
  } catch {
    qs('#copySummary').textContent = 'Select and copy manually';
  }
});

updateTimeline();
