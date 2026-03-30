import { useEffect, useState } from "react";
import { Spin } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";
import { getAreas } from "../../api/areas";
import { getEmpleados } from "../../api/empleados";
import { getProyectos } from "../../api/proyectos";
import { getTareas } from "../../api/tareas";
import type { Area, Employee, Proyecto, Tarea } from "../../types";
import "../../styles/global.scss";

const COLORS = ["#1677ff", "#52c41a", "#faad14", "#ff4d4f", "#722ed1", "#13c2c2"];

function countByField<T>(items: T[], field: keyof T): { name: string; value: number }[] {
  const map: Record<string, number> = {};
  items.forEach((item) => {
    const key = String(item[field] ?? "Sin asignar");
    map[key] = (map[key] ?? 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export default function Dashboard() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [empleados, setEmpleados] = useState<Employee[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAreas(), getEmpleados(), getProyectos(), getTareas()])
      .then(([a, e, p, t]) => {
        setAreas(a.data);
        setEmpleados(e.data);
        setProyectos(p.data);
        setTareas(t.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  const tareasPorEstado = countByField(tareas, "estado");
  const proyectosPorEstado = countByField(proyectos, "estado");

  // Empleados por área
  const empleadosPorArea = areas.map((a) => ({
    name: a.nombre,
    value: empleados.filter((e) => e.id_area === a.id_area).length,
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{areas.length}</div>
          <div className="stat-label">Áreas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{empleados.length}</div>
          <div className="stat-label">Empleados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{proyectos.length}</div>
          <div className="stat-label">Proyectos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{tareas.length}</div>
          <div className="stat-label">Tareas</div>
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
              <Bar dataKey="value" fill="#1677ff" radius={[4, 4, 0, 0]} name="Tareas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Proyectos por estado</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={proyectosPorEstado}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#52c41a" strokeWidth={2} dot name="Proyectos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Empleados por área</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={empleadosPorArea}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {empleadosPorArea.map((_, i) => (
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
