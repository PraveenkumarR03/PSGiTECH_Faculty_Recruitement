var mongoose = require("mongoose");
var counterSchema = new mongoose.Schema(
    {
        id: String,
		seq: Number
    }
);
module.exports= mongoose.model("counters", counterSchema);