import { Landmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="bg-yellow-500 px-6, py-4, flex items-centers justify-between">
      <div className="hover:cursor-pointer flex items-center gap-2" onClick={handleDashboard} >
        <span className="text-2xl">
          <Landmark />
        </span>
        <span className="font-bold text-white text-lg">Gold Shop</span>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/item-types">Item-Types</Link>
        <Link to="/prices">Prices</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
