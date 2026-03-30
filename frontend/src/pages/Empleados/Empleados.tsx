import { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Input, Select, InputNumber,
  Popconfirm, message, Tag, type TableColumnsType,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado,
} from "../../api/empleados";
import { getAreas } from "../../api/areas";
import type { Employee, Area } from "../../types";
import "../../styles/global.scss";

export default function Empleados() {
  const [data, setData] = useState<Employee[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, areaRes] = await Promise.all([getEmpleados(), getAreas()]);
      setData(empRes.data);
      setAreas(areaRes.data);
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

  const openEdit = (record: Employee) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await updateEmpleado(editing.id_empleado, values);
        messageApi.success("Empleado actualizado");
      } else {
        await createEmpleado(values);
        messageApi.success("Empleado creado");
      }
      setModalOpen(false);
      fetchData();
    } catch {
      messageApi.error("Error al guardar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmpleado(id);
      messageApi.success("Empleado eliminado");
      fetchData();
    } catch {
      messageApi.error("Error al eliminar");
    }
  };

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
    {
      title: "Área",
      dataIndex: "id_area",
      render: (id) => areas.find((a) => a.id_area === id)?.nombre ?? "-",
    },
    {
      title: "Acciones",
      width: 120,
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="¿Eliminar empleado?"
            onConfirm={() => handleDelete(record.id_empleado)}
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
        <h2>Empleados</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Nuevo empleado
        </Button>
      </div>

      <Table
        rowKey="id_empleado"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editing ? "Editar empleado" : "Nuevo empleado"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="id_empleado"
            label="ID Empleado"
            rules={[{ required: !editing, message: "Ingresa el ID" }]}
          >
            <InputNumber style={{ width: "100%" }} disabled={!!editing} />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="apellido" label="Apellido" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="usuario" label="Usuario" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            {!editing && (
              <Form.Item name="password" label="Contraseña" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="cargo" label="Cargo" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tipo" label="Tipo">
              <Select allowClear placeholder="Selecciona tipo">
                <Select.Option value="administrador">Administrador</Select.Option>
                <Select.Option value="encargado">Encargado</Select.Option>
                <Select.Option value="empleado">Empleado</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="edad" label="Edad">
              <InputNumber style={{ width: "100%" }} min={18} />
            </Form.Item>
            <Form.Item name="id_area" label="Área">
              <Select allowClear placeholder="Selecciona área">
                {areas.map((a) => (
                  <Select.Option key={a.id_area} value={a.id_area}>
                    {a.nombre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="id_jefe" label="Jefe (dejar vacío si es jefe de área)">
            <Select allowClear placeholder="Selecciona jefe">
              {data.map((e) => (
                <Select.Option key={e.id_empleado} value={e.id_empleado}>
                  {e.nombre} {e.apellido}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
