import { useEffect, useState } from "react";
import { getAllLeaves, updateLeaveStatus } from "../../api/leave.api";
import { getAllUsers } from "../../api/user.api";
import type { Leave } from "../../types/leave.types";
import type { User } from "../../types/user.types";

export default function AllLeaves() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leavesData, usersData] = await Promise.all([
          getAllLeaves(),
          getAllUsers(),
        ]);
        setLeaves(leavesData);
        setUsers(usersData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch leaves or users");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper: get user full name by userId
  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.fullName : "Unknown User";
  };

  // Handle status change (always allowed now)
const handleStatusChange = async (
  leaveId: number,
  status: "PENDING" | "APPROVED" | "REJECTED"
) => {
  if (status === "PENDING") return; 

  try {
    setUpdatingId(leaveId);
    await updateLeaveStatus(leaveId, status); 
    setLeaves((prev) =>
      prev.map((leave) =>
        leave.id === leaveId ? { ...leave, status } : leave
      )
    );
  } catch (err) {
    console.error(err);
    alert("Failed to update leave status");
  } finally {
    setUpdatingId(null);
  }
};

  if (loading) return <p>Loading leaves...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (leaves.length === 0) return <p>No leaves found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Leaves</h1>

      <table className="w-full border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Hours</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">From Date</th>
            <th className="p-2 border">To Date</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id} className="hover:bg-gray-50">
              <td className="p-2 border">{leave.id}</td>
              <td className="p-2 border">{getUserName(leave.userId)}</td>
              <td className="p-2 border">{leave.hoursRequested}</td>

              {/* STATUS COLUMN - always editable */}
              <td className="p-2 border">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  disabled={updatingId === leave.id}
                  value={leave.status}
                  onChange={(e) =>
                    handleStatusChange(
                      leave.id,
                      e.target.value as "PENDING" | "APPROVED" | "REJECTED"
                    )
                  }
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </td>

              <td className="p-2 border">
                {new Date(leave.fromDate).toLocaleDateString()}
              </td>
              <td className="p-2 border">
                {new Date(leave.toDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
