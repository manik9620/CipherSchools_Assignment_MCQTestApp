import React from "react";
import { useNavigate } from "react-router-dom";
import useGetTests from "../hooks/useGetTests"; // Adjust the path as necessary
import useLogout from "../hooks/useLogout"; // Assuming you have a custom hook for logging out
import "./homePage.css"; // Import the CSS file

const Homepage = () => {
  const { tests, loading, error } = useGetTests();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleDoubleClick = (testId) => {
    navigate(`/start-test/${testId}`);
  };

  const handleLogout = () => {
    logout(); // Perform logout action
    navigate("/login"); // Redirect to login page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
            onDoubleClick={() => handleDoubleClick(test._id)}
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
