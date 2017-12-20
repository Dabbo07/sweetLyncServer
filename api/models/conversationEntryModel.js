'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationEntrySchema = new Schema({
    conversation_id: {
        type: String
    },
    username: {
        type: String
    },
    user_id: {
        type: String
    },
    entry_date: {
        type: Date,
        default: Date.now
    },
    entry_ref: {
        type: Number
    },
    entry: {
        type: String
    }
});

module.exports = mongoose.model('ConversationEntry', ConversationEntrySchema);