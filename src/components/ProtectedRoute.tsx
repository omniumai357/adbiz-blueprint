
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page.",
          variant: "destructive",
        });
        navigate("/auth");
      } else if (requireAdmin && !isAdmin) {
        toast({
          title: "Access denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [user, isLoading, isAdmin, navigate, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
