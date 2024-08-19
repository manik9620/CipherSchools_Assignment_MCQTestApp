// import { useNavigate } from "react-router-dom";  
import { useDispatch } from "react-redux";
import { appLogin } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const useLogin = () => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`https://mcqtestapp.onrender.com/api/v1/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);
      if (data.status === "success") {
        dispatch(appLogin(data));
        toast.success("Login Successfully");
      } else {
        toast.error(data.message);
        
      }
    } catch (err) {
      toast.error(err.message)
    }
  };
  return { login };
};

export default useLogin;