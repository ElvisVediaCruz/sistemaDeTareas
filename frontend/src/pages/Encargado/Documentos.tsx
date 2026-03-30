import { useEffect, useState } from "react";
import {
  Table, Button, Popconfirm, Tag, message, type TableColumnsType,
} from "antd";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getDocumentos, deleteDocumento, downloadDocumento } from "../../api/documentos";
import type { Documento } from "../../types";
import "../../styles/global.scss";

export default function EncargadoDocumentos() {
  const [data, setData] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDocumentos();
      setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteDocumento(id);
      messageApi.success("Documento eliminado");
      fetchData();
    } catch {
      messageApi.error("Error al eliminar");
    }
  };

  const handleDownload = async (record: Documento) => {
    try {
      await downloadDocumento(record.id_documento, record.nombre);
    } catch {
      messageApi.error("Error al descargar");
    }
  };

  const columns: TableColumnsType<Documento> = [
    { title: "ID", dataIndex: "id_documento", width: 70 },
    { title: "Nombre", dataIndex: "nombre" },
    {
      title: "Fecha",
      dataIndex: "fecha",
      render: (v) => v ? dayjs(v).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Tarea",
      render: (_, record) => {
        const tarea = (record as any).tarea;
        return tarea?.nombre ? (
          <Tag color="blue">{tarea.nombre}</Tag>
        ) : (record.id_tarea ?? "-");
      },
    },
    {
      title: "Empleado",
      render: (_, record) => {
        const empleado = (record as any).tarea?.empleado;
        return empleado ? `${empleado.nombre} ${empleado.apellido}` : "-";
      },
    },
    {
      title: "Acciones",
      width: 120,
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          />
          <Popconfirm
            title="¿Eliminar documento?"
            onConfirm={() => handleDelete(record.id_documento)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="page-container">
      {contextHolder}
      <div className="page-header">
        <h2>Documentos del Área</h2>
      </div>

      <Table
        rowKey="id_documento"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
