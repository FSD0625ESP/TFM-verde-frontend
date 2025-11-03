import Login from "../components/Login/Login";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <>
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <Login />
        <Link to="/register">Register</Link>
      </div>
    </>
  );
}
