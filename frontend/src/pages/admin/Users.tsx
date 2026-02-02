import { useEffect, useState, useCallback, useMemo } from "react";
import { getAllUsers, deleteUser, updateUserByAdmin } from "../../api/user.api";
import type { User } from "../../types/user.types";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editData, setEditData] = useState<
    Partial<Pick<User, "fullName" | "mobile" | "role">>
  >({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Prevent selecting ADMIN users
  const handleSelect = useCallback(
    (id: number, checked: boolean) => {
      const user = users.find((u) => u.id === id);
      if (user?.role === "ADMIN") return;

      setSelectedUsers((prev) =>
        checked ? [...prev, id] : prev.filter((u) => u !== id)
      );
    },
    [users]
  );

  // Select all except ADMIN
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (!checked) {
        setSelectedUsers([]);
        return;
      }

      setSelectedUsers(users.filter((u) => u.role !== "ADMIN").map((u) => u.id));
    },
    [users]
  );

  // Delete only non-admin users
  const handleDeleteSelected = useCallback(async () => {
    if (!selectedUsers.length) return;

    const deletableIds = users
      .filter((u) => selectedUsers.includes(u.id) && u.role !== "ADMIN")
      .map((u) => u.id);

    if (!deletableIds.length) {
      alert("Admin users cannot be deleted.");
      return;
    }

    if (
      !confirm(`Are you sure you want to delete ${deletableIds.length} user(s)?`)
    )
      return;

    try {
      await Promise.all(deletableIds.map((id) => deleteUser(id)));
      setUsers((prev) => prev.filter((u) => !deletableIds.includes(u.id)));
      setSelectedUsers([]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete users.");
    }
  }, [selectedUsers, users]);

  const startEdit = useCallback((user: User) => {
    setEditingUser(user);
    setEditData({
      fullName: user.fullName,
      mobile: user.mobile,
      role: user.role,
    });
  }, []);

  const handleEditChange = useCallback(
    (field: keyof typeof editData, value: string) => {
      setEditData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const saveEdit = useCallback(async () => {
    if (!editingUser) return;

    try {
      await updateUserByAdmin(editingUser.id, editData);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id ? { ...u, ...editData } : u
        )
      );
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update user.");
    }
  }, [editingUser, editData]);

  const allSelected = useMemo(() => {
    const deletableUsers = users.filter((u) => u.role !== "ADMIN");
    return (
      deletableUsers.length > 0 &&
      selectedUsers.length === deletableUsers.length
    );
  }, [users, selectedUsers]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Users</h1>

      {selectedUsers.length > 0 && (
        <button
          className="mb-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          onClick={handleDeleteSelected}
        >
          Delete Selected ({selectedUsers.length})
        </button>
      )}

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-indigo-50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    disabled={u.role === "ADMIN"}
                    checked={selectedUsers.includes(u.id)}
                    onChange={(e) => handleSelect(u.id, e.target.checked)}
                    className="disabled:opacity-50"
                  />
                </td>

                <td className="p-3">{u.id}</td>

                <td className="p-3">
                  {editingUser?.id === u.id ? (
                    <input
                      value={editData.fullName ?? ""}
                      onChange={(e) =>
                        handleEditChange("fullName", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    u.fullName
                  )}
                </td>

                <td className="p-3">{u.email}</td>

                <td className="p-3">
                  {editingUser?.id === u.id ? (
                    <input
                      value={editData.mobile ?? ""}
                      onChange={(e) =>
                        handleEditChange("mobile", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    u.mobile
                  )}
                </td>

                <td className="p-3">
                  {editingUser?.id === u.id ? (
                    <select
                      value={editData.role ?? "USER"}
                      onChange={(e) =>
                        handleEditChange("role", e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded ${
                        u.role === "ADMIN"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  )}
                </td>

                <td className="p-3">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleString()
                    : "N/A"}
                </td>

                <td className="p-3">
                  {editingUser?.id === u.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="px-3 py-1 bg-gray-300 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        startEdit(u);
                      }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
