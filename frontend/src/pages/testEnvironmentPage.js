import React, { useState, useEffect, useRef } from "react";
import useGetTestDetails from "../hooks/useGetTestDetails";
import { useNavigate } from "react-router-dom";
import "./testEnvironmentPage.css";

const TestEnvironmentPage = () => {
  const id = '66c0ed45119ccc16846ecf53'; // Static ID for testing
  const testDetails = useGetTestDetails(id);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const [timeLeft, setTimeLeft] = useState(3600); // Set initial time left in seconds (1 hour)
  const videoRef = useRef(null); // Ref for the video element
  const navigate = useNavigate();

  // Function to handle the timer
  useEffect(() => {
    if (timeLeft <= 0) {
      // Handle the case when time runs out (e.g., submit the test automatically)
      alert('Time is up!');
      handleSubmitTest(); // Submit the test when time is up
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    // Start the video stream when the component mounts
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    return () => {
      // Cleanup the video stream when the component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleOptionChange = (questionId, selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleResetAnswer = (questionId) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: "", // Reset the selected answer for the current question
    }));
  };

  const handleNavigationClick = (index) => {
    setCurrentQuestionIndex(index); // Navigate to the selected question
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
    // Stop video stream before navigating away
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }

    navigate("/thank-you"); // Redirect to the thank-you page
  };

  if (!testDetails) return <p>Loading...</p>;

  const currentQuestion = testDetails.questions[currentQuestionIndex]; // Current question being displayed

  // Convert seconds to HH:MM:SS format
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="test-environment-container">
      <div className="test-content">
        <div className="question-section">
          <h1>{testDetails.title}</h1>
          <p>{testDetails.descriptions}</p>
          <div key={currentQuestion._id} className="question-container">
            <h3>{`Q${currentQuestionIndex + 1}. ${currentQuestion.question}`}</h3> {/* Numbering added */}
            {currentQuestion.options.map((option, optionIndex) => (
              <div key={optionIndex} className="option-container">
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={option}
                  checked={selectedAnswers[currentQuestion._id] === option}
                  onChange={() => handleOptionChange(currentQuestion._id, option)}
                />
                <label>{option}</label>
              </div>
            ))}
            <div className="navigation-buttons">
            <button
              className="reset-button"
              onClick={() => handleResetAnswer(currentQuestion._id)}
            >
              Reset Answer
            </button>
            
              <button
                className="navigation-button"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button
                className="navigation-button"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === testDetails.questions.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="summary-section">
          <div className="timer">
            <div className="timer-value">
              {formatTime(timeLeft)}
            </div>
          </div>

          <video
            ref={videoRef}
            className="video-element"
            autoPlay
            playsInline
          ></video>
          
          <div className="summary">
            <div className="navigation-grid">
              {testDetails.questions.map((_, index) => (
                <div
                  key={index}
                  className={`summary-item ${getSummaryClass(index, selectedAnswers, testDetails.questions)}`}
                  onClick={() => handleNavigationClick(index)}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
          <button className="submit-button" onClick={handleSubmitTest}>
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine the class for summary items
const getSummaryClass = (index, selectedAnswers, questions) => {
  const questionId = questions[index]._id;
  if (selectedAnswers[questionId]) {
    return 'answered'; // Green if answered
  }
  return 'not-answered'; // Red if not answered
};

export default TestEnvironmentPage;
