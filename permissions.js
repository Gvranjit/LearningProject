const AccessControl = require("accesscontrol").AccessControl;
const Role = require("./models/roles");

//ACCESS CONTROL DEFINITIONS

//creating a promise in order to make it eaiser to call this from anywhere.
let ac;
module.exports = {
     reload: () => {
          return new Promise(async (resolve, reject) => {
               try {
                    const roles = await Role.find();
                    let roleObject = {};

                    roles.forEach((role) => {
                         roleObject[role.name] = role._doc.permissions;
                    });

                    ac = new AccessControl(roleObject);

                    resolve(ac);
               } catch (error) {
                    reject(error);
               }
          });
     },
     ac: () => {
          return ac;
     },
};
