'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationSchema = new Schema(
    {
        alias: {
            type: String
        }
    }
);

module.exports = mongoose.model('Conversation', ConversationSchema, 'conversation');
    
    