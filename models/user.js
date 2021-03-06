//imports
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

//Setting up user schema
const userSchema = new Schema({
     fname: String,
     lname: String,
     username: { type: String, required: true, unique: true },
     nickname: String,
     permission: Number, // can be 0,1 or 2
     password: { type: String, required: true },
     role: { type: Mongoose.Types.ObjectId, ref: "Role", required: true },
     createdBy: String,
});
const User = Mongoose.model("User", userSchema);

module.exports = User;
//comment
