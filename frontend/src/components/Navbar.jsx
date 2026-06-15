import { Landmark, LogOut, Moon, Sun } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const { logoutUser } = useAuth();
  const navItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Inventory", to: "/inventory" },
    { label: "Item Types", to: "/item-types" },
    { label: "Prices", to: "/prices" },
  ];

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur dark:border-stone-700 dark:bg-stone-800/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <button
          type="button"
          className="flex items-center gap-3 text-left"
          onClick={handleDashboard}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-stone-950 text-amber-300 shadow-sm">
            <Landmark size={22} />
          </span>
          <span>
            <span className="block text-base font-bold text-stone-950 dark:text-stone-100">
              Gold Shop
            </span>
            <span className="block text-xs font-medium text-stone-500 dark:text-stone-400">
              Inventory ledger
            </span>
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="btn-icon"
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
