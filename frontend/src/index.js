import React from "react";
import ReactDom from "react-dom/client";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import App from "./App";
// import "./src/globalStyles.css";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Index = () => {
  <ToastContainer
    position="bottom-right"
    autoClose={4000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />;
  
  return (
    <Provider store={appStore}>
      <App />
      <ToastContainer />
    </Provider>
  );
};

const parent = document.getElementById("root");
const root = ReactDom.createRoot(parent);
root.render(Index());