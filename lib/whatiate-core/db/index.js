var UserModel   = require('./models/User'),
    mongoose    = require('mongoose');
var db = module.exports = {
  User : UserModel,
  users: UserModel.collection

};