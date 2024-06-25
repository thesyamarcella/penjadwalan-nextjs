"use client";

import { Layout, Menu } from "antd";
import AuthProvider from "./AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import {
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  ScheduleOutlined,
  LoginOutlined
} from "@ant-design/icons";

const { Header, Content } = Layout;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { key: "/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "/temporary-schedule", label: "Temporary Schedule", icon: <ScheduleOutlined /> },
    {
      key: "/data-management",
      label: "Data Management",
      icon: <TeamOutlined />,
      children: [
        { key: "/data-management/dosen", label: "Dosen" },
        { key: "/data-management/pengajaran", label: "Pengajaran" },
      ],
    },
    { key: "/preferences", label: "Preferences", icon: <SettingOutlined /> },
    { key: "/login", label: "Login", icon: <LoginOutlined /> }, 
  ];

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout>
            <Sider collapsible theme="light" collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
              <div/> 
              <Menu
                theme="light"
                mode="inline"
                selectedKeys={[pathname]}
                onClick={({key}) => router.push(key)}
                items={items}
              />
            </Sider>
            <Layout>
              <Header style={{ background: "#fff", padding: 0,  position: "fixed" }} />
              <Content style={{ margin: "16px" }}>{children}</Content>
            </Layout>
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
