"use client";

import { Layout, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  ScheduleOutlined,
  LoginOutlined
} from "@ant-design/icons";
import LoginButton from "../components/LoginButton";

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
    { key: "/dosen/dosen-schedule", label: "Jadwal", icon: <ScheduleOutlined /> },
    { key: "/dosen/dosen-preference", label: "Preferensi Waktu", icon: <DashboardOutlined /> },
    { key: "/staff/login", label: <LoginButton/> }
    
  
  ];

  const isActive = (key: string) => pathname === key || pathname.startsWith(key);


  return (
    <html lang="en">
      <body>
        <Layout style={{ minHeight: "100vh" }}>
          <Header
            style={{
              position: "fixed",
              zIndex: 1,
              width: "100%",
              background: "#fff",
              padding: 10,
            }}
          >
            <Menu
              theme="light"
              mode="horizontal"
              selectedKeys={items
                .filter((item) => isActive(item.key))
                .map((item) => item.key)}
              onClick={({ key }) => router.push(key)}
              style={{ lineHeight: "64px", justifyContent: "end" }}
            >
              {items.map((item) => (
                <Menu.Item key={item.key} icon={item.icon}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
          </Header>

          <Content style={{ paddingTop: 64 }}> 
            <div>{children}</div>
          </Content>
        </Layout>
      </body>
    </html>
  );
};
export default RootLayout;
