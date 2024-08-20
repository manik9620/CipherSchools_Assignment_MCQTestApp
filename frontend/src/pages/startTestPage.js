import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./startTestPage.css";
import Webcam from "react-webcam";

const StartTestPage = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(3); 
  const navigate = useNavigate();
  const { id } = useParams();

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
            clearInterval(timerId); // Clear interval when time is up
            navigate(`/test-environment/${id}`); // Redirect to the test environment page
          }
          return prevTime - 1; 
        });
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [permissionGranted, navigate, id]);

  return (
    <div className="start-test-container no-select">
      <h1>Start Test</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!permissionGranted && (
        <button className="start-test-button" onClick={requestPermissions}>
          Start Test
        </button>
      )}
      {permissionGranted && (
        <div className="video-container">
          <Webcam width={"400px"} />
          <p className="redirect-message">
            Permissions granted! Redirecting to the test environment in {timeLeft} seconds...
          </p>
        </div>
      )}
    </div>
  );
};

export default StartTestPage;
