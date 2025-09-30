import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Shield, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <Shield className="h-16 w-16 mx-auto mb-6 text-primary" />
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">System Access Denied</h2>
        <p className="mb-6 text-muted-foreground">
          The requested monitoring endpoint could not be found in our fire safety system.
        </p>
        <Button asChild className="inline-flex items-center gap-2">
          <a href="/">
            <Home className="h-4 w-4" />
            Return to Safety Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
