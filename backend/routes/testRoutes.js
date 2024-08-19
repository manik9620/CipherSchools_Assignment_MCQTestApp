const express = require("express");
const {
  getAllTests,
  getTestDetails,
  submitTest,
} = require("../controller/testController");

const requireSignin= require("../middleware/authmiddleware");


const testRouter = express.Router();

testRouter.get("/tests", getAllTests);

testRouter.get("/tests/:id", requireSignin,getTestDetails);

testRouter.post("/submit", requireSignin,submitTest);

module.exports = testRouter;
