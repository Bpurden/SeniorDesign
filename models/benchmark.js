var mongoose  =  require('mongoose');

var benchmarkSchema = new mongoose.Schema({
    number:{
        type:String
    },
    uploadnum:{
        type:Number
    },
    date:{
        type:String
    },
    time:{
        type:String
    },
    cpu:{
        type:String
    },
    cpuavg:{
        type:String
    },
    memory:{
        type:String
    },
    physicalmemoryavailable:{
        type:String
    },


});

module.exports = mongoose.model('computerspecs', benchmarkSchema);
