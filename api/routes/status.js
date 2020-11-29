var fs = require('fs');
const express = require('express');
const router=express.Router();
const { Pool, Client } = require('pg');
const connectionString = 'postgres://trikfpbvsuufym:26299662100d6bb1ac6e13dfbcecf3ecca09e85b6b59fab0b97c3a3bac15fde7@ec2-34-237-166-54.compute-1.amazonaws.com:5432/d1p47bpqtgcj4d'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
var pool = new Pool({
    connectionString: connectionString,
   ssl:true
})


router.post('/:vfile', (req,res,next)=>{
	console.log("REACHED statusRoute");
	vfile=req.params.vfile;
	vfile=vfile.split('/');
	
	var uname=vfile[0].split('::')
	console.log(uname[0]);
	vfile=uname[0];
	vfile = vfile.slice(0,vfile.length-3);
	  vfile =vfile + "png";
	  console.log(vfile);
	console.log(uname[1]);
	//update uname[0] as completed in database
	 var sql = "update progress_table set status='completed' where email='" +uname[1]+"' and video_name='" +vfile+"' ;";
	 console.log(sql);
	 pool.query(sql, (err, rows) => {
		if (err) {
			console.error(err);
			
		}
	});
	pool.end;
	pool = new Pool({
		connectionString: connectionString,
	   ssl:true
	})
	//prepare videoclient.ejs
	var htmlbody=[];
            
	sql = "select chapter, video_name, status, video_description from progress_table where email='"+uname[1]+"' and status='created';";
	pool.query(sql, (err, rows) => {
		if (err) {
			console.error(err);
			return;
		}
		else{
			const data1 = rows.rows;
			
			data1.forEach(row => {
				htmlbody.push("/resources/" + `${row.video_name}`)
				
				
				});
			   console.log(htmlbody);
			}
			
			 //Prepare is completed. Now Render
			res.render('videoclient',{data:{x:htmlbody}});
   
		});
});

router.get('/:vfile', (req,res,next)=>{
    console.log("REACHED statusRoute");
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