import { useState } from "react";
import { Layout, Menu, Button, Avatar, Dropdown, type MenuProps } from "antd";
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  FileOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const { Sider, Header, Content } = Layout;

const menuItems: MenuProps["items"] = [
  { key: "/encargado/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/encargado/proyectos", icon: <ProjectOutlined />, label: "Proyectos" },
  { key: "/encargado/empleados", icon: <TeamOutlined />, label: "Mi Equipo" },
  { key: "/encargado/tareas", icon: <CheckSquareOutlined />, label: "Tareas" },
  { key: "/encargado/documentos", icon: <FileOutlined />, label: "Documentos" },
];

export default function EncargadoLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const userMenu: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar sesión",
      onClick: () => { logout(); navigate("/login"); },
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        style={{ background: "#006d75" }}
      >
        <div className="sider-logo" style={{ background: "#006d75" }}>
          {collapsed ? "EC" : "Encargado"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: "#006d75" }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
            height: 64,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18 }}
          />
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar icon={<UserOutlined />} style={{ background: "#006d75" }} />
              <span style={{ fontWeight: 500 }}>{user?.usuario ?? "Encargado"}</span>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ padding: 24, background: "#f0f2f5" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
