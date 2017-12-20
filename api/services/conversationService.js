'use strict';

var userService = require('../services/userService').UserService;

var mongoose = require('mongoose'),
    Conversation = mongoose.model('Conversation'),
    ConversationParty = mongoose.model('ConversationParty'),
    ConversationEntry = mongoose.model('ConversationEntry');

var ConversationService = function() {};

ConversationService.prototype.getConversationDetailFull = function(conversationId, successFunc, failedFunc) {
    var result = {};
    ConversationParty.find({ conversation_id: conversationId }, function(err, partyMembers) {
        if (err) {
            failedFunc("ERROR: Unable to get conversation details. " + err);
        } else {
            result.members = partyMembers;
            ConversationEntry.find({ conversation_id: conversationId }, function(err, entries) {
                if (err) {
                    failedFunc("ERROR: Unable to get conversation entries: " + err);
                } else {
                    result.entries = entries;
                    successFunc(result);
                };
            });
        };
    });
};

ConversationService.prototype.conversationAddEntry = function(entry, successFunc, failedFunc) {
    ConversationParty.findOne(
        { 
            $and: [
                { _id : entry.conversation_id },
                { user_id : entry.user._id }
            ]
        }, 
        function(err, conversationFound) {
            if (err) {
                failedFunc("ERROR: Unable to find conversation [" + entry.conversation_id + "] : " + err);
            } else {
                var newEntry = new ConversationEntry();
                newEntry.conversation_id = entry.conversation_id;
                newEntry.username = entry.user.username;
                newEntry.user_id = entry.user._id;
                newEntry.entry = entry.message;
                newEntry.save(function(err, successEntry) {
                    if (err) {
                        failedFunc("ERROR: Unable to save conversation entry: " + err);
                    } else {
                        successFunc();
                    };
                });
            };
        }
    );
};


ConversationService.prototype.createOrRetrieveConversation = function(data, successFunc, failedFunc) {
    var queryOps = [
        { 
            $match: {
                $or: [
                    { user_id: data.conversation.user_id },
                    { user_id: data.conversation.target_id }
                ],
            }
        },
        {
            $group: {
                _id: "$conversation_id",
                count: { 
                    $sum: 1 
                }
            }
        }
    ];
    
    ConversationParty.aggregate(queryOps).exec(function(err, foundConversations) {
        if (err) {
            failedFunc('ERROR: Conversation Lookup failed: ' + err);
        } else {
            // Search through found conversations, look for 2 participants and return that ID.
            for (var i = 0; i< foundConversations.length; i++ ) {
                if (foundConversations[i].count === 2) {
                    successFunc(foundConversations[i]._id);
                    return;
                };
            };
    
            // No suitable conversation found, create a new one.
            userService.getUserById(
                data.conversation.target_id,
                function(foundUser) {
                    var conversation = new Conversation();
                    conversation.alias = "Conversation with " + foundUser.username;
                    conversation.save(function(err, conversationSaved) {
                        if (err) {
                            failedFunc("ERROR: Unable to save conversation : " + err);
                        } else {
                            var conversationParty1 = new ConversationParty();
                            conversationParty1.conversation_id = conversation._id;
                            conversationParty1.user_id = data.conversation.user_id;
                            conversationParty1.username = data.user.username;
                            conversationParty1.notifications = true;
    
                            conversationParty1.save(function(err, savedConvParty1) {
                                var conversationParty2 = new ConversationParty();
                                conversationParty2.conversation_id = conversation._id;
                                conversationParty2.user_id = data.conversation.target_id;
                                conversationParty2.username = data.foundUser.username;
                                conversationParty2.notifications = true;
                                conversationParty2.save(function(err, savedConvParty2) {
                                    if (err) {
                                        failedFunc("ERROR: Unable to save conversation : " + err);
                                    } else {
                                        successFunc(conversationSaved._id);
                                    };
                                });
                            });
                        };
                    });
                },
                function(errorMessage) {
                    failedFunc(errorMessage);
                }
            );
        };
    });
};

exports.ConversationService = new ConversationService();
