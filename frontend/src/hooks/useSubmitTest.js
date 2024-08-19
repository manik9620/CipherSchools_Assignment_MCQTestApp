import { toast } from "react-toastify";

const useSubmitTest = () => {
  const submitTest = async (testId, selections) => {
    try {
      const response = await fetch("http://localhost:1400/api/v1/test/submit", {
        method: "POST", // Specify the HTTP method
        headers: {
          "Content-Type": "application/json", // Specify the content type
          Authorization: JSON.parse(localStorage.getItem("userInfo"))["token"]
        },
        body: JSON.stringify({ testId, selections }), // Convert the body to JSON
      });

      if (!response.ok) {
        throw new Error("Error submitting test"); // Throw an error if response is not ok
      }

      const data = await response.json(); // Parse the JSON response
      toast.success("Test Submitted Successfully");
      return data; // Optionally return the response data
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Error submitting test:", err); // Log the error for debugging
    }
  };

  return { submitTest };
};

export default useSubmitTest;
