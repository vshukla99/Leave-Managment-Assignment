import { useEffect, useState } from "react";
import { getMyLeaves, getLeaveBalance } from "../../api/leave.api";
import type { Leave, LeaveBalance} from "../../types/leave.types";

export default function MyLeaves() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leavesData, balanceData] = await Promise.all([
          getMyLeaves(),
          getLeaveBalance(),
        ]);

        setLeaves(leavesData);
        setBalance(balanceData);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to fetch leave data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  const calculateDays = (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = toDate.getTime() - fromDate.getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1, 1);
  };

  const statusColorMap: Record<Leave["status"], string> = {
    APPROVED: "text-green-600",
    PENDING: "text-yellow-600",
    REJECTED: "text-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">My Leaves</h2>

      {/* ===== Leave Balance Summary ===== */}
      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Total Credits (Hours)</p>
            <p className="text-2xl font-bold text-blue-700">
              {balance.totalGranted}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Used Leaves (Hours)</p>
            <p className="text-2xl font-bold text-red-600">
              {balance.totalUsed}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Remaining Leaves (Hours)</p>
            <p className="text-2xl font-bold text-green-700">
              {balance.totalRemaining}
            </p>
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">From</th>
              <th className="border p-2">To</th>
              <th className="border p-2">Days</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No leaves found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id} className="text-center">
                  <td className="border p-2">
                    {formatDate(leave.fromDate)}
                  </td>
                  <td className="border p-2">
                    {formatDate(leave.toDate)}
                  </td>
                  <td className="border p-2">
                    {calculateDays(leave.fromDate, leave.toDate)}
                  </td>
                  <td
                    className={`border p-2 font-semibold ${statusColorMap[leave.status]}`}
                  >
                    {leave.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
