const TestModel = require("../model/testmodel");
const QuestionModel = require("../model/questionmodel");

const getAllTests = async (req, res) => {
  try {
    const tests = await TestModel.find().populate("questions").exec();
    res.status(200).json({
      success: true,
      data: tests,
    });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTestDetails = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the test by ID and populate the questions field
    const test = await TestModel.findById(id).populate("questions").exec();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    console.error("Error fetching test details:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAllTests, getTestDetails };
