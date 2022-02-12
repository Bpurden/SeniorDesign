var mongoose  =  require('mongoose');

var dataSchema = new mongoose.Schema({
  cpu:{
      type:String
  },
  graphicscard:{
      type:String
  },
  powersupply:{
      type:String
  },
  ram:{
      type:String
  },
  storage:{
      type:String
  },
  run:{
      type:String
  },

});
module.exports = mongoose.model('benchmarks', dataSchema);
