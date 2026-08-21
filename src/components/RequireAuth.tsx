import { useConvexAuth } from "convex/react";
import { Navigate, useSearchParams } from "react-router-dom";
import { type ReactNode } from "react";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const authUrl = returnTo ? `/auth?returnTo=${encodeURIComponent(returnTo)}` : "/auth";
    return <Navigate to={authUrl} replace />;
  }

  return <>{children}</>;
}
