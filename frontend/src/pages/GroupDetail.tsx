import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useState } from "react";
import AddExpense from "../components/AddExpense";

export default function GroupDetail() {
  const { id } = useParams();
  const [showAdd, setShowAdd] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["group-expenses", id],
    queryFn: async () => (await api.get(`/expenses/group/${id}`)).data
  });

  if (isLoading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 pb-24">
      <h1 className="font-bold text-lg mb-4">Group</h1>

      {(data || []).map((exp: any) => (
        <div key={exp.id} className="bg-white p-3 rounded shadow mb-2">
          <div className="font-medium">{exp.reason}</div>
          <div className="text-sm text-gray-500">
            status: {exp.status}
          </div>
        </div>
      ))}

      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-full shadow"
      >
        + Expense
      </button>

      {showAdd && (
        <AddExpense groupId={id!} onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}
