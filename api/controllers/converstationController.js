'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Conversation = mongoose.model('Conversation'),
    ConversationParty = mongoose.model('ConversationParty'),
    ConversationEntry = mongoose.model('Conversation_Entry');

var encService = require('../services/encryptionService').EncryptionService;
var userService = require('../services/userService').UserService;
var conversationService = require('../services/conversationService').ConversationService;

exports.get_conversation_by_id = function(req, res) {
    var data = req.body;
    var requestUser = data.user;
    var requestConv = data.conversation;
    userService.validateUser(
        requestUser,
        function() {
            console.log("User authenticated.");
            conversationService.getConversationById(
                requestConv, 
                function(entries) {
                    res.json(entries);
                },
                function(errorMessage) {
                    res.json(errorMessage);
                }
            );
        },
        function() {
            console.log("User failed authentication");
            res.json("{}");
        }
    );
};

exports.conversation_open = function(req, res) {
    var data = req.body;
    var requestUser = data.user;
    userService.validateUser(
        requestUser, 
        function() {
            console.log("User authenticated.");
            conversationService.createOrRetrieveConversation(
                data,
                function(conversationId) {
                    res.json(conversationId);
                },
                function(errorMessage) {
                    res.send(errorMessage);
                }
            );
        },
        function() {
            console.log("User failed authentication.");
            res.json("{}");
        }
    );
};

exports.conversations_list = function(req, res) {
    console.log("conversationController:conversation_list() : body: " + JSON.stringify(req.body));
    var requestUser = new User(req.body);
    userService.validateUser(
        requestUser, 
        function(validatedUser) {
            console.log("User authenticated.");
            conversationService.getConversationsForUser(
                validatedUser,
                function(conversationList) {
                    console.log("Conversation list: size: " + conversationList.length);
                    res.json(conversationList);
                },
                function(errorMessage) {
                    console.log("Error: " + errorMessage);
                    res.send(errorMessage);
                }
            );
        },
        function() {
            console.log("conversationController:conversation_list() : User failed authentication.");
            res.json("[]");
        }
    );
};

exports.conversation_detail_full = function(req, res) {
    var data = req.body;
    userService.validateUser(
        data.user, 
        function() {
            console.log("User authenticated.");
            conversationService.getConversationDetailFull(
                data.conversation_id,
                function(detail) {
                    res.json(detail);
                },
                function(errorMessage) {
                    res.send(errorMessage);
                }
            );
        },
        function() {
            console.log("User failed authentication.");
            res.json("{}");
        }
    );
};

exports.conversation_add_entry = function(req, res) {
    var data = req.body;
    userService.validateUser(
        data.user, 
        function() {
            console.log("User authenticated.");
            conversationService.conversationAddEntry(
                data,
                function() {
                    res.json("{true}");
                },
                function(errorMessage) {
                    res.send(errorMessage);
                }
            );
        },
        function() {
            console.log("User failed authentication.");
            res.json("{}");
        }
    );
}
    