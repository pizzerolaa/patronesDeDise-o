import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-link">Inicio</NavLink>
        <NavLink to="/about" className="nav-link">About</NavLink>
        <NavLink to="/dashbord" className="nav-link">Dashbord</NavLink>
        <NavLink to="/products" className="nav-link">Productos</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;