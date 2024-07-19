"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Card, Button, Space, Typography, message } from "antd";
import { GoogleOutlined, LogoutOutlined } from "@ant-design/icons"; // Import LogoutOutlined
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/staff/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      message.error("Failed to sign in.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      message.error("Failed to sign out.");
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
    >
      <Card title={<Title level={3}>Login</Title>} style={{ width: 400 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography>Please log in to access this app.</Typography>
          {status === "authenticated" ? (
            <Button type="primary" icon={<LogoutOutlined />} size="large" block onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<GoogleOutlined />}
              size="large"
              block
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </Button>
          )}
        </Space>
      </Card>
    </div>
  );
}
