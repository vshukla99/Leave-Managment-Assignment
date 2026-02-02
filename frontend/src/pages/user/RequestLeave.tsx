import { useState, useMemo, useCallback, useEffect } from "react";
import { AxiosError } from "axios";
import { requestLeave } from "../../api/leave.api";

const HOURS_PER_DAY = 8;
const MESSAGE_TIMEOUT = 5000; // 5 seconds

export default function RequestLeave() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Calculate total leave hours
  const hoursRequested = useMemo<number>(() => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diff =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff * HOURS_PER_DAY : 0;
  }, [fromDate, toDate]);

  // Auto-hide messages after a few seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, MESSAGE_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Handle form submission
  const handleSubmit = useCallback(async (): Promise<void> => {
    setError("");
    setSuccess("");

    if (!fromDate || !toDate) {
      setError("From date and To date are required");
      return;
    }

    try {
      setLoading(true);

      const res = await requestLeave({
        fromDate: new Date(fromDate).toISOString(),
        toDate: new Date(toDate).toISOString(),
        hoursRequested,
        reason,
      });

      setSuccess(res.message);
      setFromDate("");
      setToDate("");
      setReason("");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data?.message ?? "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, reason, hoursRequested]);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Request Leave
      </h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 transition-opacity duration-500" role="alert">
          <strong className="font-semibold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 transition-opacity duration-500" role="alert">
          <strong className="font-semibold">Success: </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-600">From Date</label>
          <input
            type="date"
            className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">To Date</label>
          <input
            type="date"
            className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600">Reason *</label>
        <textarea
          rows={3}
          className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      {hoursRequested > 0 && (
        <div className="mb-4 flex items-center space-x-2">
          <span className="text-sm text-gray-600">Total Leave Hours:</span>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
            {hoursRequested}
          </span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </div>
  );
}
