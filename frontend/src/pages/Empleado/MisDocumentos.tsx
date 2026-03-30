import { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Input, Select, Upload,
  Popconfirm, Tag, message, type TableColumnsType, type UploadFile,
} from "antd";
import { PlusOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getDocumentos, createDocumento, deleteDocumento, downloadDocumento } from "../../api/documentos";
import { getTareas } from "../../api/tareas";
import type { Documento, Tarea } from "../../types";
import "../../styles/global.scss";

export default function MisDocumentos() {
  const [data, setData] = useState<Documento[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dRes, tRes] = await Promise.all([getDocumentos(), getTareas()]);
      setData(dRes.data.data);
      setTareas(tRes.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (!fileList[0]?.originFileObj) {
      messageApi.error("Selecciona un archivo");
      return;
    }
    setSubmitting(true);
    try {
      await createDocumento(values.nombre, Number(values.id_tarea), fileList[0].originFileObj as File);
      messageApi.success("Documento subido");
      setModalOpen(false);
      form.resetFields();
      setFileList([]);
      fetchData();
    } catch {
      messageApi.error("Error al subir");
    } finally {
      setSubmitting(false);
    }
  };

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
        const tarea =
          (record as any).tarea ??
          tareas.find((t) => t.id_tarea === record.id_tarea);
        return tarea?.nombre ? (
          <Tag color="purple">{tarea.nombre}</Tag>
        ) : "-";
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
        <h2>Mis Documentos</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => { form.resetFields(); setFileList([]); setModalOpen(true); }}
        >
          Subir documento
        </Button>
      </div>

      <Table
        rowKey="id_documento"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Subir documento"
        open={modalOpen}
        onOk={handleSubmit}
        confirmLoading={submitting}
        onCancel={() => setModalOpen(false)}
        okText="Subir"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="id_tarea" label="Tarea" rules={[{ required: true }]}>
            <Select placeholder="Selecciona una de tus tareas">
              {tareas.map((t) => (
                <Select.Option key={t.id_tarea} value={t.id_tarea}>
                  {t.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Archivo" required>
            <Upload
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList: list }) => setFileList(list.slice(-1))}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
