var UserModel   = require('./models/User'),
    mongoose    = require('mongoose');
var AteModel   = require('./models/Ate');
var db = module.exports = {
  User : UserModel,
  users: UserModel.collection,
  Ate  : AteModel,
  ates : AteModel.collection,
  mongoose: mongoose,
  ObjectId: mongoose.Types.ObjectId
};