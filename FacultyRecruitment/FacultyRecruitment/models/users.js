var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
var AutoIncrement = require("mongoose-sequence")(mongoose)


var UserSchema = new mongoose.Schema({
    uid: Number,
   accountType: { type: String, default: "user" },
   username:String,
   name:String,
   gender:String,
   maritialstatus:String,
   fathername:String,
   spousename:String,
   department:String,
   dob:String,
   mobile:String,
   email:String,
   caddr:String,
   paddr:String,
   religion:String,
   community:String,
   category:String,
   mothertongue:String,
   apptype:String,
   languages:[{
     name: String,
     read: Boolean,
     speak: Boolean,
     write: Boolean
   }],
   password:String,
   photo:String,
   regcount:{ type:Number, default:0}
});

UserSchema.plugin(passportLocalMongoose,{usernameField:'email'});
UserSchema.plugin(findOrCreate);
UserSchema.plugin(AutoIncrement, { inc_field: "uid"})

module.exports = mongoose.model("User", UserSchema);