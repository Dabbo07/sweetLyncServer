'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        username: {
            type: String
        },
        password: {
            type: String
        },
        status: {
            type: Number
        }
    }
);

module.exports = mongoose.model('User', UserSchema, 'lync_user');
