import { useQuery } from "@tanstack/react-query";
import { fetchManagerDashboard } from "./query";

export const useManagerDashboard = (userId: number) => {
    return useQuery({
      queryKey: ["managerDashboard", userId],
      queryFn: () => fetchManagerDashboard(userId),
    });
  };