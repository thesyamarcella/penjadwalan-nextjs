"use client";

import { Layout, Menu } from "antd";
import AuthProvider from "./AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const { Header, Content } = Layout;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };


  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>

        <AuthProvider>
        {children}
        </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
