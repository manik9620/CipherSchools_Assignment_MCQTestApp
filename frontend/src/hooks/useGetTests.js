import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useGetTests = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch("http://localhost:1400/api/v1/test/tests",{
          headers:{
            Authorization: JSON.parse(localStorage.getItem("userInfo"))["token"]
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }
        const data = await response.json();
        setTests(data.data); 
      } catch (error) {
        toast.error(error.message);
      } finally {
        toast.error(false);
      }
    };

    fetchTests();
  }, []);

  return { tests };
};

export default useGetTests;
