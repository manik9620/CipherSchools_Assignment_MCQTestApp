import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useSignup = () => {
  const navigate = useNavigate();
  const signup = async ({ name, email, password }) => {
    try {
      const res = await fetch(`http://localhost:1400/api/v1/auth/signup`, {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);
      if (data.status === "success") {
        toast.success("Successfully Registered");
        navigate(`/login?email=${email}`);
      } else {
        
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message);
    }
  };
  return { signup };
};

export default useSignup;
