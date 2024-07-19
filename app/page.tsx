"use client";

import React from 'react';
import { Button, Typography } from 'antd';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleDosenClick = () => {
    router.push("/dosen/login"); 
  };

  const handleStaffClick = () => {
    router.push("/staff/login"); 
  };

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Title level={2}>Selamat Datang di Penjadwalan IBIK</Title>
      <Paragraph>Silakan pilih peran Anda:</Paragraph>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <Button 
          type="primary" 
          size="large" 
          onClick={handleDosenClick} 
        >
          Dosen
        </Button>
        <Button 
          type="primary" 
          size="large" 
          onClick={handleStaffClick} 
        >
          Staf BAA
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
