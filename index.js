"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const restService = express();

const LOAD_MODULE = "Modules";
const LOAD_PROJECT = "Projects";
const LOAD_CUSTOMER = "Customers";

restService.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

restService.use(bodyParser.json());

restService.get("/", function (req, res) {
  return res.json({
    success: "Successfully tested the Dialogflow Exto Integration application",
  });
});

restService.post("/exto", async function (req, res) {
  let returnData = null;
  console.log("exto controller is hit.");
  try {
    const token = req.headers.authorization;
    if (!token) {
      returnData = { success: false, message: "Invalid token" };
    }
    const exto360BaseURL = req.headers.exto360url;
    if (!exto360BaseURL) {
      returnData = { success: false, message: "Invalid Exto URL" };
    }
    let requestType = null;
    if (
      req.body.queryResult &&
      req.body.queryResult.parameters &&
      req.body.queryResult.parameters.requestType
    ) {
      requestType = req.body.queryResult.parameters.requestType;
    }
    if (!requestType) {
      returnData = { success: false, message: "Invalid Request Type" };
    }

    let EXTO_API_URL = null;
    if (LOAD_MODULE === requestType) {
      EXTO_API_URL = `${exto360BaseURL}/node/api/v1/userrole/user/module`;
    } else if (LOAD_PROJECT === requestType) {
      EXTO_API_URL = `${exto360BaseURL}/node/api/v1/userrole/user/module`;
    } else if (LOAD_CUSTOMER === requestType) {
      EXTO_API_URL = `${exto360BaseURL}/node/api/v1/userrole/user/module`;
    } else {
      returnData = { success: false, message: "Invalid end point" };
    }

    if (!token || !exto360BaseURL || !requestType || !EXTO_API_URL) {
      throw returnData;
    }
    console.log(`Connecting to Exto server: ${EXTO_API_URL}`);

    let data = await fetch(EXTO_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((resp) => {
        return resp.json();
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(`data: ${data}`);
    const extoModules = {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech: data,
              },
            },
          ],
        },
      },
    };
    return res.json({
      payload: extoModules,
      fulfillmentText: JSON.stringify(data),
      speech: data,
      displayText: data,
      source: "webhook-exto-modules",
    });
  } catch (err) {
    return res.json({
      payload: returnData,
      fulfillmentText: JSON.stringify(returnData),
      speech: returnData,
      displayText: returnData,
      source: "webhook-exto-modules",
    });
  }
});
restService.listen(process.env.PORT || 8000, function () {
  console.log(
    `Exto-Dialogflow Integration app is up and running`
  );
});
