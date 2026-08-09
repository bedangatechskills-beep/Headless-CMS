import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../api.js";

export default function Layout() {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div className="layout">
      <nav className="sidebar">
        <h1>Portfolio CMS</h1>
        <Link to="/">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/services">Services</Link>
        <Link to="/team">Team</Link>
        <Link to="/testimonials">Testimonials</Link>
        <Link to="/settings">Site Settings</Link>
        <button className="logout" onClick={logout}>Log out</button>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
