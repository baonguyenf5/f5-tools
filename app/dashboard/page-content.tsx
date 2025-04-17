"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useGetInfoQuery } from "@/lib/hooks/get-user-info";
import { Badge } from "@/components/ui/badge";
import { useUpdateWhitelistMutation } from "@/lib/hooks/update-whitelist";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Check, Terminal } from "lucide-react";
import { useMemo } from "react";

export function DashboardPageContent() {
  const infoQuery = useGetInfoQuery();
  const updateMutation = useUpdateWhitelistMutation();

  const clientIp = infoQuery.data?.clientIp;
  const aName = infoQuery.data?.mapping?.a_name;
  const whitelistedIP = infoQuery.data?.dns?.content;

  const alert = useMemo(() => {
    if (infoQuery.isFetching || updateMutation.isPending) return undefined;

    if (updateMutation.error) {
      return {
        description:
          updateMutation.error.message ||
          "An error occurred while updating the whitelist.",
        variant: "error",
      };
    }
    if (infoQuery.error) {
      return {
        description:
          infoQuery.error.message ||
          "An error occurred while fetching your IP address.",
        variant: "error",
      };
    }
    if (clientIp && clientIp === whitelistedIP) {
      return {
        description: "Your IP address is already whitelisted.",
        variant: "info",
      };
    }
    if (clientIp !== whitelistedIP) {
      return {
        description: "Your IP address is not whitelisted.",
        variant: "info",
      };
    }
    return undefined;
  }, [
    clientIp,
    whitelistedIP,
    infoQuery.error,
    updateMutation.error,
    infoQuery.isFetching,
    updateMutation.isPending,
  ]);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <Card className="w-[350px]">
        <CardContent>
          <p className="font-bold text-xl mt-4">Your IP Address</p>
          <p className="text-sm font-mono p-3 rounded border">
            {infoQuery.isFetching ? "Loading..." : clientIp}
          </p>
          <Badge variant="secondary">
            {infoQuery.isFetching ? "Loading..." : aName}
          </Badge>
          <p className="font-bold text-xl mt-4">Your Whitelisted Address</p>
          <p className="text-sm font-mono p-3 rounded border">
            {infoQuery.isFetching ? "Loading..." : whitelistedIP}
          </p>
          {alert?.variant === "error" && (
            <p className="text-sm rounded mt-4 p-2 bg-red-200">
              ERROR: {alert.description}
            </p>
          )}
          {alert?.variant === "info" && (
            <p className="text-sm rounded mt-4 p-2">{alert.description}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={() => updateMutation.mutate({ ip: clientIp || "" })}
            disabled={
              infoQuery.isFetching ||
              updateMutation.isPending ||
              clientIp === whitelistedIP
            }
            className="mt-4"
          >
            {updateMutation.isPending ? "Updating..." : "Update"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
