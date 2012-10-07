var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    sparse = { sparse:true },
    unique = { unique:true },
    sparseAndUnique = { sparse:true, unique:true };

var sparse = { sparse:true },
    unique = { unique:true },
    sparseAndUnique = { sparse:true, unique: true };

var AteSchema = new Schema({
  by   : { type:ObjectId, 'required':true },
  name : { type:String, 'required':true, min:1, max:50, index:unique },
  when : { type:Date, 'default':Date.now }
  // what : ID
  // score:
});

// Compound INDEXES
// AteSchema.index({ email:1, password:1 }, sparseAndUnique);

var UserModel = module.exports = mongoose.model('Food', AteSchema);