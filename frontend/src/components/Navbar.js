import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ===== Scroll Effect ===== */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">

        {/* Logo */}
        <div className="logo-section">
          <Link to="/">
            <img src={logo} alt="Clayora Logo" className="logo-img" />
          </Link>
        </div>

        {/* Hamburger */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Links */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link onClick={() => setMenuOpen(false)} className={location.pathname === "/" ? "active" : ""} to="/">Home</Link>
          <Link onClick={() => setMenuOpen(false)} className={location.pathname === "/cart" ? "active" : ""} to="/cart">Cart</Link>

          {user?.role === "admin" && (
            <Link onClick={() => setMenuOpen(false)} to="/admin">Admin</Link>
          )}

          {user?.role === "seller" && (
            <Link onClick={() => setMenuOpen(false)} to="/seller">Seller</Link>
          )}

          {user?.role === "buyer" && (
            <Link onClick={() => setMenuOpen(false)} to="/profile">Profile</Link>
          )}

          {token ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link onClick={() => setMenuOpen(false)} to="/auth" className="login-btn">
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;