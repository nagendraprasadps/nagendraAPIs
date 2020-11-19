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
    fs.readFile(vfile, function (err, data) {
       
        if (err) {
            throw err;
        }
        movie_mp4 = data;
        res.writeHead(200, {'Content-Type': 'video/mp4'});
        res.write(data);
        return res.end();
    });
        
});
   



module.exports = router;