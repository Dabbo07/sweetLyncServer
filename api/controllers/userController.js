'use strict';

var uft8 = require("utf8");
var mongoose = require('mongoose'),
    User = mongoose.model('User');

var userService = require('../services/userService').UserService;

exports.user_list = function(req, res) {
    var requestUser = new User(req.body);
    userService.validateUser(
        requestUser, 
        function() {
            userService.getUserList(
                function(result) {
                    res.json(result);
                },
                function(errorMessage) {
                    res.send(errorMessage);
                }
            );
        },
        function(errorMessage) {
            // User failed authentication.
            res.send(errorMessage);
        }
    );
};

exports.register_user = function(req, res) {
    var new_user = new User(req.body);
    userService.registerNewUser(
        new_user,
        function(userId) {
            res.json(userId);
        },
        function(errorMessage) {
            res.send(errorMessage);
        }
    );
};

exports.user_status_update = function(req, res) {
    var requestUser = req.body;
    userService.validateUser(
        requestUser,
        function() {
            userService.updateUser(
                requestUser._id,
                requestUser,
                function() {
                    res.json("{true}");
                },
                function(errorMessage) {
                    res.send(errorMessage);
                }
            );
        },
        function(errorMessage) {
            res.send(errorMessage);
        }
    );
};

exports.user_update_password = function(req, res) {
    var requestUser = req.body.user;
    var oldPassword = req.body.oldPassword;
    userService.updateUserPassword(
        requestUser,
        oldPassword,
        function() {
            res.json("{true}");
        },
        function(errorMessage) {
            res.send(errorMessage);
        }
    );
};
