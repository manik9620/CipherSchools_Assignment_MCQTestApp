import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './startTestPage.css'; // Import the CSS file

const StartTestPage = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(5); // Initialize timer with 5 seconds
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const requestPermissions = async () => {
    try {
      // Requesting camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setPermissionGranted(true);
      setErrorMessage("");

      // Attach the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Play the video
        videoRef.current.play().catch((error) => {
          setErrorMessage("Error playing video: " + error.message);
        });
      }

      // Start the countdown timer
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId); // Clear interval when time is up
            navigate("/test-environment"); // Redirect to the test environment page
          }
          return prevTime - 1; // Decrease the time left
        });
      }, 1000);
    } catch (error) {
      setErrorMessage(
        "Camera and microphone permissions are required to start the test."
      );
      console.error("Error requesting permissions:", error);
    }
  };

  // Cleanup function to stop video tracks when the component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="start-test-container">
      <h1>Start Test</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!permissionGranted && (
        <button
          className="start-test-button"
          onClick={requestPermissions}
        >
          Start Test
        </button>
      )}
      {permissionGranted && (
        <div className="video-container">

<video
          ref={videoRef}
          className="video-element"
          autoPlay
          playsInline
        ></video>

          <p className="redirect-message">Permissions granted! Redirecting to the test environment in {timeLeft} seconds...</p>
        </div>
      )}
    </div>
  );
};

export default StartTestPage;
