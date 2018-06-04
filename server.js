var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    User = require('./api/models/userModel'),
    Conversation = require('./api/models/conversationModel'),
    ConversationEntry = require('./api/models/conversationEntryModel'),
    ConversationParty = require('./api/models/conversationPartyModel'),
    bodyParser = require('body-parser');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://lyncapp:lyncpass@localhost/sweetlyncdb', { useMongoClient: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/lyncRoutes');
routes(app);

app.listen(port);

console.log("SweetLync Server v1");
console.log("RESTful API server started on : " + port);
