const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const upload = require('express-fileupload')
const csvtojson = require("csvtojson");

dotenv.config({path: './config/config.env'})

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(upload());

const auth= require('./routes/users');
app.use('/api', auth)
const bench = require('./routes/benchmark');
app.use('/api', bench);

app.get('/', (req,res, next) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
});
