import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import defaultImage from "../../images/default.png";
import { useState } from "react";

const Navigation = {
  marginRight: "10px",
  textDecoration: "none",
  fontSize: "30px",
  fontWeight: "bold",
  color: "white",
};

const Header = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const signUserOut = async () => {
    await signOut(auth);
    navigate("/home");
  };

  const toggleLogout = () => {
    setShowLogout((prev) => !prev);
  };

  return (
    <div className="navbar">
      <div className="links">
        <Link to="/home" style={Navigation}>
          Home
        </Link>
        <Link to="/search" style={Navigation}>
          {" "}
          Search{" "}
        </Link>
        {!user ? (
          <div>
            <Link to="/signup" style={Navigation}>
              {" "}
              Register{" "}
            </Link>
            <Link to="/login" style={Navigation}>
              {" "}
              Login{" "}
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/profile" style={Navigation}>
              {" "}
              Profile{" "}
            </Link>
            <Link to="/completed" style={Navigation}>
              {" "}
              Completed{" "}
            </Link>
            <Link to="/forum" style={Navigation}>
              {" "}
              Forum{" "}
            </Link>
          </div>
        )}
      </div>

      {user && (
        <div className="user">
          <div className="profile-name-img" onClick={toggleLogout}>
            <img
              src={user?.photoURL || defaultImage}
              alt="Profile"
              className="profileImg"
              style={{ cursor: "pointer" }}
            />
          </div>
          {showLogout && (
            <div>
              <p>{user?.displayName}</p>
              <button onClick={signUserOut} className="logoutBtn">
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
