import { useEffect, useState } from "react";
import { Table, Tag, Spin, type TableColumnsType } from "antd";
import { getEmpleadosPorArea } from "../../api/empleados";
import { useAuth } from "../../context/AuthContext";
import type { Employee } from "../../types";
import "../../styles/global.scss";

export default function EncargadoEmpleados() {
  const { user } = useAuth();
  const id_area = user?.id_area ?? 0;

  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getEmpleadosPorArea(id_area)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [id_area]);

  const columns: TableColumnsType<Employee> = [
    { title: "ID", dataIndex: "id_empleado", width: 70 },
    { title: "Nombre", render: (_, r) => `${r.nombre} ${r.apellido}` },
    { title: "Usuario", dataIndex: "usuario" },
    { title: "Cargo", dataIndex: "cargo" },
    {
      title: "Tipo",
      dataIndex: "tipo",
      render: (val: string) => {
        const color: Record<string, string> = {
          administrador: "red",
          encargado: "blue",
          empleado: "green",
        };
        return val ? <Tag color={color[val] ?? "default"}>{val}</Tag> : "-";
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Mi Equipo</h2>
      </div>
      <Table
        rowKey="id_empleado"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
