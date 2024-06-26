"use client"
import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Modal, Form, Card } from 'antd';
import { SearchOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';

interface Dosen {
  id: number;
  nidn: string;
  nama_depan: string;
  nama_belakang: string;
  email?: string;
  id_pegawai: string;
  inisial: string;
  gelar_depan: string;
  gelar_belakang: string;
  alamat: string;
  agama: string;
  telp_seluler: string;
  preferensi: any[];
}

const DosenPage: React.FC = () => {
  const [dosen, setDosen] = useState<Dosen[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState<Dosen | null>(null);
  const [loading, setLoading] = useState();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchDosen = async () => {
      try {
        const response = await fetch('https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/dosen');
        const data = await response.json();
        setDosen(data.items);
      } catch (error) {
        console.error('Error fetching dosen:', error);
        message.error('Failed to load dosen data.');
      }
    };

    fetchDosen();
  }, []);

  const showModal = (dosen?: Dosen) => {
    setIsEditModal(!!dosen);
    setSelectedDosen(dosen ?? null);
    setIsModalVisible(true);
    if (dosen) {
      form.setFieldsValue(dosen);
    } else {
      form.resetFields();
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
  
      if (isEditModal && selectedDosen) {
        const updatedPreferensi = (selectedDosen.preferensi || []).map(item => ({
      id_dosen: selectedDosen.id, 
      id_slot: item.slot.id, 
    }));
        const updatedRecord = {
          ...selectedDosen,
          ...values,
          nidn: selectedDosen.nidn, 
          id_pegawai: selectedDosen.id_pegawai,
          inisial: selectedDosen.inisial,
          gelar_depan: selectedDosen.gelar_depan,
          gelar_belakang: selectedDosen.gelar_belakang,
          alamat: selectedDosen.alamat,
          agama: selectedDosen.agama,
          telp_seluler: selectedDosen.telp_seluler,
          preferensi: selectedDosen.preferensi.map(item => ({
            id: item.id,              
            id_dosen: item.id_dosen,
            id_slot: item.id_slot,
            slot: item.slot,         
          })), 
        };
  
        const response = await fetch(`https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/dosen${selectedDosen.id}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRecord),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.log(response)
          throw new Error(errorData.message || `Failed to update dosen with ID ${selectedDosen.id}`);
        }
  
        message.success('Dosen updated successfully');
  
        // Update state, close modal, and refetch data
        setIsModalVisible(false);
        form.resetFields();
  
        const fetchDosen = async () => {
          try {
            const response = await fetch('https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/dosen');
            const data = await response.json();
            setDosen(data.items);
          } catch (error) {
            console.error('Error fetching dosen:', error);
            message.error('Failed to load dosen data.');
          }
        };
        fetchDosen();
      } else {
        const response = await fetch('https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/dosen', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add dosen');
        }
  
        message.success('Dosen added successfully');
  
        // Update state, close modal, and refetch data
        setIsModalVisible(false);
        form.resetFields();
  
        const fetchDosen = async () => {
          try {
            const response = await fetch('https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/dosen');
            const data = await response.json();
            setDosen(data.items);
          } catch (error) {
            console.error('Error fetching dosen:', error);
            message.error('Failed to load dosen data.');
          }
        };
        fetchDosen();
      }
    } catch (error) {
      console.error('Failed to save dosen:', error);
      message.error('Failed to save dosen.');
    }
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredDosen = dosen.filter(
    (d) =>
      d.nidn.includes(searchText) ||
      d.nama_depan.toLowerCase().includes(searchText.toLowerCase()) ||
      d.nama_belakang.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'NIDN',
      dataIndex: 'nidn',
      key: 'nidn',
    },
    {
      title: 'Nama Depan',
      dataIndex: 'nama_depan',
      key: 'nama_depan',
    },
    {
      title: 'Nama Belakang',
      dataIndex: 'nama_belakang',
      key: 'nama_belakang',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      render: (text: any, record: Dosen) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<SettingOutlined />}
          />
        </span>
      ),
    },
  ];

  return (
    <Card style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap' }}>
      <Input
        placeholder="Search Dosen"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Add Dosen
      </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredDosen}
        loading={loading}
        rowKey="id"
        scroll={{ x: true, y: 450 }}
        
      />
      <Modal
        title={isEditModal ? 'Edit Dosen' : 'Add Dosen'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={selectedDosen || { nidn: '', nama_depan: '', nama_belakang: '', email: '' }}
        >
          <Form.Item
            name="nidn"
            label="NIDN"
            rules={[{ required: true, message: 'Please input the NIDN!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nama_depan"
            label="Nama Depan"
            rules={[{ required: true, message: 'Please input the first name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nama_belakang"
            label="Nama Belakang"
            rules={[{ required: true, message: 'Please input the last name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default DosenPage;
