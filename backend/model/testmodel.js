const mongoose = require("mongoose");

const testschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    descriptions: {
      type: String,
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const TestModel = mongoose.model("tests", testschema);

module.exports = TestModel;
