export default async function handler(req,res){
  if(req.method!=="POST"){res.status(405).json({error:"Method not allowed"});return}
  try{
    const incoming=req.body;
    if(!incoming || typeof incoming!=="string"){res.status(400).json({error:"Expected base64 image body"});return}
    const bytes=Buffer.from(incoming.replace(/^data:image\/[^;]+;base64,/,""),"base64");
    const form=new FormData();
    form.append("file",new Blob([bytes],{type:"image/jpeg"}),"frame.jpg");
    const upstream=await fetch("https://api.vighneshbudharapu.me/detect?model=yolo",{method:"POST",body:form});
    const text=await upstream.text();
    res.status(upstream.status).setHeader("Content-Type","application/json").send(text);
  }catch(error){
    res.status(502).json({error:"Vision inference service unavailable",detail:String(error?.message||error)});
  }
}
