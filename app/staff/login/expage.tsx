// "use client";

// import { Card, Button, Space, Typography, message } from "antd";
// import { GoogleOutlined } from "@ant-design/icons";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// const { Title } = Typography;

// export default function LoginPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleGoogleSignIn = async () => {
//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         "https://penjadwalan-be-j6usm5hcwa-et.a.run.app/principal/google-oauth",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();

//         if (data.url) {
          
//           window.location.href = data.url;
          
//         } else if (data.token) {
//           console.log(data.token)
//           localStorage.setItem("authToken", data.token);
//           router.push("/staff/dashboard");
//         } else {
//           message.error(
//             "Terjadi kesalahan saat login. Token tidak ditemukan."
//           );
//         }
//       } else {
//         message.error(
//           "Gagal mendapatkan URL otentikasi dari server. Silakan coba lagi."
//         );
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       message.error("Terjadi kesalahan saat login.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//       <Card title={<Title level={3}>Login</Title>} style={{ width: 400 }}>
//         <Space direction="vertical" style={{ width: "100%" }}>
//           <Typography>Dear Staff, Please log in to access this app.</Typography>
//           <Button
//             type="primary"
//             icon={<GoogleOutlined />}
//             size="large"
//             block
//             onClick={handleGoogleSignIn} 
//             loading={isLoading} 
//           >
//             Sign in with Google
//           </Button>
//         </Space>
//       </Card>
//     </div>
//   );
// }
