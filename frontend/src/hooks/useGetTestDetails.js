// src/hooks/useGetTestDetails.js
import { useState, useEffect } from "react";

const useGetTestDetails = (id) => {
  const [testDetails, setTestDetails] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(`https://mcqtestapp.onrender.com/api/v1/test/tests/${id}`,{
          headers:{
            Authorization: JSON.parse(localStorage.getItem("userInfo"))["token"]
          }
        });
        const data = await response.json();

        // console.log("data-------->>>>>>>>>",data)


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
  }, [id]);

  return testDetails;
};

export default useGetTestDetails;
