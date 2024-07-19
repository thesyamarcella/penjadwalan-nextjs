"use client";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to access this page.</p>

      <Link href="/">
        <Button type="primary">Back to Home</Button>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
