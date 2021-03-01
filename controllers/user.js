const Message = require("../models/message");

exports.getUserHome = async (req, res, next) => {
     const user = req.session.user;
     //get past 30 messages
     const pastMessages = await Message.find().sort({ createdOn: -1 }).limit(20).exec();
     console.log(pastMessages._createdOn);

     res.render("home", {
          title: "Home",
          username: user.username,
          messages: pastMessages.reverse(),
     });
};
