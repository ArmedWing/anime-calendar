import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <Link to="/home" className="backBtn">
        Back to Home
      </Link>
    </div>
  );
}
