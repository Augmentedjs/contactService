XMLHttpRequest = require("xhr2");
var Augmented = require("../lib/augmented.js");
Augmented.Service = require("../lib/service.js");
var Mock = require("../mock.js");
var ORM = require("../orm.js");
var User = ORM.User;
var Users = ORM.Users;

describe("Given User ORM", function() {
	it("is defined", function() {
		expect(ORM).toBeDefined();
	});

    it("has an user object", function() {
        expect(User).toBeDefined();
    });

    it("has an users object", function() {
        expect(Users).toBeDefined();
    });

    it("has 10 users from mock", function() {
        var users = Mock.makeUpModels(10);
        expect(users.length).toEqual(10);
    });



});
