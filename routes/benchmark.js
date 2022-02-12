const express = require('express');
const mongodb = require('MongoDB');
const router = express.Router();
var csvModel    = require('../models/benchmark');
var dataModel    = require('../models/data');
const { check, validationResult } = require('express-validator');
var csv         = require('csvtojson');
var arrayToInsert = [];
var url = "mongodb+srv://bpurden:Monkeybutt1@benchmark.avxjr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var dbConn;


mongodb.MongoClient.connect(url, {
    useUnifiedTopology: true,
}).then((client) => {
    dbConn = client.db();
}).catch(err => {
    console.log("DB Connection Error: ${err.message}");
});

//Register Specs of the computer
router.post('/specs',  (req, res, next) => {
    const errors = validationResult(req);
    const result = 0;
        const specs = new dataModel({
          cpu: req.body.cpu,
          graphicscard: req.body.graphicscard,
          powersupply: req.body.powersupply,
          ram: req.body.ram,
          storage: req.body.storage,
          run: req.body.run,
        });
        specs
          .save()
          .then((response) => {
            res.status(201).json({
              result: response,
              message: 'Specs Successfully saved!'
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: 'error',
            });
          });
  }
);

// get all benchmarks requires specs id and runnumber
router.post('/benchmarks', (req,res)=>{
    const data = req.body.id;
    const run = req.body.run;
    console.log(run);
    csvModel.find({ uploadnum: run , number: data},(error, response)=>{
            if(error){
                return next(error)
            }else{
                  res.status(200).json(response)
                 }
       })
     })

//upload file requires id and runnumber from computer
router.post('/upload', async (req,res,next) =>
{
  try{
      const data = req.body.id;
      var runplus = req.body.run;
      const options = {new: true};
      solution = runplus+1;
      const result = await dataModel.findByIdAndUpdate(data, {run: solution}, options);
    }catch (error) {
      console.log("didnt work");
    }
    var runplus = req.body.run;
    if(req.files)
    {
      var file = req.files.file
      var filename = file.name
      file.mv('./csvfiles/' + filename, function (err)
      {
        if(err)
          res.send(err)
        else
          res.send("File Uploaded")
      })
      csv().fromFile("./csvfiles/" + filename).then(source =>
      {
        for (var i = 0; i < source.length; i++)
        {
          var oneRow =
          {
              number: req.body.id,
              uploadnum: runplus,
              Date: source[i]["Date"],
              Time: source[i]["Time"],
              cpu: source[i]["Core Usage (avg) [%]"],
              CpuAvg: source[i]["Total CPU Usage [%]"],
              Memory: source[i]["Memory Clock [MHz]"],
              PhysicalMemoryAvailable: source[i]["Physical Memory Available [MB]"]
          };
          arrayToInsert.push(oneRow);
        }
        runplus = runplus+1;
        var collectionName = 'computerspecs';
        var collection = dbConn.collection(collectionName);
        var collectionName2 = 'benchmarks';
        var collection2 = dbConn.collection(collectionName2);
        collection.insertMany(arrayToInsert, (err, result) =>
        {
          if (err){
            console.log(err);
            return res.status(400).json({
              message: 'Upload Failed',
            });
          }
          if(result)
          {
            console.log("Import CSV into database successfully.");
            return res.status(200)
          }
        })

      })
    }
})


module.exports = router;
