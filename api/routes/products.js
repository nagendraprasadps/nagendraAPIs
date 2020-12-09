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

router.get('/:filename', (req,res,next)=>{
    console.log(req.params.filename);
    res.status(200).json({
        message:'handling get requests to /products'
    });
});

router.post('/', (req,res,next)=>{

   var sql="select * from   public.users where email='" + req.body.userName + "' and pword='"+req.body.passWord+"';";
   console.log(sql);
   pool.query(sql, (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }
        //console.log("Rows Count:" + rows.rows);
        console.log("Rows Count:" + rows.rowCount);

        if (rows.rowCount == 0){
            res.status(401).json({
                message:'Authentication failed. Please retry with correct username and password.',
                
            });
            
        }
        else {
            //prepare videoclient.ejs
            var htmlbody=[];
            var completed=[];
            
            var sql = "select chapter, video_name, status, video_description,youtube_url from progress_table where email='"+req.body.userName+"' and status='created';";
            pool.query(sql, (err, rows) => {
                if (err) {
                    console.error(err);
                    return;
                }
                else{
                    const data = rows.rows;
                    
                    data.forEach(row => {
                        htmlbody.push("https://www.youtube.com/embed" + `${row.youtube_url}`)
                        
                        
                        });
                       console.log(htmlbody);
                    }
                    //Completed videos adding
                    /*
                    console.log("Adding COMPLETED")
                   
                    var sql = "select chapter, video_name, status, video_description from progress_table where email='"+req.body.userName+"' and status='completed';";
                    console.log(sql);
                    pool.query(sql, (err, rows) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        else
                        {
                            console.log('DB SUCCESS');
                            const data1 = rows.rows;
                            data1.forEach(row => {
                                    completed.push("/resources/" + `${row.video_name}`);
                                    console.log(`${row.video_name}`);
                                });
                            console.log(completed);
                        }  
                    });
                    */
                    //completed video adding
                     //Prepare is completed. Now Render
                    res.render('videoclient',{data:{x:htmlbody}});
           
                });
            }
            


            /*
            fs.readFile('videoclient.html', function(err, data) {
                //console.log(data);
             res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
            });
            */
          
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