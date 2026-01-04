import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/dashboard", {
        withCredentials: true,
      });
      return res.data;
    }
  });

  if (isLoading) return <p>Loading...</p>;

  if (error) return (
    <div className="p-4">
      <p className="text-red-600 font-semibold">
        You must log in to view dashboard
      </p>
    </div>
  );

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-bold">My Dashboard</h1>

      <div className="p-4 border rounded bg-white shadow">
        <p>Total Paid: ₹{(data.totalPaid / 100).toFixed(2)}</p>
        <p>Total Owed: ₹{(data.totalOwed / 100).toFixed(2)}</p>

        <p className="font-semibold mt-2">
          Net: ₹{(data.net / 100).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
