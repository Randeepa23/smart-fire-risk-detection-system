import { useEffect } from "react";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { SensorDataProvider } from "@/hooks/useSensorData";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Index page - Auth state:', { user: user?.email, loading });
    if (!loading && !user) {
      console.log('Navigating to /auth');
      // Add a small delay to see if this helps with navigation timing
      setTimeout(() => {
        navigate('/auth');
      }, 100);
    }
  }, [user, loading, navigate]);

  console.log('Index render - Auth state:', { user: user?.email, loading });

  if (loading) {
    console.log('Showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, returning null');
    return null;
  }

  console.log('Rendering dashboard for user:', user.email);
  return (
    <SensorDataProvider>
      <Dashboard />
    </SensorDataProvider>
  );
};

export default Index;
