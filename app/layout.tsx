"use client"; // Ensure it's a client component

import { Layout, Menu } from "antd";
import AuthProvider from "./AuthProvider";
import { usePathname, useRouter } from "next/navigation";

const { Header, Content } = Layout;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { label: "Dashboard", key: "/dashboard" },
    { label: "Temporary Schedule", key: "/temporary-schedule" },
    { label: "Final Schedule", key: "/final-schedule" },
    { label: "Data Management", key: "/data-management", children: [
        { label: "Dosen", key: "/data-management/dosen" },
        { label: "Kelas", key: "/data-management/kelas" },
        // Add more tabs as needed
      ]},
    { label: "Preferences", key: "/preferences" },
  ];

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout style={{ minHeight: "100vh" }}>
            <Header>
              <div className="logo" /> 
              <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[pathname]}
                items={items}
                onClick={({ key }) => router.push(key)}
              />
            </Header>
            <Content style={{ padding: "24px" }}>{children}</Content>
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
