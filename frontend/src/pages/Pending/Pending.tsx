import { Button, Result, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ROLE_LABEL: Record<string, string> = {
  encargado: "Encargado",
  empleado: "Empleado",
};

export default function Pending() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
      }}
    >
      <Result
        status="info"
        title="Panel en construcción"
        subTitle={
          <>
            El panel para{" "}
            <Tag color="blue">{ROLE_LABEL[user?.tipo ?? ""] ?? user?.tipo}</Tag>
            estará disponible próximamente.
          </>
        }
        extra={
          <Button type="primary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        }
      />
    </div>
  );
}
