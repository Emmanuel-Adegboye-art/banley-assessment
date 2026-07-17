import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Store, Receipt } from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Restaurants", icon: Store, href: "/restaurants" },
  { name: "Tips", icon: Receipt, href: "/tips" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background shadow-lg md:hidden">
      <div className="flex items-center justify-around overflow-x-auto py-2 px-1 scrollbar-hide snap-x snap-mandatory">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`
              flex flex-col items-center gap-0.5 px-3 py-1 min-w-14 snap-center
              ${
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium truncate max-w-full">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
