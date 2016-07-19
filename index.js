XMLHttpRequest = require("xhr2");
var express = require("express");
var Augmented = require("augmentedjs");
var Service = require("./lib/service.js");
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
var orm = require("./orm.js");
var User = orm.User;
var Users = orm.Users;
var URL = "mongodb://localhost:27017/contacts";
var ABOUT = "User Contact REST Service for Node.js - Powered by Augmented.js version " + Augmented.VERSION;
var PORT = 3000;
//var collection;
var logger = Augmented.Logger.LoggerFactory.getLogger(Augmented.Logger.Type.console, Augmented.Logger.Level.debug);
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


/* REST API */

app.get("/", function() {
	res.send(ABOUT);
});

app.get("/about", function() {
    res.send(ABOUT);
});

app.get("/users", function (req, res) {
    /*collection.find().toArray(function(err, results) {
        res.send(results);
    });*/
    var users = new Users({
        "datasource": app.datasource
    });

    users.fetch({
        "success": function() {
            res.send(users);
        },
        "error": function(e) {
            res.status(400).send("Failed to query users." + e);
        }
    });
});

app.get("/users/:id", function(req, res) {
    var id = Number(req.params.id);
    /*logger.debug("looking for " + id);
    logger.debug("datasource " + app.datasource);*/
    var user = new User({
        "datasource": app.datasource,
        "id": id,
        "query": { "ID": id }
    });

    user.fetch({
        "success": function() {
            res.send(user);
        },
        "error": function(e) {
            res.status(400).send("Failed to query user." + e);
        }
    });
});

app.post("/users", function(req, res) {
    var data = req.body;
    //logger.debug(JSON.stringify(data));
    var user = new User(data);
    user.datasource = app.datasource;

    //logger.debug(JSON.stringify(user));
    if (user.isValid()) {
        user.save({
            "success": function() {
                res.status(201).send(user);
            },
            "error": function(e) {
                res.status(400).send("Failed to save user." + e);
            }
        });

        /*
        collection.insert(user.toJSON());
        res.status(201).send(data);
        */
    } else {
        res.status(400).send(user.validationMessages);
        logger.error(JSON.stringify(user.validationMessages));
    }
});

app.put("/users/:id", function(req, res) {
    var id = Number(req.params.id);
    var data = req.body;
    var user = new User(data);
    user.datasource = app.datasource;
    user.id = id;
    user.query = { "ID": id };
    
    if (user.isValid()) {
        user.update({
            "success": function() {
                res.status(200).send("updated");
            },
            "error": function(e) {
                res.status(400).send("Failed to save user." + e);
            }
        });
        //collection.update({ "ID": id }, user.toJSON());
        //res.status(200).send(data);
    } else {
        res.status(400).send(user.validationMessages);
        logger.error(JSON.stringify(user.validationMessages));
    }
});

app.delete("/users/:id", function(req, res) {
    var id = Number(req.params.id);
    if (id) {
        var user = new User({
            "datasource": app.datasource,
            "id": id,
            "query": { "ID": id }
        });

        user.destroy({
            "success": function() {
                res.status(204).send("");
            },
            "error": function(e) {
                res.status(400).send("Failed to delete user." + e);
            }
        });
        //collection.remove({ "ID": id });
        //res.status(204).send();
    } else {
        res.status(400).send("No ID to delete!");
        logger.error("No ID to delete!");
    }
});

app.listen(PORT, function () {
	logger.info("User Contact REST service listening on port " + PORT);
    app.datasource = Augmented.Service.DataSourceFactory.getDatasource(
        Augmented.Service.DataSourceFactory.Type.MongoDB, MongoClient);

    var c = app.datasource.getConnection(URL, "user");
    if (c) {
        logger.info("We are connected to MongoDB 'user' collection on 'contacts.'");
    } else {
        logger.warn("No DB");
    }
});
