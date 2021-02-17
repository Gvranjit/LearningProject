// MODULES IMPORT
const express = require("express");
const bodyParser = require("body-parser");
const Mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const AccessControl = require("accesscontrol").AccessControl;

// OTHER IMPORTS
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

//ACCESS CONTROL DEFINITIONS
const ac = new AccessControl();
ac.grant("user")
     .createOwn("notes")
     .deleteOwn("notes")
     .readOwn("notes")
     .grant("admin")
     .extend("user")
     .updateAny("notes")
     .updateAny("notes")
     .deleteAny("notes");

const permission = ac.can("user").createOwn("notes");
console.log(permission.granted);
console.log(permission.attributes);
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
          cookie: { expires: 3600000 },
     })
);
// RESPONSE LOCALS
app.use((req, res, next) => {
     res.locals.isLoggedIn = false;
     res.locals.profilePicUrl = "/images/placeholder-profile.jpg";
     res.locals.title = "Chat";
     res.locals.isLoggedIn = req.session.isLoggedIn;
     // might need to add Cache control to not store anything here.
     next();
});

// MIDDLEWARES

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use(authRoutes);
app.use((error, req, res, next) => {
     console.log("An error was reported \n" + error);
     return res.render("error", { error: error });
});
//Connect to database and start listening to a predfined port after that.

Mongoose.connect(process.env.CHATDB, { useNewUrlParser: true, useUnifiedTopology: true })
     .then(() => {
          console.log("successfully connected to ", process.env.CHATDB);
          const server = app.listen(process.env.PORT);
          const io = require("socket.io")(server);
          io.on("connection", (socket) => {
               console.log("Connected to Client");
          });
     })
     .catch((err) => console.log(err));
