var mongoose = require("mongoose");
var otpSchema = new mongoose.Schema(
    {
        emailID: String,
        OTP: Number,
        flag: Number,
        time: Number,
    }
);
module.exports= mongoose.model("Otp", otpSchema);