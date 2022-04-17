const express = require('express');
const mongodb = require('mongodb');
const fs      = require('fs');
const router = express.Router();
var csvModel    = require('../models/benchmark');
var dataModel   = require('../models/data');
const { check, validationResult } = require('express-validator');
var csv         = require('csvtojson');
var arrayToInsert = [];
var arrayOfObjects = [];
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

// get all computer specs
router.post('/all-specs', (req,res)=>{
  dataModel.find({},(error, response)=>{
          if(error){
              return next(error)
          }else{
                res.status(200).json(response)
               }
     })
   })

// get benchmarks for a system
router.post('/benchmarks', (req,res)=>{
    const data = req.query.id;
    console.log(data)
    csvModel.find({ ['Unique ID']: data },(error, response)=>{
            if(error){
                return next(error)
            }else{
                  console.log(response)
                  res.status(200).json(response)
                 }
       })
     })

// get all benchmarks
router.post('/all-benchmarks', (req,res)=>{
  csvModel.find({},(error, response)=>{
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
  let filePath = req.files.file;
  let timeArray, cpuArray, CpuAvgArray, memoryArray, physicalMemoryAvailableArray = [];
  let baseArray = [];
    var runplus = req.body.run;
    if(req.files)
    {
      var file = req.files.file
      var filename = file.name
      let filenameNoExtension = (filename).substring(0, filename.length-4);
      file.mv(filename, function (err)
      {
        if(err)
          res.send(err)
        else
          res.send("File Uploaded")
      })
      csv().fromFile(filename).then(source =>
      {
        let uniqueID;
        let keyNames = Object.keys(source[0]);
        let dateIndex = keyNames.indexOf('Date');
        if ( dateIndex != -1 ) { keyNames.splice(dateIndex, 1) }
        dateIndex = keyNames.indexOf('Unique ID');
        if ( dateIndex != -1 ) { keyNames.splice(dateIndex, 1) }
        uniqueID = source[0]['Unique ID']
        console.log(uniqueID);
        csvModel.find({ ['Unique ID']: uniqueID, ['UploadName']: filePath.name },(error, response)=>{
          if(error){
              return next(error)
          }else{
                console.log(response.length)
                filenameNoExtension += "-" + response.length
                console.log(filenameNoExtension)

               }
        })
        console.log(filenameNoExtension +  "     line 158")
        let objectPayload = {
          'Unique ID': uniqueID,
          UploadName: filenameNoExtension,
          Date: source[0]["Date"]
        };
        keyNames.forEach( (keyFieldName, index) => {
          for (let i = 0; i < source.length; i++)
          {
            baseArray.push(source[i][keyNames[index]]);
          }
          objectPayload[keyFieldName] = baseArray;
          baseArray = [];
        });


        runplus = runplus+1;
        var collectionName = 'benchmarks';
        var collection = dbConn.collection(collectionName);
        collection.insertOne(objectPayload, (err, result) =>
        {
          if (err){
            console.log(err);
            return res.status(400).json({
              message: 'Upload Failed',
            });
          }
          if(result)
          {
            console.log("Imported CSV into database successfully.");
            // deletes saved CSV for file upload
            fs.unlinkSync(filename);
            return res.status(200)
          }
        })

      })
    }
})


module.exports = router;
