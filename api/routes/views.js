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
console.log("views");
router.get('/', (req,res,next)=>{
    console.log(req.url);
    vfile= req.url;
		res.render(vfile);
});
   



module.exports = router;