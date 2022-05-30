// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();
const port = 8080;

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

//Load bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize the main project folder
app.use('/', express.static('website'));

/* Handlers for different http request */

// GET route handler
app.get('/all', function (req, res) {
  res.send(projectData);
});

// POST route handler
app.post('/add', handlePostedData);

function handlePostedData(req, res){
    let newData = req.body;
    projectData["date"] = newData.date;
    projectData["city"] = newData.city;
    projectData["zipcode"] = newData.zipcode;
    projectData["temperature"] = newData.temperature;
    projectData["feedback"] = newData.feedback;
    console.log('here is project data ',projectData);
    res.send(projectData);
}

// Reporting when the app is listening in to server
app.listen(port, function() {
  console.log(`Weather application listening on port: ${port}!`)
});