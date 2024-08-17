// src/hooks/useGetTestDetails.js
import { useState, useEffect } from "react";

const useGetTestDetails = (testId) => {
  const [testDetails, setTestDetails] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(`http://localhost:1400/api/v1/test/tests/${testId}`);
        const data = await response.json();


        if (data.success) {
          setTestDetails(data.data);
        } else {
          console.error("Failed to fetch test details:", data.message);
        }
      } catch (err) {
        console.error("Error fetching test details:", err.message);
      }
    };

    fetchTestDetails();
  }, [testId]);

  return testDetails;
};

export default useGetTestDetails;
