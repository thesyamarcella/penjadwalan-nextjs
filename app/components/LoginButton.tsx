"use client";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

const LoginButton = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLoginClick = async () => {
    try {
      const result = await signIn("google"); // Assuming you're using Google auth
      if (result) {
        // Handle successful login (e.g., redirect to the dashboard)
        router.push("/dashboard");
      } else {
        // Handle login failure
        // ...
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // If authenticated, you can show a logout button or display user information
  if (status === "authenticated") {
    return (
      <Button 
        type="primary" 
        onClick={() => signOut()} 
        style={{ marginRight: 16 }} // Add margin if needed
      >
        Logout
      </Button>
    );
  }

  // If not authenticated, show the login button
  return (
    <Button type="primary" onClick={handleLoginClick}>
      Login
    </Button>
  );
};

export default LoginButton;
