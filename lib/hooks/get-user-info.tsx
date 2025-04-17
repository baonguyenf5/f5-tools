import { useQuery } from "@tanstack/react-query";
import { CloudflareDNSRecord, UserMapping } from "../types/types";

export const useGetInfoQuery = () => {
  return useQuery({
    queryKey: ["getInfo"],
    queryFn: async () => {
      const response = await fetch("/api/get-info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      return response.json() as Promise<{
        clientIp: string;
        mapping?: UserMapping;
        dns?: CloudflareDNSRecord;
      }>;
    },
  });
};
