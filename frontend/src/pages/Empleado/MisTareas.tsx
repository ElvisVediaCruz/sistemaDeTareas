import { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Select, Tag, message, type TableColumnsType,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getTareas, updateTarea } from "../../api/tareas";
import type { Tarea } from "../../types";
import "../../styles/global.scss";

const ESTADOS = ["Pendiente", "En progreso", "Completada", "Retrasada"];
const ESTADO_COLOR: Record<string, string> = {
  Pendiente: "default",
  "En progreso": "processing",
  Completada: "success",
  Retrasada: "error",
};

export default function MisTareas() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tarea | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTareas();
      setTareas(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openEdit = (record: Tarea) => {
    setEditing(record);
    form.setFieldsValue({ estado: record.estado });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const { estado } = await form.validateFields();
    if (!editing) return;
    setSaving(true);
    try {
      await updateTarea(editing.id_tarea, { estado });
      messageApi.success("Estado actualizado");
      setModalOpen(false);
      fetchData();
    } catch {
      messageApi.error("Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  const columns: TableColumnsType<Tarea> = [
    { title: "ID", dataIndex: "id_tarea", width: 70 },
    { title: "Nombre", dataIndex: "nombre" },
    {
      title: "Fecha entrega",
      dataIndex: "fecha_entrega",
      render: (v) => v ? dayjs(v).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      render: (v) => v ? <Tag color={ESTADO_COLOR[v] ?? "default"}>{v}</Tag> : "-",
    },
    {
      title: "Documentos",
      render: (_, record) => {
        const docs = (record as any).documentos;
        return Array.isArray(docs) ? docs.length : "-";
      },
    },
    {
      title: "Acciones",
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          title="Actualizar estado"
          onClick={() => openEdit(record)}
        />
      ),
    },
  ];

  return (
    <div className="page-container">
      {contextHolder}
      <div className="page-header">
        <h2>Mis Tareas</h2>
      </div>

      <Table
        rowKey="id_tarea"
        columns={columns}
        dataSource={tareas}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={`Actualizar estado — ${editing?.nombre}`}
        open={modalOpen}
        onOk={handleSubmit}
        confirmLoading={saving}
        onCancel={() => setModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="estado" label="Nuevo estado" rules={[{ required: true }]}>
            <Select>
              {ESTADOS.map((e) => (
                <Select.Option key={e} value={e}>{e}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
