const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tests',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    selections: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questions',
        required: true,
      },
      option: {
        type: String,
        required: true,
      },
      savedAt: {
        type: Date,
        required: true,
      },
    }],
    endedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);
  
const SubmissionModel = mongoose.model("submissions", SubmissionSchema);

module.exports = SubmissionModel;