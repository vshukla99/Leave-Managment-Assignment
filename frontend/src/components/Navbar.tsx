import { clearAuth, getAuth } from "../store/auth.store";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = getAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <span className="font-bold">Leave Management</span>
      <div className="flex gap-4">
        <button onClick={() => navigate("/dashboard/profile")}>Profile</button>
        <button onClick={logout} className="text-red-500">Logout</button>
      </div>
    </nav>
  );
}
