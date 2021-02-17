//imports
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

//Setting up user schema
const userSchema = new Schema({
     fname: String,
     lname: String,
     username: String,
     nickname: String,
     permission: Number, // can be 0,1 or 2
     password: String,
     banned: { status: { type: Boolean, default: false }, reason: String },
});
const User = Mongoose.model("User", userSchema);

module.exports = User;
