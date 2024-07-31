const express = require('express');
const router = express.Router();
var app = express();
const flash = require('connect-flash');


app.use(flash());


router.get('/',(req,res)=>{
    res.render('temp');
});

module.exports=router;
