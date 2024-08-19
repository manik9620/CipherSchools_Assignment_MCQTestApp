import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import HomePage from "./pages/homePage";
import StartTest from "./pages/startTestPage"; 
import TestEnvironmentPage from "./pages/testEnvironmentPage";
import ThankYouPage from "./pages/thankyouPage";
import { useSelector } from "react-redux";
import "./App.css"

const App = () => {
  const { isAuthorized } = useSelector((e) => e.auth);

  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuthorized ? <HomePage /> : <LoginPage />,
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
      path: "/start-test/:id", 
      element: isAuthorized ? <StartTest /> : <Navigate to="/login" />,
    },
    {
      path: "/test-environment/:id",
      element: isAuthorized ? <TestEnvironmentPage /> : <Navigate to="/login" />,
    },
    {
      path: "/thank-you", 
      element: isAuthorized ? <ThankYouPage /> : <Navigate to="/login" />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
