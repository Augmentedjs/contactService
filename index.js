XMLHttpRequest = require("xhr2");
var Augmented = require("./lib/augmented.js");
Augmented.Service = require("./lib/service.js");
var express = require("express");
var bodyParser = require("body-parser");
var DataSource = require("./datasource.js");
var ORM = require("./orm.js");
var User = ORM.User;
var Users = ORM.Users;

var URL = "mongodb://localhost:27017/contacts";
var ABOUT = "User Contact REST Service for Node.js - Powered by Augmented.js version " + Augmented.VERSION;
var PORT = 3000;

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
    var user = new User(data);
    user.datasource = app.datasource;

    if (user.isValid()) {
        user.save({
            "success": function() {
                res.status(201).send(user);
            },
            "error": function(e) {
                res.status(400).send("Failed to save user." + e);
            }
        });
    } else {
        res.status(400).send(user.validationMessages);
        logger.error(JSON.stringify(user.validationMessages));
    }
});

app.put("/users/:id", function(req, res) {
    var id = Number(req.params.id);
    var data = req.body;
    /*var user = new User(data);
    user.datasource = app.datasource;
    user.id = id;
    user.query = { "ID": id };*/
    var user = new User({
        "datasource": app.datasource,
        "id": id,
        "query": { "ID": id }
    });
    user.set(data);

    if (user.isValid()) {
        user.update({
            "success": function() {
                res.status(200).send("updated");
            },
            "error": function(e) {
                res.status(400).send("Failed to save user." + e);
            }
        });
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
    } else {
        res.status(400).send("No ID to delete!");
        logger.error("No ID to delete!");
    }
});

app.listen(PORT, function () {
	logger.info("User Contact REST service listening on port " + PORT);
    logger.debug("module " + JSON.stringify(DataSource));
    app.datasource = DataSource.getDataSource();
    var c = app.datasource.getConnection(URL, "user");
    if (c) {
        logger.info("We are connected to MongoDB 'user' collection on 'contacts.'");
    } else {
        logger.warn("No DB");
    }
});
