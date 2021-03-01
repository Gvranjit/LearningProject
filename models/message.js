//imports
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

//Setting up user schema
const messageSchema = new Schema({
     content: { type: String, required: true },
     sender: { type: String, required: true },

     author: { type: Mongoose.Types.ObjectId, ref: "User", required: true },
     createdOn: { type: Date },
});
const Message = Mongoose.model("Message", messageSchema);

module.exports = Message;
