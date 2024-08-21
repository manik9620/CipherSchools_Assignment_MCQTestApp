import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./thankyouPage.css"

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(5);
  
  const getNextHour = () => {
    const currentDate = new Date();
    const nextHour = new Date(currentDate);
    nextHour.setHours(currentDate.getHours() + 1);
    nextHour.setMinutes(0, 0, 0);
    return nextHour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const nextHour = getNextHour(); 

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId); 
          navigate('/'); 
          return 0; 
        }
        return prevTime - 1; 
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [navigate]);

  return (
    <div className="thank-you-container">
      <h1>Thank You for Taking the Test!</h1>
      <p>Your responses have been recorded.</p>
      <p>You'll receive your marks on your email at {nextHour}.</p>
      <p>Redirecting you to the homepage in {timeLeft} seconds...</p>
    </div>
  );
};

export default ThankYouPage;
