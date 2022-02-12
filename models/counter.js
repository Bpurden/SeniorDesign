var mongoose  =  require('mongoose');

var counterSchema = mongoose.Schema({
    "_id": { "type": String, "required": true },
    "seq": { "type": Number, "default": 0 }
});
module.exports = mongoose.model('counter', counterSchema);

userSchema.pre("save", function (next) {
  var doc = this;
  counter.findByIdAndUpdate(
      { "_id": "userID" },
      { "$inc": { "seq": 1 } }
  , function(error, c /*counter*/)   {
      if(error)
        return next(error);
      else if(!c) {
        c = new counter({ _id: "userID" }, { $inc: { seq: 1 } };
        c.save(function() {
          doc.userID = (c.seq - 1) + '';
          next();
        });
      } else {
        doc.userID = counter.seq.toString();
        next();
      }
  });
});
