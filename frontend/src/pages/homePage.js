import React from "react";
import { useNavigate } from "react-router-dom";
import useGetTests from "../hooks/useGetTests"; 
import useLogout from "../hooks/useLogout"; 
import "./homePage.css"; 

const Homepage = () => {
  const { tests } = useGetTests();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleClick = (testId) => {
    navigate(`/start-test/${testId}`);
  };

  const handleLogout = () => {
    logout(); // Perform logout action
    navigate("/login"); // Redirect to login page
  };

  if (!tests) return <div>Loading...</div>;

  return (
    <div className="homepage-container no-select">
      <div className="homepage-heading">
        <h1>Available Tests</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <ul className="test-list">
        
        {tests.map((test) => (
          <li
            key={test._id}
            onClick={() => handleClick(test._id)}
            className="test-list-item"
          >
            <h2 className="test-title">{test.title}</h2>
            <p className="test-description">{test.descriptions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Homepage;
