import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import SignUp from "../../compoenents/SignUp";
import UserList from "../../compoenents/UserList";

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate()

  // Function to handle navigation
  const handleNavigate = () => {
    navigate("/login"); // Replace with your target route
  };

  const handleLogout = () => {
    dispatch(logout())
  }


  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.name}!</h2>
          <button onClick={() => dispatch(logout())}>Logout</button>
        </>
      ) : (
        <>
        <h2>Please log in.</h2>
        
        <button type="button" onClick={handleNavigate}>Login</button>
        <h2>Sign Up</h2>
        <SignUp/>
        <UserList/>
        </>
      )}
    </div>
  );
};

export default Home;
