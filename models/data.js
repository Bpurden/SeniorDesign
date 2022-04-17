var mongoose  =  require('mongoose');

var dataSchema = new mongoose.Schema({
  CPU:{
      type:String
  },
  powersupply:{
      type:String
  },
  RAM:{
      type:String
  },
  SystemName:{
      type:String
  },
  UniqueID:{
    type:String
  }
});
module.exports = mongoose.model('computerspecs', dataSchema);
