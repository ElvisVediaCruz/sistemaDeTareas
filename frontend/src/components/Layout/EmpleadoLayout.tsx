import { useState } from "react";
import { Layout, Menu, Button, Avatar, Dropdown, type MenuProps } from "antd";
import {
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
  { key: "/empleado/tareas", icon: <CheckSquareOutlined />, label: "Mis Tareas" },
  { key: "/empleado/documentos", icon: <FileOutlined />, label: "Mis Documentos" },
];

export default function EmpleadoLayout() {
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
        style={{ background: "#531dab" }}
      >
        <div className="sider-logo" style={{ background: "#531dab" }}>
          {collapsed ? "EM" : "Empleado"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: "#531dab" }}
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
              <Avatar icon={<UserOutlined />} style={{ background: "#531dab" }} />
              <span style={{ fontWeight: 500 }}>{user?.usuario ?? "Empleado"}</span>
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
