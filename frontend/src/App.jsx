import { Navigate, Route, Routes } from "react-router";

import MainLayout from "./layouts/MainLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Socios from "./pages/Socios.jsx";
import Ahorros from "./pages/Ahorros.jsx";
import Prestamos from "./pages/Prestamos.jsx";
import Pagos from "./pages/Pagos.jsx";
import Reportes from "./pages/Reportes.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/socios" element={<Socios />} />
        <Route path="/ahorros" element={<Ahorros />} />
        <Route path="/prestamos" element={<Prestamos />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/reportes" element={<Reportes />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;