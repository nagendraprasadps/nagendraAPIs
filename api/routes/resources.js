var fs = require('fs');
const express = require('express');
const router=express.Router();
const { Pool, Client } = require('pg');
const connectionString = 'postgres://trikfpbvsuufym:26299662100d6bb1ac6e13dfbcecf3ecca09e85b6b59fab0b97c3a3bac15fde7@ec2-34-237-166-54.compute-1.amazonaws.com:5432/d1p47bpqtgcj4d'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const pool = new Pool({
    connectionString: connectionString,
   ssl:true
})

router.get('/:vfile', (req,res,next)=>{
    console.log("REACHED");
    vfile="./api/routes/" + req.url;
    const range=req.headers.range;
	if (!range){
		res.status(400).send("Requires range header");
    }
    const videoPath=vfile;
	const videoSize= fs.statSync(vfile).size;
	const CHUNK_SIZE=10 ** 4;
	const start=Number(range.replace(/\D/g,""));
	const end= Math.min(start+ CHUNK_SIZE,videoSize-1);
	const contentLength = end-start+1;
	const headers={
		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
		"Accept-Ranges"	: "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4",
	};
	res.writeHead(206,headers);
	const videoStream = fs.createReadStream(videoPath,{start,end});
	
	videoStream.pipe(res);
        
});
   



module.exports = router;