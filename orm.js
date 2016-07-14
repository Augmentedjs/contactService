var Augmented = require("augmentedjs");
var Service = require("./lib/service.js");
var schema = require("./userSchema.js");

/* My ORM */

exports.User = (User) = Augmented.Service.Entity.extend({
    schema: schema.user
});

exports.Users = Augmented.Collection.extend({
    model: User
});
