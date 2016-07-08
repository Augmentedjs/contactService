var Augmented = require("augmentedjs");
var orm = require("./orm.js");
var User = orm.User;
var Users = orm.Users;

exports.makeUpNames = function(amount) {
    var i = 0, r = 0, d,
        map = new Augmented.Utility.AugmentedMap(),
        key = "ID";
    for (i = 0; i < amount; i++) {
        r = i;//Math.round(Math.random(r) * 1000000);
        d = new User({ "Name": "name" + r, "ID": r, "Email": "name@augmentedjs.org", "Role": "nobody", "Active": false });
        map.set(d.get(key), d);
    }
    return map;
};

exports.makeUpModels = function(amount) {
    var i = 0, r = 0,
        collection = new Users(),
        key = "ID";
    for (i = 0; i < amount; i++) {
        r = Math.ceil(Math.random(r) * 1000);
        collection.add(new User({ "Name": "name" + r, "ID": r, "Email": "name@augmentedjs.org", "Role": "nobody", "Active": false }));
    }
    return collection;
};
