import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, User, Settings, LogOut, Monitor, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/providers/ThemeProvider";

export function AppHeader() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";
  const isSystem = theme === "system";

  const getThemeIcon = () => {
    if (isDark) return <Moon className="h-4 w-4" />;
    if (isSystem) return <Monitor className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  const getThemeLabel = () => {
    if (isDark) return "Dark";
    if (isSystem) return "System";
    return "Light";
  };

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="cursor-pointer" />
        <div className="flex items-center gap-2">
          <span className="md:text-lg text-xs font-semibold">TipManager</span>
          <Badge variant="outline" className="text-xs font-normal">
            v1.0
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Theme Toggle with Switch */}
            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-2">
                {getThemeIcon()}
                <span className="text-sm">Theme</span>
                <span className="text-xs text-muted-foreground">
                  ({getThemeLabel()})
                </span>
              </div>
              <Switch
                checked={isDark}
                onCheckedChange={cycleTheme}
                aria-label="Toggle theme"
              />
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-xs">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs" variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
