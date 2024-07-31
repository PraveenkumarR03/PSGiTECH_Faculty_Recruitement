var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');


var Staffschema = new mongoose.Schema({
    uid: Number,
    username:String,
    name:String,
    gender:String,
    email:String,
    mobile:String,
    applytype:String,
    position:String,/*Applyig for*/
    department:String,
    school10:String,/*SSLC*/
    yoc10:String,
    marks10:String,
    modeOfStudy10:String,
    majorsubject:String,
    school12:String,/*+2*/
    yoc12:String,
    marks12:String,
    modeOfStudy12:String,
    degreeug:String,/*ug*/
    collegeug:String,
    yocug:String,
    percentageug:String,
    modeOfStudyug:String,
    degreepg:String,/*pg*/
    collegepg:String,
    yocpg:String,
    percentagepg:String,
    modeOfStudypg:String,
    others:String,/*others*/
    collegeothers:String,
    yocothers:String,
    percentageothers:String,
    modeOfStudyOthers:String,
    special:String,/*achievements*/
    certificate:String,/*certification*/
    totalpapersug:Number,/*arrear*/
    totalattemptsug:Number,
    totalpaperspg:Number,
    totalattemptspg:Number,
    workexperience:[{
        institutionName:String,
        institutionAddress:String,
        designation:String,
        reasonForLeaving:String,
        fromDate:String,
        toDate:String,
        certificateAvailable:String
    }],
    reference:[{
        name:String,
        designationref:String,
        organization:String,
        mobile:String
    }],
    relative:[{
        relativeName:String,
        relationship:String,
        institution:String,
        designationrel:String
    }],
    lastPay:String,
    expectedPay:String,
    joiningTime:String,
    learnedFrom:String,
    information:String,
    appStatus:{ type:Number, default:0},
    hracc:{ type:Number, default:0},
    hodacc:{ type:Number, default:0},
    status:{type:String, default:"Pending"},
    reason:String,
    cadScore: Number,
    resume:String

});

Staffschema.plugin(passportLocalMongoose,{usernameField:'email'});
Staffschema.plugin(findOrCreate);

module.exports = mongoose.model("supportregisters", Staffschema);