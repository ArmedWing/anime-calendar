import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/home");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <h1>Logout Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Logout;
