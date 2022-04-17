const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();
var csvModel    = require('../models/benchmark');
const { check, validationResult } = require('express-validator');
var csv         = require('csvtojson');
var arrayToInsert = [];
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
        const specs = new csvModel({
          Cpu: req.body.cpu,
          GraphicsCard: req.body.graphicscard,
          PowerSupply: req.body.powersupply,
          Ram: req.body.ram,
          Storage: req.body.storage,
        });
        specs
          .save()
          .then((response) => {
            res.status(201).json({
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

// get all benchmarks
router.get('/benchmarks',(req,res)=>{
    csvModel.find((error, response)=>{
         if(error){
             return next(error)
         }else{
                res.status(200).json(response)
              }
    })
})

//upload file
router.post('/upload', (req,res) =>
{
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
            Date: source[i]["Date"],
            Time: source[i]["Time"],
            cpu: source[i]["Core Usage (avg) [%]"],
            CpuAvg: source[i]["Total CPU Usage [%]"],
            Memory: source[i]["Memory Clock [MHz]"],
            PhysicalMemoryAvailable: source[i]["Physical Memory Available [MB]"]
          };
          arrayToInsert.push(oneRow);
        }
        var collectionName = 'benchmarkrecords';
        var collection = dbConn.collection(collectionName);
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
