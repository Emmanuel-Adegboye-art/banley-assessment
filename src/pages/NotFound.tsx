import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 gap-4">
      <div className="relative">
        {/* Decorative 404 text */}
        <div className="text-[120px] font-bold leading-none tracking-tight text-muted-foreground/10 select-none">
          404
        </div>
        <div className="-mt-50 inset-0 flex flex-col items-center justify-center">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Search className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground mt-2 max-w-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
}
