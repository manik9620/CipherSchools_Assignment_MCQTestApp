import React, { useState, useEffect } from "react";
import useGetTestDetails from "../hooks/useGetTestDetails";
import { useNavigate, useParams } from "react-router-dom";
import useSubmitTest from "../hooks/useSubmitTest";
import "./testEnvironmentPage.css";
import Webcam from "react-webcam";

const TestEnvironmentPage = () => {
  const { id } = useParams();
  const testDetails = useGetTestDetails(id);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [reviewMarkedQuestions, setReviewMarkedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const navigate = useNavigate();
  const { submitTest } = useSubmitTest();

  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Time is up!");
      handleSubmitTest();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleOptionChange = (questionId, selectedOption) => {
    setSelectedAnswers((prevAnswers) => {
      const currentTime = new Date();
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer) => answer.questionId === questionId
      );

      if (existingAnswerIndex > -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = {
          questionId,
          option: selectedOption,
          savedAt: currentTime,
        };

        // If the question is marked for review and now answered, unmark it
        setReviewMarkedQuestions((prevMarked) =>
          prevMarked.filter((id) => id !== questionId)
        );

        return updatedAnswers;
      }

      // If the question was marked for review and is now answered, unmark it
      setReviewMarkedQuestions((prevMarked) =>
        prevMarked.filter((id) => id !== questionId)
      );

      return [
        ...prevAnswers,
        { questionId, option: selectedOption, savedAt: currentTime },
      ];
    });
  };

  const handleMarkForReview = (questionId) => {
    setReviewMarkedQuestions((prevMarked) => {
      if (prevMarked.includes(questionId)) {
        return prevMarked.filter((id) => id !== questionId); // Unmark if already marked
      }
      return [...prevMarked, questionId]; // Mark for review
    });
  };
  

  const handleResetAnswer = (questionId) => {
    setSelectedAnswers((prevAnswers) =>
      prevAnswers.filter((answer) => answer.questionId !== questionId)
    );
  };

  const handleNavigationClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < testDetails.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    const testId = id;
    const selections = selectedAnswers;

    submitTest(testId, selections).then(() => {
      navigate("/thank-you");
    });
  };

  if (
    !testDetails ||
    !testDetails.questions ||
    testDetails.questions.length === 0
  ) {
    return <p>Loading...</p>;
  }

  const currentQuestion = testDetails.questions[currentQuestionIndex];

  const formatTimeh = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    return `${h}  `;
  };

  const formatTimem = (seconds) => {
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    return `${m}  `;
  };
  const formatTimes = (seconds) => {
    const s = String(seconds % 60).padStart(2, "0");
    return `${s}`;
  };

  return (
    <div className="test-environment-container no-select">
      <div className="test-content">
        <div className="question-section">
          <div className="test-heading">
            <h1>
              {testDetails.title} <span>- {testDetails.descriptions}</span>
            </h1>
          </div>

          <div key={currentQuestion._id} className="question-container">
            <h3>{`Question ${currentQuestionIndex + 1}. `}</h3>
            <hr />
            <p>{currentQuestion.question}</p>
            {currentQuestion.options.map((option, optionIndex) => (
              <div key={optionIndex} className="option-container">
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={option}
                  checked={selectedAnswers.find(
                    (answer) =>
                      answer.questionId === currentQuestion._id &&
                      answer.option === option
                  )}
                  onChange={() =>
                    handleOptionChange(currentQuestion._id, option)
                  }
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
          <div className="navigation-buttons">
            <button
              className="mark-review-button"
              onClick={() => handleMarkForReview(currentQuestion._id)}
            >
              {reviewMarkedQuestions.includes(currentQuestion._id)
                ? "Unmark Review"
                : "Mark for Review"}
            </button>
            <button
              className="reset-button"
              onClick={() => handleResetAnswer(currentQuestion._id)}
            >
              Reset Answer
            </button>

            <div className="prev-next-div">
            <button
              className="navigation-button navigation-button-prev"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              className="navigation-button navigation-button-next"
              onClick={handleNextQuestion}
              disabled={
                currentQuestionIndex === testDetails.questions.length - 1
              }
            >
              Next
            </button>
            </div>

            <button className="submit-button" onClick={handleSubmitTest}>
              Submit Test
            </button>
          </div>
          <div className="navigation-colors">
            <p> <button className="Current"/><span>Current</span></p>
            <p><button className="Answered"/><span>Answered</span></p>
            <p><button className="Not-Attempted"/><span>Not Attempted</span></p>
            <p><button className="Mark-For-Review"/><span>Mark For Review</span></p>
            <p><button className="Answered-and-Mark-For-Review"/><span>Answered and Mark For Review</span></p>
          </div>
        </div>
        <div className="summary-section">
          <div className="timer">
            <h1>Time Left</h1>
            <div className="timer-value">
              <div className="time">
                <p>{formatTimeh(timeLeft)}</p>
                <p>hours</p>
              </div>
              <div className="time">
                <p>{formatTimem(timeLeft)}</p>
                <p>minutes</p>
              </div>

              <div className="time">
                <p>{formatTimes(timeLeft)}</p>
                <p>seconds</p>
              </div>
            </div>
          </div>

          <div className="summary">
            <h1>Questions</h1>
            <div className="navigation-grid">
              {testDetails.questions.map((_, index) => (
                <div
                  key={index}
                  className={`summary-item ${getSummaryClass(
                    index,
                    selectedAnswers,
                    reviewMarkedQuestions,
                    testDetails.questions,
                    currentQuestionIndex
                  )}`}
                  onClick={() => handleNavigationClick(index)}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="camera-view">
            <Webcam className="camera" width={"400px"} />
          </div>
        </div>
      </div>
    </div>
  );
};

const getSummaryClass = (
  index,
  selectedAnswers,
  reviewMarkedQuestions,
  questions,
  currentQuestionIndex
) => {
  const questionId = questions[index]._id;
  const isAnswered = selectedAnswers.find(
    (answer) => answer.questionId === questionId
  );
  const isMarkedForReview = reviewMarkedQuestions.includes(questionId);
  const isActive = index === currentQuestionIndex;

  if (isMarkedForReview) {
    return isAnswered ? "answered-marked-for-review" : "marked-for-review";
  }

  if (isAnswered) {
    return "answered";
  }

  if (isActive) {
    return "active-question"; // Highlight the active question in blue
  }

  return "not-answered";
};

export default TestEnvironmentPage;
