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
  who  : { type:ObjectId, 'required':true },
  name : { type:String, 'required':true },
  when : { type:Date, 'default':Date.now },
  whatId : { type:String },
  score: { type:String }
});

// Compound INDEXES
// AteSchema.index({ email:1, password:1 }, sparseAndUnique);

var UserModel = module.exports = mongoose.model('Food', AteSchema);