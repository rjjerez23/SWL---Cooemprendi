import { NavLink } from "react-router";

const navigationItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/socios", label: "Socios" },
  { path: "/ahorros", label: "Ahorros" },
  { path: "/prestamos", label: "Préstamos" },
  { path: "/pagos", label: "Pagos" },
  { path: "/reportes", label: "Reportes" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Emprendicoop</h2>
        <span>Sistema de gestión</span>
      </div>

      <nav className="sidebar-nav" aria-label="Navegación principal">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;