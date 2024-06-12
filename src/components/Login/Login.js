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

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    navigate("/home");
    console.log("Logged in successfully");
  };

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/home");
        console.log("Logged in successfully");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <>
      <main>
        <section className="loginPage">
          <div className="loginContainer">
            <p> Login </p>
            <form className="inputbox">
              <div className="credentials">
                <label htmlFor="email-address">Email address</label>
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
                <label htmlFor="password">Password</label>
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
      </main>
    </>
  );
};

export default Login;
