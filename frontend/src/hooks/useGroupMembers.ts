import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function useGroupMembers(groupId: string) {
  return useQuery({
    queryKey: ["members", groupId],
    queryFn: async () => (await api.get(`/groups/${groupId}/members`)).data,
  });
}
