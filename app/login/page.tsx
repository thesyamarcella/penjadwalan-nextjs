"use client";

import { signIn, useSession } from "next-auth/react";
import { Card, Button, Space, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

const { Title } = Typography;

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter(); // Get the router instance

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard"); // Redirect to dashboard if logged in
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card title={<Title level={3}>Login</Title>} style={{ width: 400 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography>Please log in to access this app.</Typography>
          <Button
            type="primary"
            icon={<GoogleOutlined />}
            size="large"
            block
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </Button>
        </Space>
      </Card>
    </div>
  );
}
