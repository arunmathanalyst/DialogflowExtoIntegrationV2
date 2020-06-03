"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');

const restService = express();

const exto360URL = `https://uat.exto360.com/node/api/v1/userrole/user/module`;

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.get("/", function(req, res) {
  return res.json({ "success" : "Successfully tested the Dialogflow Exto Integration application" });
});

restService.post('/extoModules', function (req, res) {
    console.log('extoModules controller is hit.');
    const token = req.headers.authorization;
    if (!token) {
        res.send({ 'success': false, 'message': 'Invalid token' });
    }
    console.log(`Token: ${token}`);
    console.log('Connecting to the UAT server');
    let data = fetch(exto360URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }).then(resp => {
        return resp.json();
    }).catch(err => {
        console.log(err);
    });
    data = JSON.stringify(data);
    console.log(`data: ${data}`);
    const extoModules = {
        google: {
            expectUserResponse: true,
            richResponse: {
                items: [
                    {
                        simpleResponse: {
                            textToSpeech: data
                        }
                    }
                ]
            }
        }
    };
    
    return res.json({
        payload: extoModules,
        fulfillmentText: data,
        speech: data,
        displayText: data,
        source: "webhook-exto-modules"
    });
});
restService.listen(process.env.PORT || 8001, function() {
  console.log("Server up and listening");
});
