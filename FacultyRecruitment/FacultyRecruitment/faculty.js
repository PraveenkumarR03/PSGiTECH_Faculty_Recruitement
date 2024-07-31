//jshit esversion:6
//requirements
const dotenv = require('dotenv').config({path : "config/.env"});
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const favicon = require('serve-favicon');
const flash = require("connect-flash");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require('crypto');
const fs = require('fs');
const uploader=require("express-fileupload");
const qrcode=require('qrcode');
const path = require('path');

const smtpTransport = require("./services/mailer");

//Requiring collection models
const User = require("./models/users");
const mod = require("./models/otps");
const Teach = require("./models/teaching");
const Staff = require("./models/supportingstaff");
const count = require("./models/counters");
const { Strategy } = require('passport-local');
const { Console } = require('console');
const { isNull } = require('util');

//configuring express and ejs
const app = express();
app.set('view engine','ejs');
//setting the resources folder
app.use(express.static("public"));
//bodyparser
app.use(bodyParser.urlencoded({extended: true}));
app.use(uploader());

//connecting to MongoDB
mongoose.set("strictQuery",false);
mongoose.connect("mongodb://127.0.0.1:27017/Faculty_Recruitment", {useUnifiedTopology: true, useNewUrlParser: true});

//serving favicon
//Express sessions middleware
app.use(session({
    secret:"FacultyRec",
    resave:false,
    saveUninitialized:false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
    },User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var password1="";
 
app.get(['/','/login'],function(req,res) {
    try{
    user = req.user;
    res.render("login",{message : req.flash('message'),user});//Changing
    }
    catch{
        res.redirect("/recruitment/login");
    }
});
app.get('/view',async function(req,res) {
    try{
    user = req.user;
    let data;
        if(user.apptype=="Teaching"){
            data= await Teach.findOne({username:user.email});
        }
        else if(user.apptype=="Supporting"){
            data= await Staff.findOne({username:user.email});
        }

    res.render("view",{user,data});//Changing
    }
    catch{
        res.redirect("/recruitment/login");
    }
});
app.get(['/users/profile','/profile'],iLog, async function(req,res) {
    try{
        user=req.user;
        let apply;
        if(user.apptype=="Teaching"){
            apply=await Teach.findOne({uid:user.uid});
        }else if(user.apptype=="Supporting"){
            apply=await Staff.findOne({uid:user.uid});
        }
        res.render("profile",{message : req.flash('message'),user,apply});
    }
    catch{
        res.redirect("/recruitment/login");

    }

});
app.get('/signup',(req,res)=>{
    try{
        user = req.user;
        res.render('signup',{user});

    }
    catch{
        res.redirect("/recruitment/login");

    }
});

app.get('/sstaff',iLog,(req,res)=>{
    try{
        user=req.user;
        if(user.regcount==0){
            res.render('support_staff',{user});
        }
        else if(user.regcount==1 && user.apptype=="Supporting"){
            res.redirect("/recruitment/sstaff1")
        }
        else if(user.regcount==2 && user.apptype=="Supporting"){
            res.redirect("/recruitment/sstaff2")
        }
        else if(user.regcount==3 && user.apptype=="Supporting"){
            res.redirect("/recruitment/sstaff3")
        }
        else{
            res.redirect("/recruitment/profile")
        }
    }
    catch{
        res.redirect("/recruitment/login");

    }
});
app.get('/sstaff1',iLog,(req,res)=>{
    try{
        user=req.user;
        if(user.regcount==1 && user.apptype=="Supporting"){
        res.render('support_staff1',{user});
        }
        else{
            res.redirect("/recruitment/sstaff");
        }
    }
    catch{
        res.redirect("/recruitment/login");

    }
});
app.get('/sstaff2',iLog,(req,res)=>{
    try{
        user=req.user;
        if(user.regcount==2 && user.apptype=="Supporting"){
        res.render('support_staff2',{user});
        }
        else{
            res.redirect("/recruitment/sstaff");
        }
    }
    catch{
        res.redirect("/recruitment/login");

    }
});
app.get('/sstaff3',iLog,(req,res)=>{
    try{
        user=req.user;
        if(user.regcount==3 && user.apptype=="Supporting"){
        res.render('support_staff3',{user});
        }
        else{
            res.redirect("/recruitment/sstaff");
        }
    }
    catch{
        res.redirect("/recruitment/login");

    }
});

app.get('/teach',iLog,(req,res)=>{
    try{
        user=req.user;
        if(user.regcount==0){
            res.render('teaching',{user});
        }
        else if(user.regcount==1 && user.apptype=="Teaching"){
            res.redirect("/recruitment/teach1")
        }
        else if(user.regcount==2 && user.apptype=="Teaching"){
            res.redirect("/recruitment/teach2")
        }
        else if(user.regcount==3 && user.apptype=="Teaching"){
            res.redirect("/recruitment/teach3")
        }
        else if(user.regcount==4 && user.apptype=="Teaching"){
            res.redirect("/recruitment/teach4")
        }
        else if(user.regcount==5 && user.apptype=="Teaching"){
            res.redirect("/recruitment/teach5")
        }
        else{
            res.redirect("/recruitment/profile")
        }
    }
    catch{
        res.redirect("/recruitment/login");

    }
});
app.get('/teach1',iLog,(req,res)=>{
    try{
        user=req.user;
        if(user.regcount==1 && user.apptype=="Teaching"){
        res.render('teaching1',{user});
        }
        else{
            res.redirect("/recruitment/teach");
        }
    }
    catch{
        res.redirect("/recruitment/login");

    }
});
app.get('/teach2',iLog,(req,res)=>{
    try{
        user=req.user;
        if(user.regcount==2 && user.apptype=="Teaching"){
        res.render('teaching2',{user});
        }
        else{
            res.redirect("/recruitment/teach");
        }
    
    }
    catch{
        res.redirect("/recruitment/login");

    }
});
app.get('/teach3',iLog,(req,res)=>{
    try{
        user=req.user;
        if(user.regcount==3 && user.apptype=="Teaching"){
        res.render('teaching3',{user});
        }
        else{
            res.redirect("/recruitment/teach");
        }
    }
    catch{
        res.redirect("/recruitment/login");

    }
});
app.get('/teach4',iLog,(req,res)=>{
    try{
        user=req.user;
        if(user.regcount==4 && user.apptype=="Teaching"){
        res.render('teaching4',{user});
        }
        else{
            res.redirect("/recruitment/teach");
        }
    }
    catch{
        res.redirect("/recruitment/login");

    }
});
app.get('/teach5',iLog,(req,res)=>{
    try{
        user=req.user;
        if(user.regcount==5 && user.apptype=="Teaching"){
        res.render('teaching5',{user});
        }
        else{
            res.redirect("/recruitment/teach");
        }
    }
    catch{
        res.redirect("/recruitment/login");

    }
});



// Sample data for application
let applications = [];
let acceptedApplications = [];
let supapplications = [];
let supacceptedApplications = [];
app.get('/approval',iLog, async (req, res) => {
    try{
    user=req.user;
    if(user.accountType=="hr"||user.accountType=="admin"){
        applications=await Teach.find({hracc:0,hodacc:0});
        acceptedApplications=await Teach.find({hracc:1});
        supapplications=await Staff.find({hracc:0,hodacc:0});
        supacceptedApplications=await Staff.find({hracc:1});
        res.render('approval', { applications, acceptedApplications,supapplications, supacceptedApplications });
    }
    else{
        req.flash('message' , 'User not allowed !!');        
        res.redirect("/recruitment/profile");
    }
    }
    catch{
        res.redirect("/recruitment/profile");
    }
});

// "AIDS"
// "Civil"
// "CSE"
// "EEE"
// "ECE"
// "Mech"
// "Maths"
// "Physics"
// "Chemistry"
// "English"
// "Tamil"
// "Humanities"
app.get('/hodapproval',iLog, async (req, res) => {
    try{
        user=req.user;
        if(user.accountType=="hod"||user.accountType=="admin"){

        var hoddept=user.department;
        applications=await Teach.find({hracc:1,hodacc:0,department:hoddept});
        acceptedApplications=await Teach.find({hracc:1,hodacc:1,department:hoddept});
        supapplications=await Staff.find({hracc:1,hodacc:0,department:hoddept});
        supacceptedApplications=await Staff.find({hracc:1,hodacc:1,department:hoddept});
        res.render('hodapproval', { applications, acceptedApplications, supapplications, supacceptedApplications });
        }else{
            req.flash('message' , 'User not allowed !!');        
            res.redirect("/recruitment/profile");
        }
    }
    catch{
        res.redirect("/recruitment/profile");
    }
});
app.post('/hodaccept/:applicationnumber',iLog, async(req, res) => {
    try{
        const applicationnumber = parseInt(req.params.applicationnumber);
        user=req.user;
        if(user.accountType=="hod"||user.accountType=="admin"){
            let cand=await User.findOne({uid:applicationnumber});
            if(cand.apptype=="Teaching"){
                await Teach.findOneAndUpdate({uid:applicationnumber},{appStatus:2,hodacc:1,status:"Accepted By HOD"});

            }else if(cand.apptype=="Supporting"){
                await Staff.findOneAndUpdate({uid:applicationnumber},{appStatus:2,hodacc:1,status:"Accepted By HOD"});

            }

        }else{
            req.flash('message' , 'User not allowed !!');        
            res.redirect("/recruitment/profile");
        }
    }
    catch{
        res.redirect('/recruitment/hodapproval');
    }
    
    res.redirect('/recruitment/hodapproval');
});
app.post('/hodreject/:applicationnumber',iLog,async (req, res) => {
    try{
        const applicationnumber = parseInt(req.params.applicationnumber);
        user=req.user;
        if(user.accountType=="hod"||user.accountType=="admin"){
            let cand=await User.findOne({uid:applicationnumber});
            if(cand.apptype=="Teaching"){
                await Teach.findOneAndUpdate({uid:applicationnumber},{appStatus:2,hodacc:-1,status:"Rejected By HOD"});

            }else if(cand.apptype=="Supporting"){
                await Staff.findOneAndUpdate({uid:applicationnumber},{appStatus:2,hodacc:-1,status:"Rejected By HOD"});

            }
    }else{
        req.flash('message' , 'User not allowed !!');        
        res.redirect("/recruitment/profile");
    }
    }
    catch{
        res.redirect('/recruitment/hodapproval');

    }
    res.redirect('/recruitment/hodapproval');
    
});
app.post('/accept/:applicationnumber',iLog, async(req, res) => {
    try{
        const applicationnumber = parseInt(req.params.applicationnumber);
        user=req.user;
        if(user.accountType=="hr"||user.accountType=="admin"){
            let cand=await User.findOne({uid:applicationnumber});
            if(cand.apptype=="Teaching"){
                await Teach.findOneAndUpdate({uid:applicationnumber},{appStatus:1,hracc:1,status:"Accepted By HR"});

            }else if(cand.apptype=="Supporting"){
                await Staff.findOneAndUpdate({uid:applicationnumber},{appStatus:1,hracc:1,status:"Accepted By HR"});

            }
    }else{
        req.flash('message' , 'User not allowed !!');        
        res.redirect("/recruitment/profile");
    }
    }
    catch{
        res.redirect('/recruitment/approval');
    }
    
    res.redirect('/recruitment/approval');
});
app.post('/reject/:applicationnumber',iLog,async (req, res) => {
    
    try{
        const applicationnumber = parseInt(req.params.applicationnumber);
        user=req.user;
        if(user.accountType=="hr"||user.accountType=="admin"){
            let cand=await User.findOne({uid:applicationnumber});
            if(cand.apptype=="Teaching"){
                await Teach.findOneAndUpdate({uid:applicationnumber},{appStatus:1,hracc:-1,status:"Rejected By HR"});

            }else if(cand.apptype=="Supporting"){
                await Staff.findOneAndUpdate({uid:applicationnumber},{appStatus:1,hracc:-1,status:"Rejected By HR"});

            }

    }else{
        req.flash('message' , 'User not allowed !!');        
        res.redirect("/recruitment/profile");
    }
}
    catch{
        res.redirect('/recruitment/approval');

    }
    res.redirect('/recruitment/approval');
    
});
let applicationnumber1;
app.get('/hrscore/:applicationnumber',iLog,async (req,res)=>{
    try{
        applicationnumber1 = parseInt(req.params.applicationnumber);
        user=req.user;
        let app;
        if(user.accountType=="hr"||user.accountType=="admin"){
            res.redirect("/recruitment/score");

    }else{
        req.flash('message' , 'User not allowed !!');        
        res.redirect("/recruitment/profile");
    }
}
    catch{
        res.redirect('/recruitment/approval');

    }
    res.redirect('/recruitment/approval');
    res.render('score');

    
});
app.get('/score',iLog,async (req,res)=>{
    try{
        user=req.user;
        if(user.accountType=="hr"||user.accountType=="admin"){
            let cand=await User.findOne({uid:applicationnumber1});
            if(cand.apptype=="Teaching"){
            app= await Teach.findOne({uid:applicationnumber1});
            }else if(cand.apptype=="Supporting"){
            app= await Staff.findOne({uid:applicationnumber1});
            res.render("score",{user,app});
    }
        }
        else{
            res.redirect("/recruitment/approval");
        }
    }
    catch{
        res.redirect("/recruitment/approval");

    }
});

app.get('/scorereg/:applicationnumber',iLog,async (req,res)=>{
    try{
        user=req.user;
        var applicationnumber = parseInt(req.params.applicationnumber);

        if(user.accountType=="hr"||user.accountType=="admin"){
            let cand=await User.findOne({uid:applicationnumber});
            if(cand.apptype=="Teaching"){
            app= await Teach.findOneAndUpdate({uid:applicationnumber},{cadScore:req.body.total});
            }else if(cand.apptype=="Supporting"){
            app= await Staff.findOne({uid:applicationnumber},{cadScore:req.body.total});
            res.redirect("/recruitment/approval");
    }
        }
        else{
            res.redirect("/recruitment/approval");
        }
    }
    catch{
        res.redirect("/recruitment/approval");

    }
});

let applicationnumber;

app.get('/hrview',iLog,async function(req,res) {
    try{
        user=req.user;
        if(user.accountType=="hr"||user.accountType=="admin"||user.accountType=="hod"){
        let cand=await User.findOne({uid:applicationnumber});
        let data;
            if(cand.apptype=="Teaching"){
                data= await Teach.findOne({uid:applicationnumber});
            }
            else if(cand.apptype=="Supporting"){
                data= await Staff.findOne({uid:applicationnumber});
            }
        res.render("hrview",{user,data});
        }else{
            req.flash('message' , 'User not allowed !!');        
            res.redirect("/recruitment/profile");
        }
    }
    catch{
        res.redirect("/recruitment/approval");
    }
});
app.get('/hrview/:applicationnumber',iLog,async (req, res) => {
    try{
        applicationnumber = parseInt(req.params.applicationnumber);
        user=req.user;
        if(user.accountType=="hr"||user.accountType=="admin"||user.accountType=="hod"){
        
        res.redirect("/recruitment/hrview");
        }else{
            req.flash('message' , 'User not allowed !!');        
            res.redirect("/recruitment/profile");
        }
    }
    catch{
        res.redirect('/recruitment/approval');

    }
    
});
app.post("/sendotp/:emailid",async (req,res)=>{
    try{
      var r=Math.floor(Math.random() * (999999-100000)) + 100000;
      var reci=req.params.emailid;
      let otpdata={emailID: reci,OTP: r,flag:0,time: new Date().getTime()/1000};//Replace Email ID With Uer Input
      let c=0;
      c=await mod.collection.countDocuments({emailID:reci});
      if(c==0){
        await mod.collection.insertOne(otpdata);
      }
      else{
        //await mod.updateOne({emailID:reci},{OTP:r});
        let data=await mod.find({emailID:reci});
        r=data[0]["OTP"];
      }
      var template = fs.readFileSync(__dirname+"/views/mail/otps.ejs", {
        encoding: "utf-8",
        });
        var template_final = template.replace("[OTP]", r);

        //console.log(req.body);
        console.log("Email");
        var mailOptions = {
          from: "facultypsgitech@gmail.com",
          to: reci,
          subject: "PSG iTech Faculty Recruitment - OTP Validation",
          generateTextFromHTML: true,
          html: template_final,
    };
    smtpTransport.sendMail(mailOptions, (error, data) => {
        error ? console.error(error):console.log(" ");
        smtpTransport.close();
    });
    }
    catch{

    }
});

app.post('/register',async function(req,res){
    // console.log(req.body);
    const { photo } = req.files;
    // console.log(photo);
    //let photo = req.files.photo;
    //console.log(photo.name);
    let langlst=req.body.languageKnown;
    let langans=[];
    for (var i=0;i<langlst.length;i++){
        let dict={name:langlst[i],read:false,speak:false,write:false};
        if ("reading"+i.toString() in req.body){
                    dict.read=true;
        }
        if ("writing"+i.toString() in req.body){
            dict.write=true;
        }
        if ("speaking"+i.toString() in req.body){
            dict.speak=true;
        }
        langans.push(dict);
    }
    const user = new User({
        username:req.body.email,
        accontType:"user",
        name:req.body.salutation+req.body.inputBox,
        gender:req.body.gender,
        maritialstatus:req.body.mstatus,
        fathername:req.body.father,
        spousename:req.body.spouse,
        dob:req.body.dob,
        mobile:req.body.mobile,
        email:req.body.email,
        caddr:req.body.caddress,
        paddr:req.body.paddress,
        community:req.body.community,
        category: req.body.category,
        languages:langans,
        religion:req.body.religion,
        mothertongue:req.body.mothertongue

    });
    fs.appendFileSync(__dirname+"/logs/tempusers.txt",JSON.stringify(user)+"pas: "+req.body.password,(err) => {
        // In case of a error throw err.
        if (err) console.error(err);
    });
    fs.appendFileSync(__dirname+"/logs/tempusers.txt","\r\n",(err) => {
        // In case of a error throw err.
        if (err) console.error(err); 
    });
    password1=req.body.password;

    var email=req.body.email;

    var otp=req.body.otp;
    otp=parseInt(otp);
    console.log(otp);
    //OTP Validation

    let item = await mod.findOne({emailID:email}) ;
    // console.log(item);
        if(item.emailID===email && item.OTP===otp){
            await mod.updateOne({emailID:email},{flag:1});
            // console.log("Update Successful");

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }
            let cnt=await count.findOne({id:"uid"})
            var uid=cnt.seq+1; 
            if (!/^image/.test(photo.mimetype)) return res.sendStatus(400);           
            photo.mv(__dirname + '/public/assets/photos/' + uid.toString()+'.jpg');

            const user = new User({
                username:req.body.email,
                accontType:"user",
                name:req.body.salutation+req.body.inputBox,
                gender:req.body.gender,
                maritialstatus:req.body.mstatus,
                fathername:req.body.father,
                spousename:req.body.spouse,
                dob:req.body.dob,
                mobile:req.body.mobile,
                email:req.body.email,
                caddr:req.body.caddress,
                paddr:req.body.paddress,
                community:req.body.community,
                category: req.body.category,
                languages:langans,
                photo:uid.toString()+'.jpg',
            });
            

            fs.appendFileSync(__dirname+"/logs/users.txt",JSON.stringify(user),(err) => {
                // In case of a error throw err.
                if (err) console.error(err);
            });
            fs.appendFileSync(__dirname+"/logs/users.txt","\r\n",(err) => {
                // In case of a error throw err.
                if (err) console.error(err); 
            });
            
            User.register(user,req.body.password,async function(err,user){
            var template = fs.readFileSync(__dirname+"/views/mail/signup.ejs", {
            encoding: "utf-8",
            });
            

            var template_final = template.replace("[EMAIL]", req.body.email);
            var template_final = template_final.replace("[USER_NAME]", req.body.salutation+req.body.inputBox);
            var template_final = template_final.replace("[PASSWORD]",req.body.password);
            var template_final = template_final.replace("[UID]", uid);

            var mailOptions = {
                from: "facultypsgitech@gmail.com",
                to: req.body.email,
                subject: "PSG iTech Faculty Recruitment Portal Signup",
                generateTextFromHTML: true,
                html: template_final

            };
            smtpTransport.sendMail(mailOptions, (error, data) => {
                error ? console.error(error):console.log(" ");
                smtpTransport.close();
            });
                    passport.authenticate('local') (req,res, () =>{
                        req.flash('message' , 'Successfully Registration');
                        res.redirect('/recruitment/login');
                    });
                }
            //}
            )}
     else{
        console.log("OTP Verification Failed");
        res.redirect("/recruitment/login");
     }

});

app.post('/staffreg',async function(req,res){
    try{
        user=req.user;
        const staff = new Staff({
            uid:user.uid,
            applytype:"Supporting",
            username:user.email,
            name:user.name,
            gender:user.gender,
            mobile:user.mobile,
            email:user.email,
            position:req.body.position,
            department:req.body.department            
        });
        Staff.collection.insertOne(staff);        
        var usr=await User.findOne({username:user.email});
        var cnt=usr.regcount+1;
        await User.findOneAndUpdate({username:user.email},{regcount:cnt,apptype:"Supporting"});

        res.redirect("/recruitment/sstaff1");
    }
    catch{
        res.redirect("/recruitment/profile");
    }
});

app.post('/staffreg1',async function(req,res){
    try{
        user=req.user;
        await Staff.findOneAndUpdate({username:user.username},{
            school10:req.body.school10,
            yoc10:req.body.yoc10,
            marks10:req.body.marks10,
            modeOfStudy10:req.body.modeOfStudy10,
            majorsubject:req.body.majorsubject,
            school12:req.body.school12,
            yoc12:req.body.yoc12,
            marks12:req.body.marks12,
            modeOfStudy12:req.body.modeOfStudy12,
            degreeug:req.body.degreeug,
            collegeug:req.body.collegeug,
            yocug:req.body.yocug,
            percentageug:req.body.percentageug,
            modeOfStudyug:req.body.modeOfStudyug,
            degreepg:req.body.degreepg,
            collegepg:req.body.collegepg,
            yocpg:req.body.yocpg,
            percentagepg:req.body.percentagepg,
            modeOfStudypg:req.body.modeOfStudypg,
            others:req.body.others,
            collegeothers:req.body.collegeothers,
            yocothers:req.body.yocothers,
            percentageothers:req.body.percentageothers,
            modeOfStudyOthers:req.body.modeOfStudyOthers,
            special:req.body.special,
            certificate:req.body.certificate,
            totalpapersug:req.body.totalpapersug,
            totalattemptsug:req.body.totalattemptsug,
            totalpaperspg:req.body.totalpaperspg,
            totalattemptspg:req.body.totalattemptspg, 
        });        
        var usr=await User.findOne({username:user.email});
        var cnt=usr.regcount+1;
        await User.findOneAndUpdate({username:user.email},{regcount:cnt});

        res.redirect("/recruitment/sstaff2");
    }
    catch{
        res.redirect("/recruitment/profile");
    }
});

app.post('/staffreg2',async function(req,res){
    try{
        user=req.user;
        let workexperience=[]
        if(typeof req.body.institutionName=="string"){
            let d={}
            d.institutionName=req.body.institutionName;
            d.institutionAddress=req.body.institutionAddress;
            d.designation=req.body.designation;
            d.reasonForLeaving=req.body.reasonForLeaving;
            d.fromDate=req.body.fromDate;
            d.toDate=req.body.toDate;
            d.certificateAvailable=req.body.certificateAvailable;
            workexperience.push(d);
        }
        else{
            
            let ins=req.body.institutionName;
            let addr=req.body.institutionAddress;
            let desig=req.body.designation;
            let rfl=req.body.reasonForLeaving;
            let fdate=req.body.fromDate;
            let tdate=req.body.toDate;
            let cetav=req.body.certificateAvailable;
            for(var i=0;i<ins.length;i++){
                let d={}
                d.institutionName=ins[i];
                d.institutionAddress=addr[i];
                d.designation=desig[i];
                d.reasonForLeaving=rfl[i];
                d.fromDate=fdate[i];
                d.toDate=tdate[i]
                d.certificateAvailable=cetav[i];
                workexperience.push(d);

            }
        }
       
        await Staff.findOneAndUpdate({username:user.username},{
            yoexp:req.body.yoexp,
            workexperience:workexperience

        });        
        var usr=await User.findOne({username:user.email});
        var cnt=usr.regcount+1;
        await User.findOneAndUpdate({username:user.email},{regcount:cnt});

        res.redirect("/recruitment/sstaff3");
    }
    catch{
        res.redirect("/recruitment/profile");
    }
});

app.post('/staffreg3',async function(req,res){
    try{
        user=req.user;
        let reference=[]
        if(typeof req.body.name=="string"){
            let d={}
            d.name=req.body.name;
            d.designationref=req.body.designationref;
            d.organization=req.body.organization;
            d.mobile=req.body.mobile;
            reference.push(d);
        }
        else{
            
            let name=req.body.name;
            let desig=req.body.designationref;
            let org=req.body.organization;
            let mob=req.body.mobile;
    
            for(var i=0;i<name.length;i++){
                let d={}
                d.name=name[i];
                d.designationref=desig[i];
                d.organization=org[i];
                d.mobile=mob[i];
                reference.push(d);
            }
        }
        //console.log(reference)
        let relative=[]
        if(typeof req.body.relativeName=="string"){
            let d={}
            d.relativeName=req.body.relativeName;
            d.relationship=req.body.relationship;
            d.institution=req.body.institution;
            d.designationrel=req.body.designationrel;
            relative.push(d);
        }
        else{
            
            let name=req.body.relativeName;
            let rel=req.body.relationship;
            let insti=req.body.institution;
            let desig=req.body.designationrel;
    
            for(var i=0;i<name.length;i++){
                let d={}
                d.relativeName=name[i];
                d.relationship=rel[i];
                d.institution=insti[i];
                d.designationrel=desig[i];
                relative.push(d);
            }
        }

        const { resume } = req.files;
        try{
            if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        var us=await User.findOne({username:user.email});
        var uid = us.uid;
        if (resume.mimetype !== 'application/pdf') {
            return res.sendStatus(400).send("Only PDF files are allowed.");
        }         
        resume.mv(__dirname + '/public/assets/pdf/' + uid.toString()+'.pdf');
        }
        catch{

            res.redirect("/recruitment/sstaff3");
        }
        
        
        await Staff.findOneAndUpdate({username:user.username},{
            reference:reference,
            relative:relative,
            lastPay:req.body.lastPay,
            expectedPay:req.body.expectedPay,
            joiningTime:req.body.joiningTime,
            learnedFrom:req.body.learnedFrom,
            information:req.body.information,
            resume:uid.toString()+'.pdf',
        });        
        var usr=await User.findOne({username:user.email});
        var cnt=usr.regcount+1;
        await User.findOneAndUpdate({username:user.email},{regcount:cnt});
        var template = fs.readFileSync(__dirname+"/views/mail/apply.ejs", {
            encoding: "utf-8"
            });
            
            var dt=await Staff.findOne({username:user.username});
            var template_final = template.replace("[TYPE]", dt.applytype+" Staff");
            var template_final = template_final.replace("[UID]", dt.uid);
            var template_final = template_final.replace("[USER_NAME]", dt.name);
            var template_final = template_final.replace("[POSITION]",dt.position);
            var template_final = template_final.replace("[DEPARTMENT]", dt.department);

            var mailOptions = {
                from: "facultypsgitech@gmail.com",
                to: dt.email,
                subject: "PSG iTech Faculty Recruitment Portal Application",
                generateTextFromHTML: true,
                html: template_final

            };
            smtpTransport.sendMail(mailOptions, (error, data) => {
                error ? console.error(error):console.log(" ");
                smtpTransport.close();
            });
        res.redirect("/recruitment/profile");
    }
    catch{
        res.redirect("/recruitment/profile");
    }
});
app.post('/teachreg',async function(req,res){
    try{
        user=req.user;
        const teach = new Teach({
            uid:user.uid,
            applytype:"Teaching",
            username:user.email,
            name:user.name,
            gender:user.gender,
            mobile:user.mobile,
            email:user.email,
            position:req.body.position,
            department:req.body.department            
        });
        Teach.collection.insertOne(teach);        
        var usr=await User.findOne({username:user.email});
        var cnt=usr.regcount+1;
        await User.findOneAndUpdate({username:user.email},{regcount:cnt,apptype:"Teaching"});

        res.redirect("/recruitment/teach1");
    }
    catch{
        res.redirect("/recruitment/profile");
    }
});

app.post('/teachreg1',async function(req,res){
    try{
        user=req.user;
        await Teach.findOneAndUpdate({username:user.username},{
            school10:req.body.school10,
            yoc10:req.body.yoc10,
            marks10:req.body.marks10,
            modeOfStudy10:req.body.modeOfStudy10,
            majorsubject:req.body.majorsubject,
            school12:req.body.school12,
            yoc12:req.body.yoc12,
            marks12:req.body.marks12,
            modeOfStudy12:req.body.modeOfStudy12,
            degreeug:req.body.degreeug,
            collegeug:req.body.collegeug,
            yocug:req.body.yocug,
            percentageug:req.body.percentageug,
            modeOfStudyug:req.body.modeOfStudyug,
            degreepg:req.body.degreepg,
            collegepg:req.body.collegepg,
            yocpg:req.body.yocpg,
            percentagepg:req.body.percentagepg,
            modeOfStudypg:req.body.modeOfStudypg,
            phdstatus:req.body.phdstatus,
            major:req.body.major,
            university:req.body.university,
            yocphd:req.body.yocphd,
            percentagephd:req.body.percentagephd,
            modeOfStudyphd:req.body.modeOfStudyphd,
            others:req.body.others,
            collegeothers:req.body.collegeothers,
            yocothers:req.body.yocothers,
            percentageothers:req.body.percentageothers,
            modeOfStudyOthers:req.body.modeOfStudyOthers,
            special:req.body.special,
            certificate:req.body.certificate,
            totalpapersug:req.body.totalpapersug,
            totalattemptsug:req.body.totalattemptsug,
            totalpaperspg:req.body.totalpaperspg,
            totalattemptspg:req.body.totalattemptspg, 
        });        
        var usr=await User.findOne({username:user.email});
        var cnt=usr.regcount+1;
        await User.findOneAndUpdate({username:user.email},{regcount:cnt});

        res.redirect("/recruitment/teach2");
    }
    catch{
        res.redirect("/recruitment/profile");
    }
});

app.post('/teachreg2',async function(req,res){
    try{
        user=req.user;
        
        let paperdata=[]
        if(typeof req.body.Publisher=="string"){
            let d={}
            d.Publisher=req.body.Publisher;
            d.Title=req.body.Title;
            d.coAuthors=req.body.coAuthors;
            d.year=req.body.year;
            paperdata.push(d);
        }
        else{
            let pub=req.body.Publisher;
            let tit=req.body.Title;
            let coa=req.body.coAuthors;
            let year=req.body.year;
            for(var i=0;i<pub.length;i++){
                let d={}
                d.Publisher=pub[i];
                d.Title=tit[i];
                d.coAuthors=coa[i];
                d.year=year[i];
                paperdata.push(d);
            }
        }
        await Teach.findOneAndUpdate({username:user.username},{
            guideshipnumber:req.body.guideshipnumber,
            universityphdg:req.body.universityphdg,
            numschregistered:req.body.numschregistered,
            numthesissubmitted:req.body.numthesissubmitted,
            numscholarscompleted:req.body.numscholarscompleted,
            paperdata:paperdata,
            scopus:req.body.scopus,
            WebofScience:req.body.WebofScience,
            AnyOther:req.body.AnyOther,
            hindex:req.body.hindex,
            Citations:req.body.Citations,
            ScopusURL:req.body.ScopusURL,
            orcidid:req.body.orcidid,
            googlescholarlink:req.body.googlescholarlink
        });        
        var usr=await User.findOne({username:user.email});
        var cnt=usr.regcount+1;
        await User.findOneAndUpdate({username:user.email},{regcount:cnt});

        res.redirect("/recruitment/teach3");
    }
    catch{
        res.redirect("/recruitment/profile");
    }
});
app.post('/teachreg3',async function(req,res){
    try{
        user=req.user;
        let workexperience=[]
        if(typeof req.body.institutionName=="string"){
            let d={}
            d.institutionName=req.body.institutionName;
            d.institutionAddress=req.body.institutionAddress;
            d.designation=req.body.designation;
            d.reasonForLeaving=req.body.reasonForLeaving;
            d.fromDate=req.body.fromDate;
            d.toDate=req.body.toDate;
            d.certificateAvailable=req.body.certificateAvailable;
            workexperience.push(d);
        }
        else{
            
            let ins=req.body.institutionName;
            let addr=req.body.institutionAddress;
            let desig=req.body.designation;
            let rfl=req.body.reasonForLeaving;
            let fdate=req.body.fromDate;
            let tdate=req.body.toDate;
            let cetav=req.body.certificateAvailable;
            for(var i=0;i<ins.length;i++){
                let d={}
                d.institutionName=ins[i];
                d.institutionAddress=addr[i];
                d.designation=desig[i];
                d.reasonForLeaving=rfl[i];
                d.fromDate=fdate[i];
                d.toDate=tdate[i]
                d.certificateAvailable=cetav[i];
                workexperience.push(d);

            }
        }
       
        await Teach.findOneAndUpdate({username:user.username},{
            yoexp:req.body.yoexp,
            workexperience:workexperience

        });        
        var usr=await User.findOne({username:user.email});
        var cnt=usr.regcount+1;
        await User.findOneAndUpdate({username:user.email},{regcount:cnt});

        res.redirect("/recruitment/teach4");
    }
    catch{
        res.redirect("/recruitment/profile");
    }
});
app.post('/teachreg4',async function(req,res){
    try{
        user=req.user;
        let researchproject=[]
        if(typeof req.body.projectTitle=="string"){
            let d={}
            d.projectTitle=req.body.projectTitle;
            d.agency=req.body.agency;
            d.sanctionedDate=req.body.sanctionedDate;
            d.period=req.body.period;
            d.sanctionedAmount=req.body.sanctionedAmount;
            d.statuspro=req.body.statuspro;
            
            researchproject.push(d);
        }
        else{
            
            let tit=req.body.projectTitle;
            let age=req.body.agency;
            let sancdate=req.body.sanctionedDate;
            let per=req.body.period;
            let amt=req.body.sanctionedAmount;
            let sta=req.body.statuspro;
            for(var i=0;i<tit.length;i++){
                let d={}
                d.projectTitle=tit[i];
                d.agency=age[i];
                d.sanctionedDate=sancdate[i];
                d.period=per[i];
                d.sanctionedAmount=amt[i];
                d.statuspro=sta[i];


                researchproject.push(d);

            }
        }
        let patent=[]
        if(typeof req.body.inventors=="string"){
            let d={}
            d.inventors=req.body.inventors;
            d.title=req.body.title;
            d.applicationNumber=req.body.applicationNumber;
            d.dateOfFiling=req.body.dateOfFiling;
            d.filedBy=req.body.filedBy;
            d.statusDate=req.body.statusDate;
            d.statuspat=req.body.statuspat;
            
            patent.push(d);
        }
        else{
            
            let inv=req.body.inventors;
            let tit=req.body.title;
            let appno=req.body.applicationNumber;
            let dof=req.body.dateOfFiling;
            let fby=req.body.filedBy;
            let stdate=req.body.statusDate;
            let stpat=req.body.statuspat;
            for(var i=0;i<inv.length;i++){
                let d={}
                d.inventors=inv[i];
                d.title=tit[i];
                d.applicationNumber=appno[i];
                d.dateOfFiling=dof[i];
                d.filedBy=fby[i];
                d.statusDate=stdate[i];
                d.statuspat=stpat[i];
                patent.push(d);
            }
        }
        await Teach.findOneAndUpdate({username:user.username},{
            researchproject:researchproject,
            patent:patent
        });        
        var usr=await User.findOne({username:user.email});
        var cnt=usr.regcount+1;
        await User.findOneAndUpdate({username:user.email},{regcount:cnt});

        res.redirect("/recruitment/teach5");
    }
    catch{
        res.redirect("/recruitment/profile");
    }
});
app.post('/teachreg5',async function(req,res){
    try{
        user=req.user;
        let reference=[]
        if(typeof req.body.name=="string"){
            let d={}
            d.name=req.body.name;
            d.designationref=req.body.designationref;
            d.organization=req.body.organization;
            d.mobile=req.body.mobile;
            reference.push(d);
        }
        else{
            
            let name=req.body.name;
            let desig=req.body.designationref;
            let org=req.body.organization;
            let mob=req.body.mobile;
    
            for(var i=0;i<name.length;i++){
                let d={}
                d.name=name[i];
                d.designationref=desig[i];
                d.organization=org[i];
                d.mobile=mob[i];
                reference.push(d);
            }
        }
        //console.log(reference)
        let relative=[]
        if(typeof req.body.relativeName=="string"){
            let d={}
            d.relativeName=req.body.relativeName;
            d.relationship=req.body.relationship;
            d.institution=req.body.institution;
            d.designationrel=req.body.designationrel;
            relative.push(d);
        }
        else{
            
            let name=req.body.relativeName;
            let rel=req.body.relationship;
            let insti=req.body.institution;
            let desig=req.body.designationrel;
    
            for(var i=0;i<name.length;i++){
                let d={}
                d.relativeName=name[i];
                d.relationship=rel[i];
                d.institution=insti[i];
                d.designationrel=desig[i];
                relative.push(d);
            }
        }
        var us=await User.findOne({username:user.email});
        var uid = us.uid;
        const { resume } = req.files;
        try{
            if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        if (resume.mimetype !== 'application/pdf') {
            return res.sendStatus(400).send("Only PDF files are allowed.");
        }         
        resume.mv(__dirname + '/public/assets/pdf/' + uid.toString()+'.pdf');
        }
        catch{

            res.redirect("/recruitment/teach5");
        }
        
        
        await Teach.findOneAndUpdate({username:user.username},{
            reference:reference,
            relative:relative,
            lastPay:req.body.lastPay,
            expectedPay:req.body.expectedPay,
            joiningTime:req.body.joiningTime,
            learnedFrom:req.body.learnedFrom,
            information:req.body.information,
            resume:uid.toString()+'.pdf',
        });        
        var usr=await User.findOne({username:user.email});
        var cnt=usr.regcount+1;
        await User.findOneAndUpdate({username:user.email},{regcount:cnt});
        var template = fs.readFileSync(__dirname+"/views/mail/apply.ejs", {
            encoding: "utf-8"
            });
            
            var dt=await Teach.findOne({username:user.username});
            var template_final = template.replace("[TYPE]", dt.applytype+" Staff");
            var template_final = template_final.replace("[UID]", dt.uid);
            var template_final = template_final.replace("[USER_NAME]", dt.name);
            var template_final = template_final.replace("[POSITION]",dt.position);
            var template_final = template_final.replace("[DEPARTMENT]", dt.department);

            var mailOptions = {
                from: "facultypsgitech@gmail.com",
                to: dt.email,
                subject: "PSG iTech Faculty Recruitment Portal Application",
                generateTextFromHTML: true,
                html: template_final

            };
            smtpTransport.sendMail(mailOptions, (error, data) => {
                error ? console.error(error):console.log(" ");
                smtpTransport.close();
            });
        res.redirect("/recruitment/profile");
    }
    catch{
        res.redirect("/recruitment/profile");
    }
});
// app.post('/teachreg',async function(req,res){
    

//     let paperdata=[]
//     if(typeof req.body.Publisher=="string"){
//         let d={}
//         d.Publisher=req.body.Publisher;
//         d.Title=req.body.Title;
//         d.coAuthors=req.body.coAuthors;
//         d.year=req.body.year;
//         paperdata.push(d);
//     }
//     else{
        
//         let pub=req.body.Publisher;
//         let tit=req.body.Title;
//         let coa=req.body.coAuthors;
//         let year=req.body.year;
//         for(var i=0;i<pub.length;i++){
//             let d={}
//             d.Publisher=pub[i];
//             d.Title=tit[i];
//             d.coAuthors=coa[i];
//             d.year=year[i];
//             paperdata.push(d);

//         }
//     }

//     let workexperience=[]
//     if(typeof req.body.institutionName=="string"){
//         let d={}
//         d.institutionName=req.body.institutionName;
//         d.institutionAddress=req.body.institutionAddress;
//         d.designation=req.body.designation;
//         d.reasonForLeaving=req.body.reasonForLeaving;
//         d.fromDate=req.body.fromDate;
//         d.toDate=req.body.toDate;
//         d.certificateAvailable=req.body.certificateAvailable;
//         workexperience.push(d);
//     }
//     else{
        
//         let ins=req.body.institutionName;
//         let addr=req.body.institutionAddress;
//         let desig=req.body.designation;
//         let rfl=req.body.reasonForLeaving;
//         let fdate=req.body.fromDate;
//         let tdate=req.body.toDate;
//         let cetav=req.body.certificateAvailable;
//         for(var i=0;i<ins.length;i++){
//             let d={}
//             d.institutionName=ins[i];
//             d.institutionAddress=addr[i];
//             d.designation=desig[i];
//             d.reasonForLeaving=rfl[i];
//             d.fromDate=fdate[i];
//             d.toDate=tdate[i]
//             d.certificateAvailable=cetav[i];
//             workexperience.push(d);

//         }
//     }
//     //console.log(workexperience)
//     let researchproject=[]
//     if(typeof req.body.projectTitle=="string"){
//         let d={}
//         d.projectTitle=req.body.projectTitle;
//         d.agency=req.body.agency;
//         d.sanctionedDate=req.body.sanctionedDate;
//         d.period=req.body.period;
//         d.sanctionedAmount=req.body.sanctionedAmount;
//         d.statuspro=req.body.statuspro;
        
//         researchproject.push(d);
//     }
//     else{
        
//         let tit=req.body.projectTitle;
//         let age=req.body.agency;
//         let sancdate=req.body.sanctionedDate;
//          let per=req.body.period;
//          let amt=req.body.sanctionedAmount;
//          let sta=req.body.statuspro;
//         for(var i=0;i<tit.length;i++){
//             let d={}
//             d.projectTitle=tit[i];
//             d.agency=age[i];
//             d.sanctionedDate=sancdate[i];
//             d.period=per[i];
//             d.sanctionedAmount=amt[i];
//             d.statuspro=sta[i];


//             researchproject.push(d);

//         }
//     }
//     //console.log(researchproject);
//     let patent=[]
//     if(typeof req.body.inventors=="string"){
//         let d={}
//         d.inventors=req.body.inventors;
//         d.title=req.body.title;
//         d.applicationNumber=req.body.applicationNumber;
//         d.dateOfFiling=req.body.dateOfFiling;
//         d.filedBy=req.body.filedBy;
//         d.statusDate=req.body.statusDate;
//         d.statuspat=req.body.statuspat;
        
//         patent.push(d);
//     }
//     else{
        
//         let inv=req.body.inventors;
//         let tit=req.body.title;
//         let appno=req.body.applicationNumber;
//          let dof=req.body.dateOfFiling;
//          let fby=req.body.filedBy;
//          let stdate=req.body.statusDate;
//          let stpat=req.body.statuspat;
//         for(var i=0;i<inv.length;i++){
//             let d={}
//             d.inventors=inv[i];
//             d.title=tit[i];
//             d.applicationNumber=appno[i];
//             d.dateOfFiling=dof[i];
//             d.filedBy=fby[i];
//             d.statusDate=stdate[i];
//             d.statuspat=stpat[i];


//             patent.push(d);

//         }
//     }
//     //console.log(patent);
//     let reference=[]
//     if(typeof req.body.name=="string"){
//         let d={}
//         d.name=req.body.name;
//         d.designationref=req.body.designationref;
//         d.organization=req.body.organization;
//         d.mobile=req.body.mobile;
    
        
//         reference.push(d);
//     }
//     else{
        
//         let name=req.body.name;
//         let desig=req.body.designationref;
//         let org=req.body.organization;
//         let mob=req.body.mobile;

//         for(var i=0;i<name.length;i++){
//             let d={}
//             d.name=name[i];
//             d.designationref=desig[i];
//             d.organization=org[i];
//             d.mobile=mob[i];
//             reference.push(d);

//         }
//     }
//     //console.log(reference)
//     let relative=[]
//     if(typeof req.body.relativeName=="string"){
//         let d={}
//         d.relativeName=req.body.relativeName;
//         d.relationship=req.body.relationship;
//         d.institution=req.body.institution;
//         d.designationrel=req.body.designationrel;
//         relative.push(d);
//     }
//     else{
        
//         let name=req.body.relativeName;
//         let rel=req.body.relationship;
//         let insti=req.body.institution;
//         let desig=req.body.designationrel;

//         for(var i=0;i<name.length;i++){
//             let d={}
//             d.relativeName=name[i];
//             d.relationship=rel[i];
//             d.institution=insti[i];
//             d.designationrel=desig[i];
//             relative.push(d);
//         }
//     }
//     //console.log(relative);


   



// });

app.post('/login',passport.authenticate("local",{
    successRedirect:'/recruitment/profile',
    failureRedirect: '/recruitment'
}),function(req,res,err) {
  console.error(err);
});

app.get('/logout', (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/recruitment");
    });
  });

// ---------------------------verfication-----------------------------------------------//

function iLog(req, res, next) {
    // if (req.isAuthenticated()) {
    if (req.user) {
        return next();
    }
    req.flash("message", 'Please log in first');
    res.redirect("/recruitment/login");
}

function iNLog(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash("message", 'Your are now Logged In');
    res.redirect("/recruitment/login");
}


passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });


async function clearOTP() {
    //console.log('This code is executed periodically.');
    try{
        
        let data=await mod.find();
        //console.log(data);
        //console.log(data);
        data.forEach(async (item)=>{
            let diff=(new Date().getTime()/1000)-item.time;
            //console.log(diff)
            if(diff>=300 && item.flag==0){//300 Seconds ==> 5 Minutes
                await mod.deleteOne({__id:item.__id});
                //console.log("Deleted");
            }
        });
    }
    catch{

    }
}

var intervalId = setInterval(clearOTP, 3000);
const port = process.env.PORT||8000; //port number

app.listen(port, function() {
    console.log("Server started on port "+port);
  });
