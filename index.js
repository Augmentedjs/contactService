var express = require("express");
var Augmented = require("augmentedjs");
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
var collection;
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
    collection.find().toArray(function(err, results) {
        res.send(results);
    });
});

app.get("/users/:id", function (req, res) {
    var id = Number(req.params.id);
    logger.debug("looking for " + id);
    collection.find({ "ID": id }).toArray(function(err, results) {
        if (results && results.length > 0) {
            res.send(results[0]);
        } else {
            res.send({});
        }
    });
});

app.post("/users", function(req, res) {
    var data = req.body;
    logger.debug(JSON.stringify(data));
    var user = new User(data);
    logger.debug(JSON.stringify(user));
    if (user.isValid()) {
        collection.insert(user.toJSON());
        res.status(201).send(data);
    } else {
        res.status(400).send(user.validationMessages);
        logger.error(JSON.stringify(user.validationMessages));
    }
});

app.put("/users/:id", function(req, res) {
    var id = Number(req.params.id);
    var user = new User(data);
    if (user.isValid()) {
        collection.update({ "ID": id }, user.toJSON());
        res.status(200).send(data);
    } else {
        res.status(400).send(user.validationMessages);
        logger.error(JSON.stringify(user.validationMessages));
    }
});

app.delete("/users/:id", function(req, res) {
    var id = Number(req.params.id);
    if (id) {
        collection.remove({ "ID": id });
        res.status(204).send();
    } else {
        res.status(400).send("No ID to delete!");
        logger.error("No ID to delete!");
    }
});

app.listen(PORT, function () {
	logger.info("User Contact REST service listening on port " + PORT);
    // Connect to the db
    MongoClient.connect(URL, function(err, db) {
        if(!err) {
            logger.info("We are connected to MongoDB 'user' collection on 'contacts.'");
            collection = db.collection("user");
        } else {
            logger.warn("No DB");
        }
    });
});
