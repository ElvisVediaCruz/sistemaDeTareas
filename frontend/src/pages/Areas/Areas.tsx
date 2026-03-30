import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm, message, type TableColumnsType } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAreas, createArea, updateArea, deleteArea } from "../../api/areas";
import type { Area } from "../../types";
import "../../styles/global.scss";

export default function Areas() {
  const [data, setData] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Area | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAreas();
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

  const openEdit = (record: Area) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await updateArea(editing.id_area, values);
        messageApi.success("Área actualizada");
      } else {
        await createArea(values);
        messageApi.success("Área creada");
      }
      setModalOpen(false);
      fetchData();
    } catch {
      messageApi.error("Error al guardar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteArea(id);
      messageApi.success("Área eliminada");
      fetchData();
    } catch {
      messageApi.error("Error al eliminar");
    }
  };

  const columns: TableColumnsType<Area> = [
    { title: "ID", dataIndex: "id_area", width: 80 },
    { title: "Nombre", dataIndex: "nombre" },
    {
      title: "Acciones",
      width: 120,
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="¿Eliminar área?"
            onConfirm={() => handleDelete(record.id_area)}
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
        <h2>Áreas</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Nueva área
        </Button>
      </div>

      <Table
        rowKey="id_area"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editing ? "Editar área" : "Nueva área"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: "Ingresa el nombre" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
