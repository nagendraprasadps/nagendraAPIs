var fs = require('fs');
const express = require('express');
const router=express.Router();
const { Pool, Client } = require('pg');
const connectionString = 'postgres://wxfmawymzebjgl:89ae8229f0b36d4e45fdead08bd8cfcf09b1740c61436388e1b9668e4c0fd4c7@ec2-18-233-207-22.compute-1.amazonaws.com:5432/dcs86ucjrgqgdf'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const pool = new Pool({
    connectionString: connectionString,
   ssl:true
})

router.get('/:vfile', (req,res,next)=>{
    console.log("REACHED");
	vfile="./api/routes/" + req.url;
	if (vfile.indexOf('.png') > 0){
		fs.readFile(vfile, function(err, data) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			return res.end();
		});	
	}
	else{

		const range=req.headers.range;
		if (!range){
			res.status(400).send("Requires range header");
		}
		const videoPath=vfile;
		const videoSize= fs.statSync(vfile).size;
		const CHUNK_SIZE=10 ** 6;
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
	} 
});
   



module.exports = router;