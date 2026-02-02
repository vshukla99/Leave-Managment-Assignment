import { NavLink } from "react-router-dom";
import { getAuth } from "../store/auth.store";

const linkClass =
  "block px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700";

export default function Sidebar() {
  const user = getAuth();

  if (!user) return null;

  return (
    <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-64px)] p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Dashboard
      </h2>

      <nav className="space-y-2">
        {/* USER MENU */}
        {user.role === "USER" && (
          <>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                isActive
                  ? `${linkClass} bg-indigo-600 text-white`
                  : linkClass
              }
            >
              My Leaves
            </NavLink>

            <NavLink
              to="/dashboard/request-leave"
              className={({ isActive }) =>
                isActive
                  ? `${linkClass} bg-indigo-600 text-white`
                  : linkClass
              }
            >
              Request Leave
            </NavLink>

            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                isActive
                  ? `${linkClass} bg-indigo-600 text-white`
                  : linkClass
              }
            >
              Profile
            </NavLink>
          </>
        )}

        {/* ADMIN MENU */}
        {user.role === "ADMIN" && (
          <>
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                isActive
                  ? `${linkClass} bg-indigo-600 text-white`
                  : linkClass
              }
            >
              Users
            </NavLink>

            <NavLink
              to="/dashboard/leaves"
              className={({ isActive }) =>
                isActive
                  ? `${linkClass} bg-indigo-600 text-white`
                  : linkClass
              }
            >
              All Leaves
            </NavLink>

            <NavLink
              to="/dashboard/add-credit"
              className={({ isActive }) =>
                isActive
                  ? `${linkClass} bg-indigo-600 text-white`
                  : linkClass
              }
            >
              Add Leave Credit
            </NavLink>

            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                isActive
                  ? `${linkClass} bg-indigo-600 text-white`
                  : linkClass
              }
            >
              Profile
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
