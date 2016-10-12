var Augmented = require("augmentedjs");
Augmented.Service = require("augmentedjs-service");
var Schema = require("./userSchema.js");
var DataSource = require("./datasource.js");

/* My ORM */

exports.User = (User) = Augmented.Service.Entity.extend({
    schema: Schema.user,
    datasource: DataSource.getDataSource()
});

exports.Users = Augmented.Service.Collection.extend({
    model: User
});
