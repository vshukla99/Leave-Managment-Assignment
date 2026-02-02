import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      className="h-screen bg-cover flex items-center justify-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4">
          Leave Management Application
        </h1>
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </div>
    </div>
  );
}
