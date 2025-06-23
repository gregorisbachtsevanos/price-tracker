
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CircleUser, Calendar, LineChart, Settings, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/", icon: <CircleUser className="h-6 w-6" />, label: "Today" },
    { path: "/calendar", icon: <Calendar className="h-6 w-6" />, label: "Calendar" },
    { path: "/progress", icon: <LineChart className="h-6 w-6" />, label: "Progress" },
    { path: "/settings", icon: <Settings className="h-6 w-6" />, label: "Settings" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-supplement text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Chrono Supplements</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/add" className="text-white">
              <PlusCircle className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 mb-16">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2",
                currentPath === item.path
                  ? "text-supplement"
                  : "text-muted-foreground hover:text-supplement"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;