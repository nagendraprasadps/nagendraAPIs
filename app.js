const express = require('express');
const app=express();
const morgan = require('morgan');
const bodyParser=require('body-parser');
var fs = require('fs');
const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req,res,next)=>{
   /*
    const error= new Error('Not Found');
    error.status=404;
    next(error);
    */
    
    console.log("Got /");
    fs.readFile('login.html', function(err, data) {
        //console.log(data);
     res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
    });
});
app.use((error, req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    });
    });

/*
app.use((req,res,next)=>{
    res.status(200).json({
        message:'it works'
    });
});
*/
module.exports=app;