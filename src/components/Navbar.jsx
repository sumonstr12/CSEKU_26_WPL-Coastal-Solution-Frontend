import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userRole");
    }
  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">✦</span>
        <div>
          <strong>CoastalGuard</strong>
          <small>Disaster Management</small>
        </div>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>
Dashboard
</NavLink>

        <NavLink to="/report">
          Report Disaster
        </NavLink>

        <NavLink to="/reports">
          My Reports
        </NavLink>

        <NavLink to="/map">
          Disaster Map
        </NavLink>

        <NavLink to="/alerts">
          Alerts
        </NavLink>

        <NavLink to="/help" className="help-link">
          Help / SOS
        </NavLink>
      </nav>

      <div className="nav-actions">

        <button
  className="profile-btn"
  onClick={handleLogout}
>
  Logout
</button>
      </div>
    </header>
  );
}

export default Navbar;