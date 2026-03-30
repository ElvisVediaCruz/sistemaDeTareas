import { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Select, Tag, Spin, message, type TableColumnsType,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getProyecto, updateProyecto } from "../../api/proyectos";
import { getAreaProyectos } from "../../api/areaProyectos";
import { useAuth } from "../../context/AuthContext";
import type { Proyecto } from "../../types";
import "../../styles/global.scss";

const ESTADOS = ["Pendiente", "En progreso", "Completado", "Retrasado"];
const ESTADO_COLOR: Record<string, string> = {
  Pendiente: "default",
  "En progreso": "processing",
  Completado: "success",
  Retrasado: "error",
};

export default function EncargadoProyectos() {
  const { user } = useAuth();
  const id_area = user?.id_area ?? 0;

  const [data, setData] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Proyecto | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    try {
      const apRes = await getAreaProyectos();
      const ids = apRes.data
        .filter((ap) => ap.id_area === id_area)
        .map((ap) => ap.id_proyecto);
      const proyectos = await Promise.all(ids.map((id) => getProyecto(id).then((r) => r.data)));
      setData(proyectos);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id_area]);

  const openEdit = (record: Proyecto) => {
    setEditing(record);
    form.setFieldsValue({ estado: record.estado });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const { estado } = await form.validateFields();
    if (!editing) return;
    setSaving(true);
    try {
      await updateProyecto(editing.id_proyecto, { estado });
      messageApi.success("Estado actualizado");
      setModalOpen(false);
      fetchData();
    } catch {
      messageApi.error("Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  const columns: TableColumnsType<Proyecto> = [
    { title: "ID", dataIndex: "id_proyecto", width: 70 },
    { title: "Nombre", dataIndex: "nombre" },
    {
      title: "Inicio",
      dataIndex: "fecha_inicio",
      render: (v) => dayjs(v).format("DD/MM/YYYY"),
    },
    {
      title: "Entrega",
      dataIndex: "fecha_entrega",
      render: (v) => dayjs(v).format("DD/MM/YYYY"),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      render: (v) => <Tag color={ESTADO_COLOR[v] ?? "default"}>{v}</Tag>,
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

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="page-container">
      {contextHolder}
      <div className="page-header">
        <h2>Proyectos de mi Área</h2>
      </div>

      <Table
        rowKey="id_proyecto"
        columns={columns}
        dataSource={data}
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
          <Form.Item name="estado" label="Estado" rules={[{ required: true }]}>
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
