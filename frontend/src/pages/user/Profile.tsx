import { useEffect, useState } from "react";
import { getUserById } from "../../api/user.api";
import { getAuth } from "../../store/auth.store";
import type { User } from "../../types/user.types";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const auth = getAuth();
        if (!auth?.id) throw new Error("User not logged in");

        const userData = await getUserById(auth.id);
        setUser(userData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="max-w-lg rounded-2xl bg-white shadow-lg p-6 animate-pulse">
        <div className="h-20 bg-linear-to-r from-indigo-500 to-purple-500 rounded-xl mb-6" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  /*  Error State */
  if (error) {
    return (
      <div className="max-w-lg rounded-2xl bg-red-50 border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Profile Error</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-lg rounded-2xl bg-white shadow-lg overflow-hidden hover:shadow-xl transition">
      {/*  Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white text-indigo-600 flex items-center justify-center text-xl font-bold shadow">
          {user.fullName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-white text-xl font-semibold">
            {user.fullName}
          </h2>
          <p className="text-indigo-100 text-sm">{user.role}</p>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-4">
        <ProfileItem label="Email" value={user.email} />
        {user.mobile && <ProfileItem label="Mobile" value={user.mobile} />}

        <div className="pt-4">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
            YOUR ROLE IS : {user.role}
          </span>
        </div>
      </div>
    </div>
  );
}


function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}
