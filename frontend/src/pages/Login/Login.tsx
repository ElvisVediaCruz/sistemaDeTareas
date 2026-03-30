import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../api/auth";
import { parseJwt } from "../../context/AuthContext";
import "../../styles/global.scss";

interface LoginForm {
  usuario: string;
  password: string;
}

const ROLE_HOME: Record<string, string> = {
  administrador: "/dashboard",
  encargado: "/encargado/dashboard",
  empleado: "/empleado/tareas",
};

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: LoginForm) => {
    try {
      const { data } = await login(values.usuario, values.password);
      const payload = parseJwt(data.token);
      if (!payload) throw new Error("Token inválido");
      setAuth(data.token, payload);
      navigate(ROLE_HOME[payload.tipo] ?? "/login");
    } catch {
      messageApi.error("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-page">
      {contextHolder}
      <div className="login-card">
        <div className="login-logo">
          <h1>Asignación de Tareas</h1>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="usuario"
            rules={[{ required: true, message: "Ingresa tu usuario" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Usuario" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Ingresa tu contraseña" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" size="large" block>
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
