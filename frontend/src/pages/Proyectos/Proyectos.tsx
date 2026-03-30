import { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Input, Select, DatePicker,
  message, Tag, type TableColumnsType,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getProyectos, createProyecto, updateProyecto } from "../../api/proyectos";
import type { Proyecto } from "../../types";
import "../../styles/global.scss";

const ESTADOS = ["Pendiente", "En progreso", "Completado", "Retrasado"];
const ESTADO_COLOR: Record<string, string> = {
  Pendiente: "default",
  "En progreso": "processing",
  Completado: "success",
  Retrasado: "error",
};

export default function Proyectos() {
  const [data, setData] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Proyecto | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getProyectos();
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Proyecto) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      fecha_inicio: dayjs(record.fecha_inicio),
      fecha_entrega: dayjs(record.fecha_entrega),
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      fecha_inicio: values.fecha_inicio.format("YYYY-MM-DD"),
      fecha_entrega: values.fecha_entrega.format("YYYY-MM-DD"),
    };
    try {
      if (editing) {
        await updateProyecto(editing.id_proyecto, payload);
        messageApi.success("Proyecto actualizado");
      } else {
        await createProyecto(payload);
        messageApi.success("Proyecto creado");
      }
      setModalOpen(false);
      fetchData();
    } catch {
      messageApi.error("Error al guardar");
    }
  };

  const columns: TableColumnsType<Proyecto> = [
    { title: "ID", dataIndex: "id_proyecto", width: 70 },
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Inicio", dataIndex: "fecha_inicio", render: (v) => dayjs(v).format("DD/MM/YYYY") },
    { title: "Entrega", dataIndex: "fecha_entrega", render: (v) => dayjs(v).format("DD/MM/YYYY") },
    {
      title: "Estado",
      dataIndex: "estado",
      render: (v) => <Tag color={ESTADO_COLOR[v] ?? "default"}>{v}</Tag>,
    },
    {
      title: "Acciones",
      width: 80,
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)} />
      ),
    },
  ];

  return (
    <div className="page-container">
      {contextHolder}
      <div className="page-header">
        <h2>Proyectos</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Nuevo proyecto
        </Button>
      </div>

      <Table
        rowKey="id_proyecto"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editing ? "Editar proyecto" : "Nuevo proyecto"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="fecha_inicio" label="Fecha inicio" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="fecha_entrega" label="Fecha entrega" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          <Form.Item name="estado" label="Estado" rules={[{ required: true }]}>
            <Select placeholder="Selecciona estado">
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
