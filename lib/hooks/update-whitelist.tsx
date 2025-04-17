import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateWhitelistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { ip: string }) => {
      const response = await fetch("/api/update-whitelist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["getInfo"],
      });
    },
  });
};
