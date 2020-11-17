const express = require('express');
const router=express.Router();
const { Pool, Client } = require('pg')
const connectionString = 'postgres://trikfpbvsuufym:26299662100d6bb1ac6e13dfbcecf3ecca09e85b6b59fab0b97c3a3bac15fde7@ec2-34-237-166-54.compute-1.amazonaws.com:5432/d1p47bpqtgcj4d?ssl=true'

const pool = new Pool({
  connectionString: connectionString,
})

router.get('/', (req,res,next)=>{
    res.status(200).json({
        message:'handling get requests to /products'
    });
});

router.post('/', (req,res,next)=>{

   var sql="select * from   public.users where uname='" + req.body.userName + "' and pword='"+req.body.passWord+"';";
   console.log(sql);
   pool.query(sql, (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }
        //console.log("Rows Count:" + rows.rows);
        console.log("Rows Count:" + rows.rows.rowCount);

        if (rows.rowCount == 0){
            res.status(401).json({
                message:'Authentication failed. Please retry with correct username and password.',
                
            });
        }
        else {
    
            res.status(201).json({
                message:'handling POST request'
                
            });
        }
});
});

router.get('/:productid',(req,res,next)=>{
    const id=req.params.productid;
    if(id=='special'){
        res.status(200).json({
            message:'Special ID'
        });
    }
    else
    {
        res.status(200).json({
            message:'You passed an ID'
        });
    }
});
module.exports = router;