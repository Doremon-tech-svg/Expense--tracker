import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await api.get("/dashboard")).data,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Not authorized — login again.</p>;

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-xl font-bold">My Dashboard</h1>

      <div className="p-3 border rounded">
        <p>Total Paid: ₹{(data.totalPaid / 100).toFixed(2)}</p>
        <p>Total Owed: ₹{(data.totalOwed / 100).toFixed(2)}</p>
        <p className="font-semibold">
          Net: ₹{(data.net / 100).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
