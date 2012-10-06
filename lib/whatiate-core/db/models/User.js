var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    sparse = { sparse:true },
    unique = { unique:true },
    sparseAndUnique = { sparse:true, unique:true };

var sparse = { sparse:true },
    unique = { unique:true },
    sparseAndUnique = { sparse:true, unique: true };

var UserSchema = new Schema({
  phone    : { type:String, min:1, max:50, index:sparseAndUnique }
});

// Compound INDEXES
UserSchema.index({ email:1, password:1 }, sparseAndUnique);

var UserModel = module.exports = mongoose.model('User', UserSchema);