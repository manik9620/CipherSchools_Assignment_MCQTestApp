import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import HomePage from "./pages/homePage";
import LandingPage from "./pages/landingPage";
import StartTest from "./pages/startTestPage"; 
import TestEnvironmentPage from "./pages/testEnvironmentPage";
import ThankYouPage from "./pages/thankyouPage";
import { useSelector } from "react-redux";

const App = () => {
  const { isAuthorized } = useSelector((e) => e.auth);

  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuthorized ? <HomePage /> : <LandingPage />,
    },
    {
      path: "/login",
      element: isAuthorized ? <Navigate to="/" /> : <LoginPage />,
    },
    {
      path: "/signup",
      element: isAuthorized ? <Navigate to="/" /> : <SignupPage />,
    },
    {
      path: "/start-test/:testId", // Add this route for starting the test
      element: isAuthorized ? <StartTest /> : <Navigate to="/login" />,
    },
    {
      path: "/test-environment",
      element: isAuthorized ? <TestEnvironmentPage /> : <Navigate to="/login" />,
    },
    {
      path: "/thank-you", // Route for the Thank You page
      element: isAuthorized ? <ThankYouPage /> : <Navigate to="/login" />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
