"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.get("/", function(req, res) {
  return res.json({ "success" : "Successfully tested the Dialogflow Exto Integration application" });
});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
