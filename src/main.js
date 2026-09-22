import './style.css';
import { analyzeVideoFile } from './analyzer.js';

const app=document.querySelector('#app');

app.innerHTML=`
<header class="nav">
  <a class="brand" href="#"><span class="logo">CV</span><span>CricketVision</span><em>AI</em></a>
  <nav><a href="#product">Product</a><a href="#analytics">Analytics</a><a href="#clubs">For Clubs</a><a href="#media">Media</a></nav>
  <button class="nav-cta" id="demoBtn">Try demo</button>
</header>

<main>
<section class="hero" id="product">
  <div class="hero-copy">
    <div class="pill"><span></span> AI cricket intelligence from ordinary video</div>
    <h1>Turn cricket footage into <strong>actionable insight.</strong></h1>
    <p>Track players. Follow the ball. Understand every delivery. CricketVision transforms a phone recording into professional-style cricket analytics.</p>
    <div class="hero-actions"><button class="primary" id="uploadBtn">Analyze a video <b>→</b></button><button class="ghost" id="watchBtn">See how it works <b>▶</b></button></div>
    <div class="trust"><span>✓ No specialist hardware</span><span>✓ Works with 30–240 FPS</span><span>✓ Confidence-aware AI</span></div>
  </div>
  <div class="hero-card">
    <div class="video-top"><span>LIVE ANALYSIS</span><span class="live"><i></i> PROCESSING</span></div>
    <div class="pitch">
      <div class="trajectory"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="player bowler">●</div><div class="player batter">●</div><div class="ball">●</div>
      <div class="overlay speed"><small>BALL SPEED</small><strong>128.4</strong><span>km/h</span></div>
      <div class="overlay delivery"><small>DELIVERY</small><strong>GOOD LENGTH</strong><span>4th stump · outswing</span></div>
      <div class="overlay shot"><small>BATTER</small><strong>BACK-FOOT CUT</strong><span>Dot ball · 87% confidence</span></div>
    </div>
    <div class="card-foot"><span>Ball 18.4</span><span>Ball tracking <b>91%</b></span><span>Players <b>11</b></span></div>
  </div>
</section>

<section class="stats-strip"><div><strong>1</strong><span>camera</span></div><div><strong>11</strong><span>players tracked</span></div><div><strong>360°</strong><span>match intelligence</span></div><div><strong>1</strong><span>automated report</span></div></section>

<section class="section" id="analytics">
  <div class="section-head"><div><div class="eyebrow">THE PLATFORM</div><h2>From video to cricket intelligence.</h2></div><p>One analysis engine for coaches, players, clubs, tournaments and sports media.</p></div>
  <div class="feature-grid">
    <article><div class="icon">◉</div><h3>Ball intelligence</h3><p>Track release, trajectory, bounce and impact. Estimate pace and build a delivery-by-delivery history.</p><div class="tags"><span>Speed</span><span>Trajectory</span><span>Release</span><span>Bounce</span></div></article>
    <article><div class="icon">⌁</div><h3>Player tracking</h3><p>Identify bowler, batter and fielders and follow their movement throughout the sequence.</p><div class="tags"><span>Pose</span><span>Position</span><span>Movement</span><span>Roles</span></div></article>
    <article><div class="icon">↗</div><h3>Cricket understanding</h3><p>Classify line, length, movement, shot selection and outcome, then turn them into coaching insights.</p><div class="tags"><span>Line</span><span>Length</span><span>Shots</span><span>Outcomes</span></div></article>
  </div>
</section>

<section class="section dark" id="clubs">
  <div class="dashboard-head"><div><div class="eyebrow">COACHING DASHBOARD</div><h2>See what happened. Know what to work on.</h2></div><span class="status">● SESSION COMPLETE</span></div>
  <div class="dashboard">
    <aside><div class="dash-brand">SESSION <b>#2048</b></div><button class="active">Overview</button><button>Bowling</button><button>Batting</button><button>Fielding</button><button>Video</button></aside>
    <div class="dash-main">
      <div class="metric-row"><div><small>AVG SPEED</small><strong>124.8 <i>km/h</i></strong><span class="up">↑ 3.2%</span></div><div><small>DOT BALLS</small><strong>58%</strong><span>21 / 36</span></div><div><small>MAX SPEED</small><strong>132.1 <i>km/h</i></strong><span>Ball 27</span></div><div><small>BOUNDARIES</small><strong>4</strong><span>conceded</span></div></div>
      <div class="charts"><div class="chart"><div class="chart-title">Bowling line & length</div><div class="heat"><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b></div><div class="axis"><span>SHORT</span><span>GOOD</span><span>FULL</span><span>YORKER</span></div></div><div class="insight"><div class="chart-title">AI COACHING INSIGHTS</div><p><b>01</b> Good-length accuracy is your strongest area.</p><p><b>02</b> Pace dropped after the 4th over.</p><p><b>03</b> Short balls generated attacking shots.</p><button>View full report →</button></div>
      <div class="jev-panel"><div class="chart-title">JEV DECISION LAYER</div><div class="jev-grid"><div><span>DELIVERY</span><strong id="jevDelivery">GOOD LENGTH</strong><small id="jevDeliveryConf">Confidence 87%</small></div><div><span>REVIEW</span><strong id="jevReview">NO</strong><small id="jevReviewConf">Decision confidence 91%</small></div><div><span>QUALITY</span><strong id="jevQuality">GOOD</strong><small>Structured decision</small></div></div></div></div>
    </div>
  </div>
</section>

<section class="section" id="media">
  <div class="section-head"><div><div class="eyebrow">BUILT FOR THE GAME</div><h2>One engine. Multiple cricket businesses.</h2></div></div>
  <div class="use-grid"><div><b>ACADEMIES</b><h3>Coach every ball.</h3><p>Automated training reports and player development history.</p></div><div><b>CLUBS</b><h3>Analyze every match.</h3><p>Turn existing match recordings into team analytics.</p></div><div><b>MEDIA</b><h3>Overlay intelligence.</h3><p>Generate live-style graphics, statistics and digital content.</p></div><div><b>PLAYERS</b><h3>Train with evidence.</h3><p>Understand pace, shot selection and recurring weaknesses.</p></div></div>
</section>

<section class="cta"><div><div class="eyebrow">CRICKETVISION AI</div><h2>Your camera already has the data.</h2><p>We're building the intelligence layer that makes it useful.</p><button class="primary" id="ctaBtn">Analyze a video <b>→</b></button></div></section>
</main>

<footer><div class="brand"><span class="logo">CV</span><span>CricketVision</span><em>AI</em></div><span>AI-powered cricket video intelligence</span><span>© 2026 CricketVision</span></footer>

<input id="fileInput" type="file" accept="video/*" hidden>
<div id="modal" class="modal"><div class="modal-card"><button class="close" id="close">×</button><div class="eyebrow">VIDEO ANALYSIS</div><h2>Upload a delivery</h2><p>Choose a cricket video to start the analysis workflow.</p><label class="drop" id="drop">Drop video here or <b>browse files</b><input id="modalInput" type="file" accept="video/*" hidden></label><div id="selected" class="selected"></div><button class="primary full" id="start">Start analysis →</button></div></div>
`;

const modal=document.querySelector('#modal'), modalInput=document.querySelector('#modalInput'), selected=document.querySelector('#selected');
function open(){modal.classList.add('show')} function close(){modal.classList.remove('show')}
['demoBtn','uploadBtn','ctaBtn'].forEach(id=>document.querySelector('#'+id).addEventListener('click',open));
document.querySelector('#watchBtn').addEventListener('click',()=>document.querySelector('#analytics').scrollIntoView({behavior:'smooth'}));
document.querySelector('#close').addEventListener('click',close);
document.querySelector('#drop').addEventListener('click',()=>modalInput.click());
modalInput.addEventListener('change',()=>{const f=modalInput.files[0];if(f)selected.textContent=`Selected: ${f.name} · ${(f.size/1048576).toFixed(1)} MB`});
const analysisBox=document.createElement('div');
analysisBox.className='analysis-results';
analysisBox.innerHTML=`
  <div class="analysis-head"><span>CRICKETVISION VIDEO ANALYSIS</span><b id="analysisStatus">READY</b></div>
  <div class="progress-track"><i id="analysisProgress"></i></div>
  <div class="analysis-grid">
    <div><span>DURATION</span><strong id="resultDuration">—</strong></div>
    <div><span>RESOLUTION</span><strong id="resultResolution">—</strong></div>
    <div><span>FRAMES SAMPLED</span><strong id="resultFrames">—</strong></div>
    <div><span>VIDEO QUALITY</span><strong id="resultQuality">—</strong></div>
    <div><span>MOTION PEAK</span><strong id="resultMotion">—</strong></div>
    <div><span>ACTION WINDOW</span><strong id="resultWindow">—</strong></div>
  </div>
  <div class="analysis-verdict" id="analysisVerdict">Choose a video to begin.</div>
  <div class="analysis-note" id="analysisNote">This first engine performs real browser-side frame analysis. Cricket ball tracking and calibrated speed will be added in the computer-vision stage.</div>
`;
document.querySelector('.modal-card').appendChild(analysisBox);

function setAnalysisProgress(value,status){
  document.querySelector('#analysisProgress').style.width=Math.max(0,Math.min(100,value))+'%';
  document.querySelector('#analysisStatus').textContent=status;
}
function showAnalysis(result){
  document.querySelector('#resultDuration').textContent=result.duration.toFixed(2)+' s';
  document.querySelector('#resultResolution').textContent=result.width+' × '+result.height;
  document.querySelector('#resultFrames').textContent=String(result.framesSampled);
  document.querySelector('#resultQuality').textContent=result.quality.label;
  document.querySelector('#resultMotion').textContent=result.motionPeak.toFixed(1)+' / 100';
  document.querySelector('#resultWindow').textContent=result.actionWindow;
  document.querySelector('#analysisVerdict').textContent=result.verdict;
  document.querySelector('#analysisNote').textContent=result.note;
}

document.querySelector('#start').addEventListener('click',async()=>{
  const f=modalInput.files[0];
  if(!f){selected.textContent='Please choose a video first.';return}
  if(!f.type.startsWith('video/')){selected.textContent='Please choose a video file.';return}
  const start=document.querySelector('#start');
  start.disabled=true;
  start.textContent='Analyzing video…';
  analysisBox.classList.add('show');
  setAnalysisProgress(3,'LOADING');
  selected.textContent='Reading video metadata…';
  try{
    const result=await analyzeVideoFile(f,(progress,status)=>setAnalysisProgress(progress,status));
    showAnalysis(result);
    setAnalysisProgress(100,'COMPLETE');
    selected.textContent='Analysis complete. Results were generated from sampled video frames.';
  }catch(e){
    console.error(e);
    setAnalysisProgress(0,'ERROR');
    selected.textContent='Could not analyze this video in the browser. Try another MP4/MOV file.';
    document.querySelector('#analysisVerdict').textContent='Analysis failed';
    document.querySelector('#analysisNote').textContent=e?.message||'The video could not be decoded by this browser.';
  }finally{
    start.disabled=false;
    start.textContent='Analyze again →';
  }
});
