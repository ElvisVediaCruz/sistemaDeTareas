import { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Input, Select, DatePicker,
  Popconfirm, message, Tag, type TableColumnsType,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getTareas, createTarea, updateTarea, deleteTarea } from "../../api/tareas";
import { getProyectos } from "../../api/proyectos";
import { getEmpleados } from "../../api/empleados";
import type { Tarea, Proyecto, Employee } from "../../types";
import "../../styles/global.scss";

const ESTADOS = ["Pendiente", "En progreso", "Completada", "Retrasada"];
const ESTADO_COLOR: Record<string, string> = {
  Pendiente: "default",
  "En progreso": "processing",
  Completada: "success",
  Retrasada: "error",
};

export default function Tareas() {
  const [data, setData] = useState<Tarea[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [empleados, setEmpleados] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tarea | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, pRes, eRes] = await Promise.all([
        getTareas(), getProyectos(), getEmpleados(),
      ]);
      setData(tRes.data);
      setProyectos(pRes.data);
      setEmpleados(eRes.data);
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

  const openEdit = (record: Tarea) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      fecha_entrega: record.fecha_entrega ? dayjs(record.fecha_entrega) : null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      fecha_entrega: values.fecha_entrega?.format("YYYY-MM-DD"),
    };
    try {
      if (editing) {
        await updateTarea(editing.id_tarea, payload);
        messageApi.success("Tarea actualizada");
      } else {
        await createTarea(payload);
        messageApi.success("Tarea creada");
      }
      setModalOpen(false);
      fetchData();
    } catch {
      messageApi.error("Error al guardar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTarea(id);
      messageApi.success("Tarea eliminada");
      fetchData();
    } catch {
      messageApi.error("Error al eliminar");
    }
  };

  const columns: TableColumnsType<Tarea> = [
    { title: "ID", dataIndex: "id_tarea", width: 70 },
    { title: "Nombre", dataIndex: "nombre" },
    {
      title: "Entrega",
      dataIndex: "fecha_entrega",
      render: (v) => v ? dayjs(v).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      render: (v) => v ? <Tag color={ESTADO_COLOR[v] ?? "default"}>{v}</Tag> : "-",
    },
    {
      title: "Proyecto",
      dataIndex: "id_proyecto",
      render: (id) => proyectos.find((p) => p.id_proyecto === id)?.nombre ?? "-",
    },
    {
      title: "Empleado",
      dataIndex: "id_empleado",
      render: (id) => {
        const e = empleados.find((x) => x.id_empleado === id);
        return e ? `${e.nombre} ${e.apellido}` : "-";
      },
    },
    {
      title: "Acciones",
      width: 120,
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="¿Eliminar tarea?"
            onConfirm={() => handleDelete(record.id_tarea)}
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
        <h2>Tareas</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Nueva tarea
        </Button>
      </div>

      <Table
        rowKey="id_tarea"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editing ? "Editar tarea" : "Nueva tarea"}
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
            <Form.Item name="fecha_entrega" label="Fecha entrega">
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="estado" label="Estado">
              <Select allowClear placeholder="Selecciona estado">
                {ESTADOS.map((e) => (
                  <Select.Option key={e} value={e}>{e}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="id_proyecto" label="Proyecto">
            <Select allowClear placeholder="Selecciona proyecto">
              {proyectos.map((p) => (
                <Select.Option key={p.id_proyecto} value={p.id_proyecto}>
                  {p.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="id_empleado" label="Empleado asignado">
            <Select allowClear placeholder="Selecciona empleado">
              {empleados.map((e) => (
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
