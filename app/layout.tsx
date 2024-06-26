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

  const items = [
    { key: "/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "/temporary-schedule", label: "Draft Jadwal", icon: <ScheduleOutlined /> },
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
  
  ];

  const isActive = (key: string) => pathname === key || pathname.startsWith(key);


  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ background: "#fff", padding: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                {/* Existing Menu items on the left */}
                <Menu
                  theme="light"
                  mode="horizontal"
                  selectedKeys={items
                    .filter((item) => isActive(item.key))
                    .map((item) => item.key)}
                  onClick={({ key }) => router.push(key)}
                  items={items}
                  style={{ width: "auto" }} // Let the menu take the available space
                />

                {/* LoginButton on the right */}
                <div style={{ marginRight: 16 }}> {/* Add margin to the right */}
                  <LoginButton />
                </div>
              </div>
            </Header>
            <Content style={{ margin: "0px 16px 0" }}>{/* Adjust top margin for the header */}
              {children}
            </Content>
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
