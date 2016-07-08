var Augmented = require("augmentedjs");
var schema = require("./userSchema.js");

/* My ORM */

exports.User = (User) = Augmented.Model.extend({
    schema: schema.user
});

exports.Users = Augmented.Collection.extend({
    model: User
});
