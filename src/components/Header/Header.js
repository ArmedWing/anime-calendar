import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import defaultImage from "../../images/default.png";

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

  const signUserOut = async () => {
    await signOut(auth);
    navigate("/home");
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
          <p> {user?.displayName} </p>
          <img
            src={user?.photoURL || defaultImage}
            alt="Profile"
            className="profileImg"
          />
          <button onClick={signUserOut}> Log Out </button>
        </div>
      )}
    </div>
  );
};

export default Header;
