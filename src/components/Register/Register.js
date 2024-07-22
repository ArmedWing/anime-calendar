import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      navigate("/home");
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Email is already in use");
          break;
        case "auth/invalid-email":
          setError("Invalid email format");
          break;
        case "auth/operation-not-allowed":
          setError("Operation not allowed");
          break;
        case "auth/weak-password":
          setError("Password is too weak");
          break;
        default:
          setError("An unexpected error occurred. Please try again later.");
          break;
      }
    }
  };

  return (
    <div className="registerContainer">
      <h1> Register </h1>
      <form className="inputbox" onSubmit={onSubmit}>
        <div className="credentials">
          <label htmlFor="email-address"></label>
          <input
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
          />
        </div>

        <div>
          <label htmlFor="password"></label>
          <input
            type="password"
            label="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </div>

        <button type="submit" className="registerBtn">
          Sign up
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Already have an account?{" "}
        <NavLink to="/login" className="login">
          Login
        </NavLink>
      </p>
    </div>
  );
};

export default Register;
