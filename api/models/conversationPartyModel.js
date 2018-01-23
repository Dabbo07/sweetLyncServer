'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationPartySchema = new Schema({
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    username: {
        type: String
    },
    notifications: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('ConversationParty', ConversationPartySchema);