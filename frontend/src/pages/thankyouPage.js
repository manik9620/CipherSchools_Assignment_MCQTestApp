import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./thankyouPage.css"

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(5); // Initialize timer with 20 seconds

  useEffect(() => {
    // Set up a timer that updates every second
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId); // Clear interval when time is up
          navigate('/'); // Redirect to home page
        }
        return prevTime - 1; // Decrease the time left
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timerId);
  }, [navigate]);

  return (
    <div className="thank-you-container">
      <h1>Thank You for Taking the Test!</h1>
      <p>Your responses have been recorded.</p>
      <p>Redirecting you to the homepage in {timeLeft} seconds...</p>
    </div>
  );
};

export default ThankYouPage;
