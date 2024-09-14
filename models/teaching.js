var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');


var Teachschema = new mongoose.Schema({
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
    major:String,/*phd*/
    phdstatus:String,
    university:String,
    yocphd:String,
    percentagephd:String,
    modeOfStudyphd:String,
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
    guideshipnumber:String,/*PHD Guideship */
    universityphdg:String,
    numschregistered:Number,
    numthesissubmitted:Number,
    numscholarscompleted:Number,
    paperdata:[{
        Publisher:String,
        Title:String,
        coAuthors:String,
        year:String
    }],
    scopus:String,
    WebofScience:String,
    AnyOther:String,
    hindex:String,
    Citations:String,
    ScopusURL:String,
    orcidid:String,
    googlescholarlink:String,
    yoexp:String,
    workexperience:[{
        institutionName:String,
        institutionAddress:String,
        designation:String,
        reasonForLeaving:String,
        fromDate:String,
        toDate:String,
        certificateAvailable:String
    }],
    researchproject:[{
        projectTitle:String,
        agency:String,
        sanctionedDate:String,
        period:String,
        sanctionedAmount:String,
        statuspro:String
    }],
    patent:[{
        inventors:String,
        title:String,
        applicationNumber:String,
        dateOfFiling:String,
        filedBy:String,
        statusDate:String,
        statuspat:String
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

Teachschema.plugin(passportLocalMongoose,{usernameField:'email'});
Teachschema.plugin(findOrCreate);

module.exports = mongoose.model("registers", Teachschema);