//Packets
const express      = require("express");
const mongoose     = require('mongoose');
const dotenv       = require("dotenv")
const bodyparser   = require("body-parser")
const cookieParser = require('cookie-parser')
const cors         = require('cors')

//configure .env
dotenv.config()

//App Express
const app  = express();
const port = 8000;

//Managers and Controllers
const userRoutes    = require("./managers/userManager");
const notebookRoutes= require("./managers/notebookManager");
const jwtManager    = require("./managers/jwtManager");

//Config stuff
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(cookieParser())
app.use(cors())
app.use(bodyparser.urlencoded({ extended: true}));
app.use(bodyparser.json());
app.use(express.static('public'));
app.use("/api/user/",userRoutes)
app.use("/api/notebook/",notebookRoutes)

app.listen(port);
