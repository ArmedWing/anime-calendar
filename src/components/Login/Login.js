import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { NavLink, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const Login = () => {
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      setError("Failed to sign in with Google");
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const onLogin = async (e) => {
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      navigate("/home");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <section className="loginPage">
        <div className="loginContainer">
          <h1> Login </h1>
          <form className="inputbox">
            <div className="credentials">
              <label htmlFor="email-address"></label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="credentials">
              <label htmlFor="password"></label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button onClick={onLogin} className="loginBtn">
              Log in
            </button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="otherOptions">
            <h2 className="googleLogin">Or login with</h2>
            <div className="imgContainer">
              <img
                src={require("../../images/google-logo.png")}
                alt="Google"
                onClick={signInWithGoogle}
              ></img>
            </div>
            <NavLink to="/signup" className="register">
              Register
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
