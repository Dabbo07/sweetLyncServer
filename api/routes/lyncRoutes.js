'use strict';

module.exports = function(app) {
    var conversationController = require('../controllers/converstationController');
    var userController = require('../controllers/userController');
    
    app.route('/user/register')
        .post(userController.register_user);

    app.route('/user/status')
        .post(userController.user_status_update);

    app.route('/user/list')
        .post(userController.user_list);

    app.route('/user/password/change')
        .post(userController.user_update_password);

    app.route('/conversation/open')
        .post(conversationController.conversation_open);

    app.route('/conversation/select')
        .post(conversationController.get_conversation_by_id);

    app.route('/conversations/user')
        .post(conversationController.conversations_list);

    app.route('/conversation/detail/full')
        .post(conversationController.conversation_detail_full);

    app.route('/conversation/add')
        .post(conversationController.conversation_add_entry);

};