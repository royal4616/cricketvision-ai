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
    <div class="hero-actions"><button class="primary" id="uploadBtn">Record a test delivery <b>●</b></button><button class="ghost" id="watchBtn">See recording setup <b>↓</b></button></div>
    <div class="trust"><span>✓ 60 FPS required</span><span>✓ Side-on camera only</span><span>✓ Bright, even lighting</span></div>
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

<section class="cta"><div><div class="eyebrow">CRICKETVISION AI</div><h2>Record it the right way.</h2><p>CricketVision will analyze the controlled test recording frame by frame.</p><button class="primary" id="ctaBtn">Analyze a video <b>→</b></button></div></section>
</main>

<footer><div class="brand"><span class="logo">CV</span><span>CricketVision</span><em>AI</em></div><span>AI-powered cricket video intelligence</span><span>© 2026 CricketVision</span></footer>

<div id="modal" class="modal"><div class="modal-card recorder-card"><button class="close" id="close">×</button><div class="eyebrow">CONTROLLED TEST CAPTURE</div><h2>Record a delivery</h2><p>CricketVision accepts camera recordings only for this test. The app will reject footage that is not captured at 60 FPS.</p>
<div class="setup-grid">
  <div class="setup-item"><b>01</b><span>60 FPS</span><small>Use 1080p / 60 FPS or higher.</small></div>
  <div class="setup-item"><b>02</b><span>90° SIDE-ON</span><small>Camera square to the pitch, bowling-arm side.</small></div>
  <div class="setup-item"><b>03</b><span>STABLE + LEVEL</span><small>Tripod or fixed mount, hip height.</small></div>
  <div class="setup-item"><b>04</b><span>GOOD LIGHT</span><small>Bright, even light; no backlit bowler.</small></div>
</div>
<div class="camera-frame"><video id="cameraPreview" autoplay muted playsinline></video><div class="camera-guide"><span>KEEP FULL RUN-UP + RELEASE + FOLLOW-THROUGH IN FRAME</span></div><div class="camera-badge" id="cameraBadge">CAMERA OFF</div></div>
<div class="capture-specs"><span id="captureFps">FPS —</span><span id="captureResolution">RESOLUTION —</span><span id="captureAngle">SIDE-ON REQUIRED</span></div>
<div id="selected" class="selected">Press “Start camera” and allow camera access.</div>
<div class="record-actions"><button class="ghost full" id="cameraStart">Start camera</button><button class="primary full" id="recordBtn" disabled>Record 6-second test</button><button class="ghost full" id="stopBtn" disabled>Stop recording</button></div>
<div id="recordStatus" class="record-status">Setup check: 60 FPS + side-on + good lighting.</div></div></div>
`;

const modal=document.querySelector('#modal');
const selected=document.querySelector('#selected');
const cameraPreview=document.querySelector('#cameraPreview');
const cameraStart=document.querySelector('#cameraStart');
const recordBtn=document.querySelector('#recordBtn');
const stopBtn=document.querySelector('#stopBtn');
const recordStatus=document.querySelector('#recordStatus');
const cameraBadge=document.querySelector('#cameraBadge');
const captureFps=document.querySelector('#captureFps');
const captureResolution=document.querySelector('#captureResolution');

let cameraStream=null;
let mediaRecorder=null;
let recordedChunks=[];
let recordingTimer=null;
let recorderStartTime=0;

function open(){modal.classList.add('show')}
function close(){
  modal.classList.remove('show');
  stopCamera();
}
['demoBtn','uploadBtn','ctaBtn'].forEach(id=>document.querySelector('#'+id).addEventListener('click',open));
document.querySelector('#watchBtn').addEventListener('click',()=>{
  document.querySelector('#analytics').scrollIntoView({behavior:'smooth'});
  setTimeout(open,350);
});
document.querySelector('#close').addEventListener('click',close);

function setRecordStatus(text,ok=false){
  recordStatus.textContent=text;
  recordStatus.classList.toggle('ok',ok);
}
function stopCamera(){
  if(recordingTimer) clearInterval(recordingTimer);
  recordingTimer=null;
  if(mediaRecorder && mediaRecorder.state!=='inactive') mediaRecorder.stop();
  if(cameraStream) cameraStream.getTracks().forEach(t=>t.stop());
  cameraStream=null;
  cameraPreview.srcObject=null;
  cameraStart.disabled=false;
  recordBtn.disabled=true;
  stopBtn.disabled=true;
  cameraBadge.textContent='CAMERA OFF';
  cameraBadge.classList.remove('recording');
}
function supportedMime(){
  const types=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];
  return types.find(t=>MediaRecorder.isTypeSupported(t))||'';
}
async function startCamera(){
  if(!navigator.mediaDevices?.getUserMedia){
    setRecordStatus('Camera capture is unavailable. Open the HTTPS Vercel site in a modern browser.');
    return;
  }
  try{
    stopCamera();
    setRecordStatus('Requesting a 60 FPS camera…');
    const stream=await navigator.mediaDevices.getUserMedia({
      audio:false,
      video:{
        facingMode:{ideal:'environment'},
        width:{min:1280,ideal:1920,max:1920},
        height:{min:720,ideal:1080,max:1080},
        frameRate:{min:60,ideal:60}
      }
    });
    const track=stream.getVideoTracks()[0];
    const settings=track.getSettings();
    const fps=Number(settings.frameRate||0);
    const w=Number(settings.width||0), h=Number(settings.height||0);
    if(fps<59){
      stream.getTracks().forEach(t=>t.stop());
      throw new Error(`Camera delivered ${fps ? fps.toFixed(0) : 'unknown'} FPS. This test requires 60 FPS. Switch to the phone's 60 FPS video mode and try again.`);
    }
    if(w<1280 || h<720 || w<=h){
      stream.getTracks().forEach(t=>t.stop());
      throw new Error('Use landscape 1080p (or at least 720p) video. Rotate the phone horizontally and try again.');
    }
    cameraStream=stream;
    cameraPreview.srcObject=stream;
    captureFps.textContent=`${fps.toFixed(0)} FPS ✓`;
    captureResolution.textContent=`${w} × ${h}`;
    cameraBadge.textContent='CAMERA READY';
    cameraBadge.classList.add('ready');
    cameraStart.disabled=true;
    recordBtn.disabled=false;
    setRecordStatus('Camera passed the technical check. Confirm the side-on framing, then record one delivery.',true);
  }catch(e){
    console.error(e);
    setRecordStatus(e?.message||'Could not start the camera.');
    cameraBadge.textContent='CAMERA ERROR';
  }
}
function beginRecording(){
  if(!cameraStream) return;
  recordedChunks=[];
  const mime=supportedMime();
  if(!mime){setRecordStatus('This browser cannot record the camera stream in a supported format.');return}
  mediaRecorder=new MediaRecorder(cameraStream,{mimeType:mime,videoBitsPerSecond:12000000});
  mediaRecorder.ondataavailable=e=>{if(e.data?.size) recordedChunks.push(e.data)};
  mediaRecorder.onstop=async()=>{
    const blob=new Blob(recordedChunks,{type:mime});
    await analyzeRecording(blob);
  };
  mediaRecorder.start(250);
  recorderStartTime=Date.now();
  recordBtn.disabled=true;
  stopBtn.disabled=false;
  cameraBadge.textContent='● RECORDING';
  cameraBadge.classList.add('recording');
  setRecordStatus('Recording… bowl one natural delivery. Keep the full action in frame.',true);
  recordingTimer=setInterval(()=>{
    const seconds=(Date.now()-recorderStartTime)/1000;
    recordStatus.textContent=`Recording… ${Math.min(6,seconds).toFixed(1)} / 6.0 s`;
    if(seconds>=6) stopRecording();
  },100);
}
function stopRecording(){
  if(recordingTimer) clearInterval(recordingTimer);
  recordingTimer=null;
  if(mediaRecorder && mediaRecorder.state!=='inactive'){
    mediaRecorder.stop();
    stopBtn.disabled=true;
    cameraBadge.textContent='PROCESSING';
    setRecordStatus('Recording captured. Starting CricketVision analysis…');
  }
}
async function analyzeRecording(blob){
  try{
    analysisBox.classList.add('show');
    setAnalysisProgress(3,'LOADING');
    selected.textContent=`Captured ${(blob.size/1048576).toFixed(1)} MB from the 60 FPS camera.`;
    const result=await analyzeVideoFile(blob,(progress,status)=>setAnalysisProgress(progress,status));
    showAnalysis(result);
    setAnalysisProgress(100,'COMPLETE');
    selected.textContent='Analysis complete. This result came directly from the controlled camera recording.';
  }catch(e){
    console.error(e);
    setAnalysisProgress(0,'ERROR');
    selected.textContent='The recorded clip could not be analyzed.';
    document.querySelector('#analysisVerdict').textContent='Analysis failed';
    document.querySelector('#analysisNote').textContent=e?.message||'The recording could not be decoded.';
  }finally{
    cameraBadge.textContent='CAMERA READY';
    cameraBadge.classList.add('ready');
    cameraBadge.classList.remove('recording');
    recordBtn.disabled=!cameraStream;
    setRecordStatus('Ready for another 6-second test delivery.',true);
  }
}
cameraStart.addEventListener('click',startCamera);
recordBtn.addEventListener('click',beginRecording);
stopBtn.addEventListener('click',stopRecording);

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
    <div><span>BALL DETECTIONS</span><strong id="resultBallDetections">—</strong></div>
    <div><span>BALL CONFIDENCE</span><strong id="resultBallConfidence">—</strong></div>
  </div>
  <div class="analysis-verdict" id="analysisVerdict">Record a controlled test delivery to begin.</div>
  <div class="analysis-note" id="analysisNote">CricketVision is currently gated to 60 FPS, landscape, side-on test recordings. The ball tracker will use the captured frames for the next computer-vision stage.</div>
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
  document.querySelector('#resultBallDetections').textContent=String(result.ballDetections);
  document.querySelector('#resultBallConfidence').textContent=result.ballConfidence?Math.round(result.ballConfidence*100)+'%':'—';
  document.querySelector('#analysisVerdict').textContent=result.verdict;
  document.querySelector('#analysisNote').textContent=result.note;
}
