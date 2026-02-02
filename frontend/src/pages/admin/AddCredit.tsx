import { useState, useEffect } from "react";
import { addLeaveCredit } from "../../api/leave.api";
import { getAllUsers } from "../../api/user.api";
import type { User } from "../../types/user.types";


export default function AddCredit() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [hours, setHours] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await getAllUsers();
        setUsers(usersList);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !hours || !expiresAt) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // Convert YYYY-MM-DD to full ISO datetime
      const isoExpiresAt = new Date(expiresAt).toISOString();

      await addLeaveCredit({
        userId: selectedUserId,
        hoursGranted: Number(hours),
        expiresAt: isoExpiresAt,
      });

      alert("Leave credit added successfully!");
      setSelectedUserId("");
      setHours("");
      setExpiresAt("");
    } catch (err) {
      console.error(err);
      alert("Error adding leave credit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Leave Credit</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label className="block mb-1">Select User</label>
          {usersLoading ? (
            <p>Loading users...</p>
          ) : (
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="block w-full border p-2 rounded"
              required
            >
              <option value="">-- Select User --</option>
              {users
                .filter((user) => user.role === "USER")
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} ({user.email})
                  </option>
                ))}
            </select>
          )}
        </div>

        <div>
          <label className="block mb-1">Hours</label>
          <input
            type="number"
            value={hours}
            min={0}
            step={1}
            onChange={(e) => setHours(e.target.value)}
            className="block w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Expires At</label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="block w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Credit"}
        </button>
      </form>
    </div>
  );
}
