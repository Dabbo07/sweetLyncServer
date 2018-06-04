'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationEntrySchema = new Schema(
    {
        conversation_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        username: {
            type: String
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId
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
    }
);

module.exports = mongoose.model('Conversation_Entry', ConversationEntrySchema, 'conversation_entry');