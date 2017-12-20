'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Conversation = mongoose.model('Conversation'),
    ConversationParty = mongoose.model('ConversationParty'),
    ConversationEntry = mongoose.model('ConversationEntry');

var encService = require('../services/encryptionService').EncryptionService;
var userService = require('../services/userService').UserService;
var conversationService = require('../services/conversationService').ConversationService;

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
    