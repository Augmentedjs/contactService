var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
var Augmented = require("./lib/augmented.js");
Augmented.Service = require("./lib/service.js");


console.log("Service? " + (Augmented.Service.DataSourceFactory !== null));
module.exports = {
    _ds: null,
    getDataSource: function() {
        if (!module.exports._ds) {
            module.exports._ds = Augmented.Service.DataSourceFactory.getDatasource(
                Augmented.Service.DataSourceFactory.Type.MongoDB, MongoClient);
        }
        return module.exports._ds;
    }
};
