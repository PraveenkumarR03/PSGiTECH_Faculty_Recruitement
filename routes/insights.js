const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require("passport");

const fs = require('fs');

const router = express.Router();

//Requiring models
const Event = require("../models/events");
const User = require("../models/users");
const Workshop = require("../models/workshops");
const College = require("../models/college");
const Referal = require("../models/referal");
const Transaction = require("../models/transaction");
const Nte = require("../models/nte");
const Onspot = require("../models/onspot");
const OnspotEvent = require("../models/offlinereg");
const Desk = require("../models/desk");
const Cont = require("../models/counters");
router.get('/details', iLog, async function(req,res){
    var user = req.user;
    var data = null;
    var onspot = null;
    if (req.user.accountType=="admin"||req.user.accountType=="org"||req.user.accountType=="inc") {
        res.render('dashboard',{data,user,onspot});
    } else {
        req.flash('message' , 'You are not allowed to access this page');
        res.redirect('/profile');
        res.end();
    }
});

router.post('/details', iLog, async function(req,res){
    var user = req.user;
    if (req.user.accountType=="admin"||req.user.accountType=="org"||req.user.accountType=="inc") {
        if (req.body.eid) {
            var data = await Transaction.find({eventid:Number(req.body.eid),status:1});
            var onspot = await Onspot.find({eventid:Number(req.body.eid)});

        }
        res.render('dashboard',{data,user,onspot});
        
    } else {
        req.flash('message' , 'You are not allowed to access this page');
        res.redirect('/profile');
        res.end();
    }

});


// // Onspot Registration
// router.get('/onspot',iLog, async function(req,res){
//     var user = req.user
//     var details = null;
//     var online = null;
//     var spot = null;
//     var onspotEvent = null;
//     var not = null;
//     if(req.user.accountType=="admin"||req.user.accountType=="reg"){
//         res.render("onspot",{user,details,online,spot,onspotEvent,not});
//     }   else {
//         req.flash('message' , 'You are not allowed to access this page');
//         res.redirect('/profile');
//         res.end();
//     }

// });

// router.post('/onspot',iLog, async function(req,res){
//     if(req.user.accountType=="admin"||req.user.accountType=="reg"){
//     var user = req.user;
//     var id = Number(req.body.pid);
//     var details = await User.findOne({yukid:id});
//     var online = await Transaction.find({yukid:id,status:1});
//     var not = await Transaction.find({yukid:id,status:{$ne:1}})
//     var spot = await Onspot.find({yukid:id});
//     var onspotevent = await OnspotEvent.find(({availability:{$gt:0}}));
    
//         res.render("onspot",{user,details,online,spot,onspotevent,not});
//     } else {
//         req.flash('message' , 'You are not allowed to access this page');
//         res.redirect('/profile');
//         res.end();
//     }
// });

// router.post('/issueband/:id',iLog,async function(req,res){
//     if(req.user.accountType=="admin"||req.user.accountType=="reg"){
//         var yukid = Number(req.params.id);
//         var user = await User.findOne({yukid:yukid});
//         user.bi2=true;
//         user.issuedby = req.user.yukid;
//         user.save();
//         // console.log(user);
//         res.redirect('/insights/onspot');
//     } else {
//         req.flash('message' , 'You are not allowed to access this page');
//         res.redirect('/profile');
//         res.end();
//     }
// });

// router.post('/onspotregister/:id',iLog,async function(req,res){
//     if(req.user.accountType=="admin"||req.user.accountType=="reg"){
//         var yukid = Number(req.params.id);
//         var eventid = Number(req.body.event);
//         var user = await User.findOne({yukid:yukid});

//         var userid   = Number(user.yukid);
//         var username = user.email;
//         var name     = user.name;
//         var trim_name = name.replace(/\s/g, "");
//         var mobileno = user.number;
//         var event_name = "";

//         var amount   = 0;

//         if(eventid >=401 && eventid <= 415){
//             var event = await OnspotEvent.findOne({eventid:eventid});
//                 if(event && event.availability>0){
//                     amount = 200;
//                     event_name = event.name;
//                     event.availability -= 1;
//                     event.save();
//                     var user = await User.findOneAndUpdate({yukid:userid},{
//                         $push:{
//                             techevents:{
//                                 name:event_name,
//                                 id:eventid,
//                                 tid:99999,
//                                 paid:true
//                             }
//                         }
                        
//                     }); 
//                     var user = await User.findOneAndUpdate({yukid:userid},{
//                         $push:{
//                             techevents:{
//                                 name:event_name,
//                                 id:eventid,
//                                 tid:99999,
//                                 paid:true
//                             }
//                         }
                        
//                     }); 
//                     var amt=await Cont.findOne({id:"onamt"});
//                     var money=amt.seq;
//                     money=money+amount;
//                     await Cont.updateOne({id:"onamt"},{seq:money});
//                 }
//                 else{
//                     req.flash('message' , 'Registration Closed :(');
//                     res.redirect('/profile');
//                     res.end();
//                 }
            
//         }
//         else if(eventid >=216 && eventid <= 220){
//             var event = await OnspotEvent.findOne({eventid:eventid});

//                 if(event && event.availability>0){
//                     amount = 200;
//                     event_name = event.name;
//                     event.availability -= 1;
//                     event.save();
//                     var user = await User.findOneAndUpdate({yukid:userid},{
//                         $push:{
//                             techevents:{
//                                 name:event_name,
//                                 id:eventid,
//                                 tid:99999,
//                                 paid:true
//                             }
//                         }
//                     }); 
//                     var user = await User.findOneAndUpdate({yukid:userid},{
//                         $push:{
//                             techevents:{
//                                 name:event_name,
//                                 id:eventid,
//                                 tid:99999,
//                                 paid:true
//                             }
//                         }
//                     }); 
//                     var amt=await Cont.findOne({id:"onamt"});
//                     var money=amt.seq;
//                     money=money+amount;
//                     await Cont.updateOne({id:"onamt"},{seq:money});
//                 }
//                 else{
//                     req.flash('message' , 'Registration Closed :(');
//                     res.redirect('/profile');
//                     res.end();
//                 }
//         }

        

//         // workshops
//         else if(eventid >=501 && eventid <= 519){
//             var workshop = await OnspotEvent.findOne({eventid:eventid});
//                 if(workshop && workshop.availability>0){
//                     amount = 300;
//                     event_name = workshop.name;
//                     workshop.availability -= 1;
//                     workshop.save();
//                     var user = await User.findOneAndUpdate({yukid:userid},{
//                         $push:{
//                             workshops:{
//                                 name:event_name,
//                                 id:eventid,
//                                 tid:99999,
//                                 paid:true
//                             }
//                         }
//                     }); 
//                     var user = await User.findOneAndUpdate({yukid:userid},{
//                         $push:{
//                             workshops:{
//                                 name:event_name,
//                                 id:eventid,
//                                 tid:99999,
//                                 paid:true
//                             }
//                         }
//                     }); 
//                     var amt=await Cont.findOne({id:"onamt"});
//                     var money=amt.seq;
//                     money=money+amount;
//                     await Cont.updateOne({id:"onamt"},{seq:money});
//                 }
//                 else{
//                     req.flash('message' , 'Registration Closed :(');
//                     res.redirect('/profile');
//                     res.end();
//                 }
//         }

//         // non-technical events
//         else if(eventid >=601 && eventid <=615){
//             var nte = await OnspotEvent.findOne({eventid:eventid});
//                 if(nte && nte.availability>0){
//                     amount = 150;
//                     event_name = nte.name;
//                     nte.availability -=1;
//                     nte.save();
//                     var user = await User.findOneAndUpdate({yukid:userid},{
//                         $push:{
//                             ntevents:{
//                                 name:event_name,
//                                 id:eventid,
//                                 tid:99999,
//                                 paid:true
//                             }
//                         }
//                     }); 
//                     var user = await User.findOneAndUpdate({yukid:userid},{
//                         $push:{
//                             ntevents:{
//                                 name:event_name,
//                                 id:eventid,
//                                 tid:99999,
//                                 paid:true
//                             }
//                         }
//                     }); 

//                     var amt=await Cont.findOne({id:"onamt"});
//                     var money=amt.seq;
//                     money=money+amount;
//                     await Cont.updateOne({id:"onamt"},{seq:money});

//                 }
//                 else{
//                     req.flash('message' , 'Registration Closed :(');
//                     res.redirect('/profile');
//                     res.end();
//                 }
//         }
//         else
//         {
//             // throw new Error("Invalid Event ID");
//             req.flash('messgae','Invalid Event ID')
//             res.redirect("/profile");
//         }
        
//         if (amount!=0) {
//             var datee = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    
//             const onspot = new Onspot({
//                 yukid: userid,
//                 eventid : eventid,
//                 event_name: event_name,
//                 transactiondate: datee,
//                 fee: amount,
//                 name: name,
//                 mobileno : mobileno,
//                 email : username,
//                 ib : Number(req.user.yukid)
//             });
    
//             // var desk = Desk.findOne({yukid:Number(req.user.yukid)});
//             // console.log(amount);
//             // desk.amount += amount;
//             // desk.save();
    
//             onspot.save();
    
//             res.redirect('/insights/onspot');
//         }

//     } else {
//         req.flash('message' , 'You are not allowed to access this page');
//         res.redirect('/profile');
//         res.end();
//     }
// });

router.get('/total',iLog, async function(req,res){
    var user = req.user;
    if (req.user.accountType=="admin" || req.user.accountType=="org") {
        var userno = await User.find();
        var total = await Transaction.find({status:1},'yukid');
        var num = total.length;
        var usernum=userno.length;
        var total1 = await Onspot.find({},'yukid');
        var num1 = total1.length;
        var amt = await Cont.findOne({id:"amount"});
        var onamt = await Cont.findOne({id:"onamt"});
        res.send("<h1> Total users: "+usernum +"</h1><br><h1> Total Online Registrations: "+num+"</h1>"+"<br>"+"<h1> Total Onspot Registrations: "+num1+"</h1>"+"<br>"+"<h1> Total online Amount: ₹"+amt.seq+"</h1>"+"<br>"+"<h1> Total onspot Amount: ₹"+onamt.seq+"</h1>"+"<br>"+"<h1> Total Amount: ₹"+(amt.seq+onamt.seq)+"</h1>");
    } else {
        req.flash('message' , 'You are not allowed to access this page');
        res.redirect('/profile');
        res.end();
    }
});
 

function iLog(req, res, next) {
    // if (req.isAuthenticated()) {
    if (req.user) {
        return next();
    }
    req.flash("message", 'Please log in first');
    res.redirect("/lr");
}

function iNLog(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash("message", 'Your are now Logged In');
    res.redirect("/lr");
}

module.exports = router;