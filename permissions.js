const AccessControl = require("accesscontrol").AccessControl;

//ACCESS CONTROL DEFINITIONS
const ac = new AccessControl();
ac.grant("user")
     .createOwn("notes")
     .deleteOwn("notes")
     .readOwn("notes")
     .readOwn("homepage")
     .grant("admin")
     .extend("user")
     .updateAny("notes")
     .updateAny("notes")
     .deleteAny("notes")
     .createAny("user")
     .updateAny("user")
     .deleteAny("user")
     .readAny("user")
     .grant("bannedUser"); //basically no rights at all.

module.exports = ac;
