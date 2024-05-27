import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

const Header = () => {
  const [user] = useAuthState(auth);

  const signUserOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="navbar">
      <div className="links">
        <Link to="/home"> Home </Link>
        {!user ? (
          <div>
            <Link to="/register"> Register </Link>
            <Link to="/login"> Login </Link>
          </div>
        ) : (
          <Link to="/profile"> Profile </Link>
        )}
      </div>

      {user && (
        <div className="user">
          <p> {user?.displayName} </p>
          <img src={user?.photoURL || ""} width="50" height="50" />
          <button onClick={signUserOut}> Log Out </button>
        </div>
      )}
    </div>
  );
};

export default Header;
