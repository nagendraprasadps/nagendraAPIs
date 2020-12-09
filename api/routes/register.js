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
console.log("REACHED REGISTER");
router.get('/', (req,res,next)=>{
    console.log("REACHED REGISTER");
         res.render('register')
        });        
   
router.post('/complete', (req,res,next)=>{
    console.log("REACHED REGISTER/complete");
    var sql="select email from   public.users where email='" + req.body.email +"';";
    console.log(sql);
    pool.query(sql, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Rows Count:" + rows.rowCount);
        if (rows.rowCount == 0){
         var sql="insert into public.users (email, pword, grade, medium, phone, student_name, place) values ('" + req.body.email +"','" +req.body.psw + "'," +req.body.std + ",'"+req.body.medium + "','"+req.body.phone + "','"+req.body.fullname + "','"+req.body.address +  "');";
         console.log(sql);
         pool.query(sql, (err, rows) => {
                  if (err) {
                      console.error(err);
                  }
                  else{
                      console.log('Second select');
                    sql="select * from master_table where grade="+req.body.std+" and medium='"+req.body.medium +"';";
                    console.log(sql);
                    pool.query(sql, (err, rows) => {
                        if (err) {
                            console.error(err);
                        }
                        else
                        {
                            const data = rows.rows;

                            console.log('all data');
                            data.forEach(row => {
                                console.log(`VideoName: ${row.video_name} Subject: ${row.subject} Medium: ${row.medium}`);
                                sql = "insert into progress_table (email,subject,chapter,video_name,video_description,youtube_url,status) values ('" +req.body.email+ "','"+ `${row.subject}` + "','"+`${row.chapter}` + "','"+ `${row.video_name}` +"','" +`${row.description}` + "','" +`${row.youtube_url}` +"','created');";
                                console.log(sql);
                                pool.query(sql, (err, rows) => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                });
                               
                            });
                            res.render('successlogin',{data: {userQuery: req.body.email} });
                        } //else
                    });//pool query
                  }//else
                });//pool query
             
            } else{
                res.status(400).json({
                    message:'This email ID is already registered. Please login.',
                    
                });
            }
        });
    });
        
  



module.exports = router;