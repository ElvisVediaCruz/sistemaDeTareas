import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute, { AdminRoute, EncargadoRoute, EmpleadoRoute } from "./routes/PrivateRoute";

// Layouts
import AppLayout from "./components/Layout/AppLayout";
import EncargadoLayout from "./components/Layout/EncargadoLayout";
import EmpleadoLayout from "./components/Layout/EmpleadoLayout";

// Páginas comunes
import Login from "./pages/Login/Login";

// Páginas — Administrador
import Dashboard from "./pages/Dashboard/Dashboard";
import Areas from "./pages/Areas/Areas";
import Empleados from "./pages/Empleados/Empleados";
import Proyectos from "./pages/Proyectos/Proyectos";
import Tareas from "./pages/Tareas/Tareas";
import Documentos from "./pages/Documentos/Documentos";
import AreaProyectos from "./pages/AreaProyectos/AreaProyectos";

// Páginas — Encargado
import EncargadoDashboard from "./pages/Encargado/Dashboard";
import EncargadoProyectos from "./pages/Encargado/Proyectos";
import EncargadoEmpleados from "./pages/Encargado/Empleados";
import EncargadoTareas from "./pages/Encargado/Tareas";
import EncargadoDocumentos from "./pages/Encargado/Documentos";

// Páginas — Empleado
import MisTareas from "./pages/Empleado/MisTareas";
import MisDocumentos from "./pages/Empleado/MisDocumentos";

export default function App() {
  return (
    <ConfigProvider locale={esES} theme={{ token: { colorPrimary: "#1677ff" } }}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Pública */}
            <Route path="/login" element={<Login />} />

            {/* ── ADMINISTRADOR ── */}
            <Route element={<AdminRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/areas" element={<Areas />} />
                <Route path="/empleados" element={<Empleados />} />
                <Route path="/proyectos" element={<Proyectos />} />
                <Route path="/tareas" element={<Tareas />} />
                <Route path="/documentos" element={<Documentos />} />
                <Route path="/area-proyectos" element={<AreaProyectos />} />
              </Route>
            </Route>

            {/* ── ENCARGADO ── */}
            <Route element={<EncargadoRoute />}>
              <Route element={<EncargadoLayout />}>
                <Route path="/encargado/dashboard" element={<EncargadoDashboard />} />
                <Route path="/encargado/proyectos" element={<EncargadoProyectos />} />
                <Route path="/encargado/empleados" element={<EncargadoEmpleados />} />
                <Route path="/encargado/tareas" element={<EncargadoTareas />} />
                <Route path="/encargado/documentos" element={<EncargadoDocumentos />} />
              </Route>
            </Route>

            {/* ── EMPLEADO ── */}
            <Route element={<EmpleadoRoute />}>
              <Route element={<EmpleadoLayout />}>
                <Route path="/empleado/tareas" element={<MisTareas />} />
                <Route path="/empleado/documentos" element={<MisDocumentos />} />
              </Route>
            </Route>

            {/* Raíz y fallback */}
            <Route element={<PrivateRoute />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}
