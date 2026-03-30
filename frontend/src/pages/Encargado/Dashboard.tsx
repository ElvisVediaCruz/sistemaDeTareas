import { useEffect, useState } from "react";
import { Spin, Alert } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { getEmpleadosPorArea } from "../../api/empleados";
import { getAreaProyectos } from "../../api/areaProyectos";
import { getProyecto } from "../../api/proyectos";
import { getTareas } from "../../api/tareas";
import { getDocumentos } from "../../api/documentos";
import { useAuth } from "../../context/AuthContext";
import type { Proyecto, Tarea } from "../../types";
import "../../styles/global.scss";

const COLORS = ["#1677ff", "#52c41a", "#faad14", "#ff4d4f", "#722ed1"];

function countByField<T>(items: T[], field: keyof T) {
  const map: Record<string, number> = {};
  items.forEach((item) => {
    const key = String(item[field] ?? "Sin asignar");
    map[key] = (map[key] ?? 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export default function EncargadoDashboard() {
  const { user } = useAuth();
  const id_area = user?.id_area ?? 0;

  const [empleadosCount, setEmpleadosCount] = useState(0);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [documentosCount, setDocumentosCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [empRes, apRes, tarRes, docRes] = await Promise.all([
          getEmpleadosPorArea(id_area),
          getAreaProyectos(),
          getTareas(),
          getDocumentos(),
        ]);

        setEmpleadosCount(empRes.data.length);
        setTareas(tarRes.data);
        setDocumentosCount(docRes.data.length);

        const ids = apRes.data
          .filter((ap) => ap.id_area === id_area)
          .map((ap) => ap.id_proyecto);
        const proyRes = await Promise.all(ids.map((id) => getProyecto(id).then((r) => r.data)));
        setProyectos(proyRes);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id_area]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message="Error al cargar el dashboard" style={{ margin: 24 }} />;
  }

  const tareasPorEstado = countByField(tareas, "estado");
  const proyectosPorEstado = countByField(proyectos, "estado");

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Dashboard — Mi Área</h2>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{empleadosCount}</div>
          <div className="stat-label">Empleados en mi área</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{proyectos.length}</div>
          <div className="stat-label">Proyectos del área</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{tareas.length}</div>
          <div className="stat-label">Tareas del área</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{documentosCount}</div>
          <div className="stat-label">Documentos del área</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Tareas por estado</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={tareasPorEstado}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#006d75" radius={[4, 4, 0, 0]} name="Tareas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Proyectos por estado</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={proyectosPorEstado}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {proyectosPorEstado.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
