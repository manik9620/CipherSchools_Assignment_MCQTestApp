import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./startTestPage.css";
import useGetTestDetails from "../hooks/useGetTestDetails";
import Webcam from "react-webcam";

const StartTestPage = () => {
  const { id } = useParams();
  const testDetails = useGetTestDetails(id);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(3);
  const navigate = useNavigate();

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setPermissionGranted(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        "Camera and microphone permissions are required to start the test."
      );
      console.error("Error requesting permissions:", error);
    }
  };

  useEffect(() => {
    if (permissionGranted) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            navigate(`/test-environment/${id}`);
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [permissionGranted, navigate, id]);

  // Log testDetails to check its structure
  console.log(testDetails);

  return (
    <div className="start-test-container no-select">
      {testDetails ? (
        <>
          <h1>Test Name: {testDetails.title}</h1>
          <hr/>
          <p className="test-description">
            This is a sample test designed to assess your knowledge on various
            topics. Please read each question carefully and select the best answer.
          </p>
          <p className="test-instructions">
            <strong>Instructions:</strong>
            <ul>
              <li>Each correct answer will earn you one mark.</li>
              <li>There is no negative marking for incorrect answers.</li>
              <li>
                You have a limited amount of time to complete the test, so pace
                yourself accordingly.
              </li>
            </ul>
          </p>
        </>
      ) : (
        <p>Loading test details...</p>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!permissionGranted && (
        <button className="start-test-button" onClick={requestPermissions}>
          Start Test
        </button>
      )}
      {permissionGranted && (
        <div className="video-container">
          <Webcam  className="webcam" width={"400px"} />
          <p className="redirect-message">
            Permissions granted! Redirecting to the test environment in{" "}
            {timeLeft} seconds...
          </p>
        </div>
      )}
    </div>
  );
};

export default StartTestPage;
