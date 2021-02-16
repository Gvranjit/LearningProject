// MODULES IMPORT
const express = require("express");
const bodyParser = require("body-parser");
const Mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
// OTHER IMPORTS
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

// INITIALIZATION
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

// ESSENTIAL MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: true })); //initialize body parser

app.use(express.static(path.join(__dirname, "public"))); // initialize public folder

app.use(
     session({
          secret: "EkChatSecret",
          resave: false,
          saveUninitialized: true,
          store: new MongoStore({ url: "mongodb://localhost/EkChatSessions" }),
          cookie: { maxAge: 10000 },
     })
);
// RESPONSE LOCALS
app.use((req, res, next) => {
     res.locals.isLoggedIn = false;
     res.locals.profilePicUrl = "/images/placeholder-profile.jpg";
     // might need to add Cache control to not store anything here.
     next();
});

// MIDDLEWARES

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use(authRoutes);
app.use((error, req, res, next) => {
     console.log("An error was reported \n" + error);
});
//Connect to database and start listening to a predfined port after that.

Mongoose.connect(process.env.CHATDB, { useNewUrlParser: true, useUnifiedTopology: true })
     .then(() => {
          console.log("successfully connected to ", process.env.CHATDB);
          app.listen(process.env.PORT);
     })
     .catch((err) => console.log(err));
