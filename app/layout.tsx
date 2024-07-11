"use client";

import { Layout, Menu } from "antd";
import AuthProvider from "./AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  ScheduleOutlined,
  LoginOutlined
} from "@ant-design/icons";
import LoginButton from "./components/LoginButton";

const { Header, Content } = Layout;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const items = [
    { key: "/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "/temporary-schedule", label: "Draft Jadwal", icon: <ScheduleOutlined /> },
    {
      key: "/data-management",
      label: "Data Management",
      icon: <TeamOutlined />,

    },
    { key: "/dosen-preference", label: "Preferensi Dosen", icon: <SettingOutlined /> },
    { key: "/dosen-schedule", label: "Jadwal Dosen", icon: <ScheduleOutlined /> },
    { key: "/login", label: <LoginButton/> },
    
  
  ];

  const isActive = (key: string) => pathname === key || pathname.startsWith(key);


  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", padding: 0,  position: 'sticky' } }>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={items
            .filter((item) => isActive(item.key))
            .map((item) => item.key)}
          onClick={({ key }) => router.push(key)}
          style={{ lineHeight: "64px", justifyContent:"end", position: 'sticky'  }}
        >
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Header>
      <Content style={{ margin: "0 16px" }}>
        <div style={{ padding: 24, minHeight: 360 }}>{children}</div>
      </Content>
    </Layout>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
