// hooks/useLogout.js
import { useDispatch } from 'react-redux';
import { appLogout } from '../store/slices/authSlice'; // Adjust path as necessary
import { toast } from 'react-toastify';

const useLogout = () => {
  const dispatch = useDispatch();

  const logout = () => {
    // Perform logout actions, such as clearing tokens or user data
    localStorage.removeItem('authToken'); // Example: removing token from localStorage
    dispatch(appLogout()); // Dispatch a logout action to update Redux state if you're using Redux
    toast.success("Logged Out")
  };

  return { logout };
};

export default useLogout;
