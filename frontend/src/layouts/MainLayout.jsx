import { Outlet } from "react-router";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";

function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-content">
        <Header />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;