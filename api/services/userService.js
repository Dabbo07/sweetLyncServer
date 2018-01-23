'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

var encService = require('../services/encryptionService').EncryptionService;

var UserService = function() {};

UserService.prototype.validateUser = function(requestUser, validUserFunc, invalidUserFunc) {
    User.findOne({username: requestUser.username}, function(err, user) {
        if (err) {
            invalidUserFunc("ERROR: " + err);
            return false;
        };
        var requestUserPassword = encService.decryptText(requestUser.password);
        console.log('password: ' + requestUserPassword);
        if (user != null && encService.decryptText(user.password) === requestUserPassword && requestUserPassword != "") {
            validUserFunc(user);
            return true;
        } else {
            invalidUserFunc("Invalid user credentials");
            return false;
        }
    });
};

UserService.prototype.getUserById = function(id, successFunc, failedFunc) {
    User.findOne({ _id: id }, function(err, foundUser) {
        if (err) {
            failedFunc("ERROR: Unable to find user by ID [" + id + "] : " + err);
        } else {
            successFunc(foundUser);
        };
    });
};

UserService.prototype.getUserList = function(successFunc, failedFunc) {
    console.log("UserService.getUserList()");
    User.find({}, function(err, userList) {
        if (err) {
            failedFunc('ERROR: Unable to retrieve user list: ' + err)
        } else {
            console.log("Returning user list: " + userList.length + " item(s)");
            successFunc(userList);
        };
    });
};

UserService.prototype.registerNewUser = function(newUser, successFunc, failedFunc) {
    User.findOne({username: newUser.username}, function(err, user) {
        if (err) {
            failedFunc('ERROR: Failed to lookup existing users: ' + err);
        } else {
            if (user) {
                failedFunc("ERROR: Username already taken.");
            } else {
                newUser.save(function(err, user) {
                    if (err) {
                        failedFunc("ERROR: Unable to save new user to database: " + err);
                    } else {
                        successFunc(user._id);
                    };
                });
            };
        };
    });
};

UserService.prototype.updateUser = function(updateUserId, updateUser, successFunc, failedFunc) {
    console.log("UserService.updateUser() : updateUserId : " + updateUserId);
    User.findOne({_id: updateUserId}, function(err, user) {
        console.log("UserService.updateUser() : userLookup : " + JSON.stringify(user));
        if (err || user === undefined) {
            failedFunc("ERROR: Failed to find user: " + err);
        } else {
            User.findOneAndUpdate({ _id: updateUserId }, updateUser, {new: false}, function(err, updatedUser) {
                if (err) {
                    failedFunc("ERROR: Failed to update user: " + err)
                } else {
                    successFunc();
                };
            });
        };
    });
};

UserService.prototype.updateUserPassword = function(updateUser, oldPassword, successFunc, failedFunc) {
    User.findOne({_id: updateUser._id}, function(err, user) {
        if (err) {
            failedFunc("ERROR: Failed to find user: " + err);
        } else {
            var oldPassword = encService.decryptText(oldPassword);
            if (user != null && encService.decryptText(user.password) === oldPassword && oldPassword != "") {
                User.findOneAndUpdate({ _id: user._id }, updateUser, {new: false}, function(err, updatedUser) {
                    if (err) {
                        failedFunc("ERROR: Failed to update user password: " + err)
                    } else {
                        successFunc();
                    };
                });
            } else {
                failedFunc("ERROR: User not authenticated to change password");
            };
        };
    });
};

exports.UserService = new UserService();
