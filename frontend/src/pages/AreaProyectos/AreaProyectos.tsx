import { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Select,
  Popconfirm, message, type TableColumnsType,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAreaProyectos, createAreaProyecto, deleteAreaProyecto,
} from "../../api/areaProyectos";
import { getAreas } from "../../api/areas";
import { getProyectos } from "../../api/proyectos";
import type { AreaProyecto, Area, Proyecto } from "../../types";
import "../../styles/global.scss";

export default function AreaProyectos() {
  const [data, setData] = useState<AreaProyecto[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apRes, aRes, pRes] = await Promise.all([
        getAreaProyectos(), getAreas(), getProyectos(),
      ]);
      setData(apRes.data);
      setAreas(aRes.data);
      setProyectos(pRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      await createAreaProyecto(values);
      messageApi.success("Relación creada");
      setModalOpen(false);
      form.resetFields();
      fetchData();
    } catch {
      messageApi.error("Error al guardar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAreaProyecto(id);
      messageApi.success("Relación eliminada");
      fetchData();
    } catch {
      messageApi.error("Error al eliminar");
    }
  };

  const columns: TableColumnsType<AreaProyecto> = [
    { title: "ID", dataIndex: "id_area_proyecto", width: 70 },
    {
      title: "Área",
      dataIndex: "id_area",
      render: (id) => areas.find((a) => a.id_area === id)?.nombre ?? id,
    },
    {
      title: "Proyecto",
      dataIndex: "id_proyecto",
      render: (id) => proyectos.find((p) => p.id_proyecto === id)?.nombre ?? id,
    },
    {
      title: "Acciones",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="¿Eliminar relación?"
          onConfirm={() => handleDelete(record.id_area_proyecto)}
          okText="Sí"
          cancelText="No"
        >
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="page-container">
      {contextHolder}
      <div className="page-header">
        <h2>Área — Proyectos</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => { form.resetFields(); setModalOpen(true); }}
        >
          Nueva relación
        </Button>
      </div>

      <Table
        rowKey="id_area_proyecto"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Nueva relación área-proyecto"
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id_area" label="Área" rules={[{ required: true }]}>
            <Select placeholder="Selecciona área">
              {areas.map((a) => (
                <Select.Option key={a.id_area} value={a.id_area}>
                  {a.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="id_proyecto" label="Proyecto" rules={[{ required: true }]}>
            <Select placeholder="Selecciona proyecto">
              {proyectos.map((p) => (
                <Select.Option key={p.id_proyecto} value={p.id_proyecto}>
                  {p.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
