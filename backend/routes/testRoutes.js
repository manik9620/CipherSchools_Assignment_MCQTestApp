const express = require("express");
const { getAllTests,getTestDetails } = require("../controller/testController");

const testRouter = express.Router();

testRouter.get("/tests", getAllTests);

testRouter.get("/tests/:id", getTestDetails);

module.exports=testRouter;
