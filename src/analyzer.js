function waitForEvent(target,event){
  return new Promise((resolve,reject)=>{
    const onDone=()=>{cleanup();resolve()};
    const onError=()=>{cleanup();reject(new Error('Video decoding failed'))};
    const cleanup=()=>{target.removeEventListener(event,onDone);target.removeEventListener('error',onError)};
    target.addEventListener(event,onDone,{once:true});
    target.addEventListener('error',onError,{once:true});
  });
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function frameStats(ctx,w,h){
  const data=ctx.getImageData(0,0,w,h).data;
  let sum=0,sum2=0;
  for(let i=0;i<data.length;i+=4){
    const y=.2126*data[i]+.7152*data[i+1]+.0722*data[i+2];
    sum+=y; sum2+=y*y;
  }
  const n=data.length/4,mean=sum/n;
  return {mean,variance:Math.max(0,sum2/n-mean*mean),data};
}
function difference(a,b){
  let total=0,count=0;
  for(let i=0;i<a.length;i+=16){
    total+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);
    count++;
  }
  return count?total/(count*3):0;
}
function qualityLabel(width,height,variance){
  const pixels=width*height;
  if(pixels>=1920*1080) return variance>900?'GOOD':'FAIR';
  if(pixels>=1280*720) return variance>650?'GOOD':'FAIR';
  return pixels>=640*360?'BORDERLINE':'POOR';
}
async function detectBall(canvas){
  const image=canvas.toDataURL('image/jpeg',0.72);
  const res=await fetch('/api/detect',{method:'POST',headers:{'Content-Type':'text/plain'},body:image});
  if(!res.ok) throw new Error('Vision detector returned '+res.status);
  return res.json();
}
function trajectoryMetrics(detections,width,height,duration){
  const valid=detections.filter(x=>x?.ball_detected&&Array.isArray(x.bbox));
  if(valid.length<3) return {count:valid.length,trajectory:null,confidence:0,ballSpeed:null};
  const pts=valid.map(x=>{const b=x.bbox;return {x:(b[0]+b[2])/2,y:(b[1]+b[3])/2,t:x.t,c:x.confidence||0}});
  let distance=0;
  for(let i=1;i<pts.length;i++) distance+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);
  const elapsed=Math.max(.001,pts[pts.length-1].t-pts[0].t);
  const pxPerSec=distance/elapsed;
  const confidence=pts.reduce((s,p)=>s+p.c,0)/pts.length;
  const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
  const xTravel=Math.abs(xs[xs.length-1]-xs[0]), yTravel=Math.abs(ys[ys.length-1]-ys[0]);
  return {count:valid.length,trajectory:pts,confidence,pxPerSec,xTravel,yTravel,ballSpeed:null};
}
export async function analyzeVideoFile(file,onProgress=()=>{}){
  const video=document.createElement('video');
  video.preload='auto'; video.muted=true; video.playsInline=true;
  video.src=URL.createObjectURL(file);
  try{
    onProgress(5,'READING');
    await waitForEvent(video,'loadedmetadata');
    if(!Number.isFinite(video.duration)||video.duration<=0) throw new Error('Video duration could not be read');
    const width=video.videoWidth,height=video.videoHeight,duration=video.duration;
    const sampleCount=Math.min(18,Math.max(10,Math.ceil(duration*5)));
    const canvas=document.createElement('canvas');
    const scale=Math.min(1,480/Math.max(width,height));
    canvas.width=Math.max(160,Math.round(width*scale));
    canvas.height=Math.max(90,Math.round(height*scale));
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const samples=[],detections=[];
    for(let i=0;i<sampleCount;i++){
      const t=duration*(i/(sampleCount-1));
      video.currentTime=t; await waitForEvent(video,'seeked');
      ctx.drawImage(video,0,0,canvas.width,canvas.height);
      const stats=frameStats(ctx,canvas.width,canvas.height);
      samples.push({t,stats});
      try{
        const d=await detectBall(canvas);
        detections.push({...d,t,xScale:width/canvas.width,yScale:height/canvas.height});
      }catch(e){
        detections.push({ball_detected:false,t,error:e.message});
      }
      onProgress(12+Math.round((i+1)/sampleCount*72),'VISION');
    }
    const motions=[];
    for(let i=1;i<samples.length;i++) motions.push({t:samples[i].t,value:clamp(difference(samples[i-1].stats.data,samples[i].stats.data)/255*100,0,100)});
    const peak=Math.max(...motions.map(x=>x.value),0);
    const sorted=[...motions].sort((a,b)=>b.value-a.value);
    const peakTimes=sorted.slice(0,3).map(x=>x.t);
    const first=peakTimes.length?Math.max(0,Math.min(...peakTimes)-duration*.10):0;
    const last=peakTimes.length?Math.min(duration,Math.max(...peakTimes)+duration*.10):0;
    const varianceAvg=samples.reduce((s,x)=>s+x.stats.variance,0)/samples.length;
    const quality=qualityLabel(width,height,varianceAvg);
    const ball=trajectoryMetrics(detections,width,height,duration);
    const ballCount=ball.count;
    let verdict='No reliable ball track yet';
    let note='The vision service was queried on sampled frames, but there were not enough consistent ball detections to form a trajectory.';
    if(ballCount>=3){
      verdict='Cricket ball detected across multiple frames';
      note='A trained cricket-ball detector produced a multi-frame track. Real-world speed still requires pitch/camera calibration; pixel motion is not presented as km/h.';
    }else if(peak>=18){
      verdict='Delivery motion candidate detected';
      note='Motion is present, but ball tracking confidence is insufficient for a defensible trajectory.';
    }
    return {
      duration,width,height,framesSampled:samples.length,
      motionPeak:peak,
      avgMotion:motions.reduce((s,x)=>s+x.value,0)/Math.max(1,motions.length),
      actionWindow:peakTimes.length?first.toFixed(2)+'–'+last.toFixed(2)+' s':'—',
      quality:{label:quality,variance:varianceAvg},
      verdict,note,ballDetections:ballCount,
      ballConfidence:ball.confidence,
      ballPixelSpeed:ball.pxPerSec||null,
      trajectory:ball.trajectory,
      visionModel:'YOLO cricket-ball detector via server inference'
    };
  }finally{URL.revokeObjectURL(video.src);video.remove();}
}
