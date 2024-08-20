const TestModel = require("../model/testmodel");
const QuestionModel = require("../model/questionmodel");
const SubmissionModel = require("../model/submissionmodel");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

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
    const test = await TestModel.findById(id).populate("questions");
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

const submitTest = async (req, res) => {
  try {
    const { testId, selections } = req.body;
    const userId = req.user._id;

    const submission = new SubmissionModel({
      testId,
      userId,
      selections,
      endedAt: new Date(),
    });
    console.log("----->>>>>", submission);

    await submission.save();
    res.status(201).send({
      success: true,
      message: "Test submitted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in submit test api",
      error: error,
    });
  }
};

cron.schedule("8 * * * *", async () => {
  try {
    const submissions = await SubmissionModel.find({ isDeleted: false })
      .populate("userId")
      .populate({
        path: "testId",
        populate: {
          path: "questions",
          model: "questions",
        },
      });

    for (const submission of submissions) {
      const email = submission.userId.email;
      const total_score = submission.testId.questions.length;
      let score = 0;

      for (const selection of submission.selections) {
        const question = await QuestionModel.findById(selection.questionId);

        if (selection.option === question.correctOption) {
          score += question.marks;
        }
      }

      await sendmail(email, total_score, score, submission.testId.title);

      submission.isDeleted = true;
      await submission.save();
    }
  } catch (error) {
    console.error("Error evaluating the test. Error: ", error);
  }
});

const sendmail = async (email, total_score, score, testTitle) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your Test Score",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #e9ecef;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid #ddd;
              }
              h1 {
                color: #0056b3;
                font-size: 26px;
                margin-bottom: 20px;
              }
              p {
                font-size: 16px;
                margin: 0 0 15px;
              }
              .score {
                font-size: 18px;
                font-weight: bold;
                color: #28a745;
                margin-top: 10px;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
              }
              .footer {
                font-size: 14px;
                color: #6c757d;
                margin-top: 30px;
                text-align: center;
              }
              .footer a {
                color: #007bff;
                text-decoration: none;
              }
              .footer a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Your Test Score</h1>
              <p>Hello <strong>${email}</strong>,</p>
              <p>The results for your test <strong>${testTitle}</strong> are ready.</p>
              <p class="score">You scored <strong>${score}</strong> points out of <strong>${total_score}</strong>.</p>
              <p>Thank you for participating! We appreciate your effort.</p>
              <div class="footer">
                <p>If you have any questions, feel free to <a href="mailto:support@example.com">contact us</a>.</p>
                <p>Best regards,<br>Your Test Team</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
    
    

    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { getAllTests, getTestDetails, submitTest };
