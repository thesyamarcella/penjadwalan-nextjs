"use client";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";


const LoginButton = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLoginClick = async () => {
    try {
      const result = await signIn("google"); 
      if (result) {
       
        router.push("/dashboard");
      } else {

      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  if (status === "authenticated") {
    return (
      <Button 
        type="primary" 
        onClick={() => signOut()} 
        style={{ marginRight: 16, alignItems: "center"}} 
      >
        Logout
      </Button>
    );
  }

  return (
    <Button type="primary" onClick={handleLoginClick}>
      Login
    </Button>
  );
};

export default LoginButton;
