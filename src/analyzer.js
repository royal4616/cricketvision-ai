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
  const n=data.length/4;
  const mean=sum/n;
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
export async function analyzeVideoFile(file,onProgress=()=>{}){
  const video=document.createElement('video');
  video.preload='auto';
  video.muted=true;
  video.playsInline=true;
  video.src=URL.createObjectURL(file);
  try{
    onProgress(8,'READING');
    await waitForEvent(video,'loadedmetadata');
    if(!Number.isFinite(video.duration)||video.duration<=0) throw new Error('Video duration could not be read');
    const width=video.videoWidth;
    const height=video.videoHeight;
    const duration=video.duration;
    const sampleCount=Math.min(24,Math.max(10,Math.ceil(duration*8)));
    const canvas=document.createElement('canvas');
    const scale=Math.min(1,160/Math.max(width,height));
    canvas.width=Math.max(80,Math.round(width*scale));
    canvas.height=Math.max(45,Math.round(height*scale));
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const samples=[];
    for(let i=0;i<sampleCount;i++){
      const t=duration*(i/(sampleCount-1));
      video.currentTime=t;
      await waitForEvent(video,'seeked');
      ctx.drawImage(video,0,0,canvas.width,canvas.height);
      const stats=frameStats(ctx,canvas.width,canvas.height);
      samples.push({t,stats});
      onProgress(12+Math.round((i+1)/sampleCount*68),'SAMPLING');
    }
    const motions=[];
    for(let i=1;i<samples.length;i++){
      motions.push({t:samples[i].t,value:clamp(difference(samples[i-1].stats.data,samples[i].stats.data)/255*100,0,100)});
    }
    const peak=Math.max(...motions.map(x=>x.value),0);
    const sorted=[...motions].sort((a,b)=>b.value-a.value);
    const peakTimes=sorted.slice(0,Math.min(3,sorted.length)).map(x=>x.t);
    const first=peakTimes.length?Math.max(0,Math.min(...peakTimes)-duration*.10):0;
    const last=peakTimes.length?Math.min(duration,Math.max(...peakTimes)+duration*.10):0;
    const avgMotion=motions.reduce((s,x)=>s+x.value,0)/Math.max(1,motions.length);
    const midPeak=peakTimes.some(t=>t>duration*.08&&t<duration*.92);
    const varianceAvg=samples.reduce((s,x)=>s+x.stats.variance,0)/samples.length;
    const quality=qualityLabel(width,height,varianceAvg);
    let verdict='No clear bowling action detected';
    let note='The video was decoded and sampled successfully, but the motion pattern was not strong enough to label a delivery candidate.';
    if(peak>=18&&midPeak){
      verdict='Bowling action / delivery candidate detected';
      note='The engine found a concentrated motion event in the delivery sequence. This is a video-analysis signal, not yet a trained cricket-ball detector.';
    }
    if(peak>=35&&midPeak){
      verdict='Strong delivery motion detected';
      note='A strong temporal motion peak was found. Ball position, release, bounce and calibrated speed still require the dedicated computer-vision model.';
    }
    return {
      duration,width,height,framesSampled:samples.length,
      motionPeak:peak,
      avgMotion,
      actionWindow:peakTimes.length?((first.toFixed(2)+'–'+last.toFixed(2))+' s'):'—',
      quality:{label:quality,variance:varianceAvg},
      verdict,
      note
    };
  }finally{
    URL.revokeObjectURL(video.src);
    video.remove();
  }
}
