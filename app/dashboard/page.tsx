"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardPageContent } from "./page-content";

const queryClient = new QueryClient();

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardPageContent />
    </QueryClientProvider>
  );
}
