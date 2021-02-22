//imports
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

//Setting up user schema
const rolesSchema = new Schema({
     name: Schema.Types.String,
     permissions: {
          role: {
               "create:any": [String],
               "read:any": [String],
               "update:any": [String],
               "delete:any": [String],
               "create:own": [String],
               "read:own": [String],
               "update:own": [String],
               "delete:own": [String],
          },
          user: {
               "create:any": [String],
               "read:any": [String],
               "update:any": [String],
               "delete:any": [String],
               "read:own": { type: [String], default: ["*"] },
               "update:own": { type: [String], default: ["*"] },
               "delete:own": [String],
          },
          message: {
               "create:any": [String],
               "read:any": { type: [String], default: ["*"] },
               "update:any": [String],
               "delete:any": [String],
               "create:own": { type: [String], default: ["*"] },
               "read:own": { type: [String], default: ["*"] },
               "update:own": { type: [String], default: ["*"] },
               "delete:own": { type: [String], default: ["*"] },
          },
     },
});
const Role = Mongoose.model("Role", rolesSchema);

module.exports = Role;
