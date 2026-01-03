import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import CreateGroup from "../components/CreateGroup";
import Header from "../components/Header";

export default function Groups() {
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => (await api.get("/groups")).data
  });

  if (isLoading) return <p className="p-4">Loading...</p>;

  return (
    <div>
      <Header />
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">My Groups</h1>

      {data?.map((m: any) => (
        <div
          key={m.id}
          className="bg-white p-3 rounded shadow mb-2 flex justify-between"
        >
          <span>{m.group.name}</span>
          <a
            className="text-blue-600 text-sm"
            href={`/groups/${m.groupId}`}
          >
            Open
          </a>
        </div>
            
      ))}

      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-5 py-3 rounded-full shadow"
      >
        +
      </button>

      {showCreate && <CreateGroup onClose={() => setShowCreate(false)} />}
    </div>
    </div>
  );
}
