const express = require('express');
const router=express.Router();

router.get('/', (req,res,next)=>{
    res.status(200).json({
        message:'orders were fecthed'
    });
});

router.post('/', (req,res,next)=>{
    res.status(200).json({
        message:'orders were fecthed'
    });
});
module.exports = router;