// MODULES IMPORT
const express = require("express");
const bodyParser = require("body-parser");
const Mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const brcypt = require("bcrypt");
//Permissions import
const ac = require("./permissions");

//models import
const User = require("./models/user");
const Role = require("./models/roles");

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
app.use(express.static(path.join(__dirname, "node_modules/bootstrap-icons")));

app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

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
     if (!error.statusCode) {
          error.message = "Internal Error";
     }
     return res.render("error", { error: error });
});

//Connect to database, check users,roles and perms and start listening to a predfined port after that.

Mongoose.connect(process.env.CHATDB, { useNewUrlParser: true, useUnifiedTopology: true })
     .then(async () => {
          try {
               console.log("successfully connected to ", process.env.CHATDB);
               //check if default role exists and create one if there isn't
               let defaultRole = await Role.findOne({ name: "user" });
               if (!defaultRole) {
                    defaultRole = new Role({
                         name: "user",
                    });
                    const userRole = await defaultRole.save();
               }

               //set up roles and permissions for admin account, if they dont exist
               let adminRole, role;

               adminRole = await Role.findOne({ name: "admin" });
               if (!adminRole) {
                    adminRole = new Role({
                         name: "admin",
                         permissions: {
                              user: {
                                   "delete:own": [], //admin cannot delete their own account.
                                   "update:own": ["*", "!role"], //admin cannot change role for their own account
                                   "create:any": ["*"],
                                   "read:any": ["*"],
                                   "update:any": ["*"],
                                   "delete:any": ["*"],
                                   "delete:own": ["*"],
                              },
                              role: {
                                   "create:any": ["*"],
                                   "read:any": ["*"],
                                   "update:any": ["*"],
                                   "delete:any": ["*"],
                                   "create:own": ["*"],
                                   "read:own": ["*"],
                                   "update:own": ["*"],
                                   "delete:own": ["*"],
                              },

                              message: {
                                   "create:any": ["*"],
                                   "update:any": ["*"],
                                   "delete:any": ["*"],
                              },
                         },
                    });
               }

               role = await adminRole.save();

               //check if any users exist in database and create an Admin account if not.
               const user = await User.findOne({ username: "admin" });

               if (!user) {
                    console.log("No admin was found in database");

                    brcypt.hash("admin", 10, (err, hashedPassword) => {
                         //hashing an empty password for the admin account.

                         const user = new User({
                              username: "admin",
                              fname: "admin",
                              password: hashedPassword,
                              role: adminRole,
                         });
                         return user.save();
                    });
               }
               // Starting the server
               const server = app.listen(process.env.PORT);
               const io = require("socket.io")(server);
               io.on("connection", (socket) => {
                    console.log("Connected to Client");
               });
          } catch (error) {
               throw error;
          }

          ac.reload().then((roles) => {
               console.log("Roles were loaded");
          });
     })

     .catch((err) => console.log(err));
