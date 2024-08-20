import { toast } from "react-toastify";

const useSubmitTest = () => {
  const submitTest = async (testId, selections) => {
    try {
      const response = await fetch("http://localhost:1400/api/v1/test/submit", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
          Authorization: JSON.parse(localStorage.getItem("userInfo"))["token"]
        },
        body: JSON.stringify({ testId, selections }), 
      });

      if (!response.ok) {
        throw new Error("Error submitting test"); 
      }

      const data = await response.json(); 
      toast.success("Test Submitted Successfully");
      return data; 
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Error submitting test:", err);
    }
  };

  return { submitTest };
};

export default useSubmitTest;
