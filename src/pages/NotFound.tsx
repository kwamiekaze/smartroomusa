import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { triggerReturnToLobby } from "@/components/SplashScreen";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <button
          onClick={triggerReturnToLobby}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-primary-foreground font-medium hover:opacity-90 transition"
        >
          <Home className="h-4 w-4" /> Return to Lobby
        </button>
      </div>
    </div>
  );
};

export default NotFound;
