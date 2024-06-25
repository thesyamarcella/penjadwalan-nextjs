"use client";
import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Card, Dropdown, Menu, Modal, Select, Form, message } from 'antd';
import { MoreOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';

const { Search } = Input;

interface Pengajaran {
  created_at: string;
  updated_at: string;
  id: number;
  id_dosen: number;
  id_kelas: number;
  id_mata_kuliah: number;
  id_semester: number;
  dosen: {
    nama_depan: string;
    nama_belakang: string;
    email: string;
  };
  kelas: {
    nama_kelas: string;
    prodi: {
      nama_prodi: string;
    };
    dosen: {
      nama_depan: string;
      nama_belakang: string;
    };
  };
  mata_kuliah: {
    nama_mata_kuliah: string;
    sks: number;
    semester: string;
  };
  semester: {
    jenis: string;
    tahun_ajaran: string;
  };
}

interface DosenOption {
  value: number;
  label: string;
}

interface KelasOption {
  value: number;
  label: string;
}

interface MataKuliahOption {
  value: number;
  label: string;
}

interface ScheduleItem {
  id: number;
  id_slot: number;
  id_ruangan: number;
  id_pengajaran: number;
  slot: {
    day: string;
    start_time: string;
    end_time: string;
  };
  ruangan: {
    nama_ruangan: string;
  };
  pengajaran: Pengajaran;
  is_conflicted?: boolean;
}

const PengajaranPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<Pengajaran[]>([]);
  const [filteredData, setFilteredData] = useState<Pengajaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<Pengajaran | null>(null);
  const [dosenOptions, setDosenOptions] = useState<DosenOption[]>([]);
  const [kelasOptions, setKelasOptions] = useState<KelasOption[]>([]);
  const [mataKuliahOptions, setMataKuliahOptions] = useState<MataKuliahOption[]>([]);
  const [optionsLoading,setOptionsLoading] = useState(true)


  useEffect(() => {
    if (session) {
      console.log('Session Token:', session);
    }
  }, [session]);

  useEffect(() => {
    fetchPengajaran();
  }, []);

  const fetchPengajaran = async () => {
    try {
      const response = await fetch('https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/pengajaran'); 
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const result = await response.json();
      console.log("API Response:", result);
      const pengajaranData: Pengajaran[] = Array.isArray(result.items) ? result.items : [];
      setData(pengajaranData);
      setFilteredData(pengajaranData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions("dosen").then(setDosenOptions);
    fetchOptions("kelas").then(setKelasOptions);
    fetchOptions("mata-kuliah").then(setMataKuliahOptions);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const fetchOptions = async (endpoint: string): Promise<any[]> => {
    try {
      const response = await fetch(`https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const result = await response.json();
      return result.items || []; // Handle cases where 'items' might be missing
    } catch (error) {
      console.error(`Error fetching options for ${endpoint}:`, error);
      console.log(Response)
      return []; // Return an empty array in case of error
    }
  };

  const handleSearch = (value: string) => {
    const searchValue = value.toLowerCase();
    const filtered = data.filter(
      item =>
        item.dosen.nama_depan.toLowerCase().includes(searchValue) ||
        item.dosen.nama_belakang.toLowerCase().includes(searchValue)
    );
    setFilteredData(filtered);
  };

  const handleEdit = async (record: Pengajaran) => {
    setEditRecord(record);

    // Ensure options are loaded before opening the modal
    if (optionsLoading) {
      await Promise.all([
        fetchOptions("dosen").then(setDosenOptions),
        fetchOptions("kelas").then(setKelasOptions),
        fetchOptions("mata-kuliah").then(setMataKuliahOptions)
      ]).finally(() => setOptionsLoading(false));
    }

    setEditModalVisible(true);
  };

  const handleSaveEdit = async (values: any) => {
    if (editRecord) {
      const updatedRecord = { ...editRecord, ...values };
      try {
        const response = await fetch(`https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/pengajaran/${editRecord.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRecord),
        });
        if (!response.ok) {
          throw new Error(`Failed to update record with ID ${editRecord.id}`);
        }
        message.success(`Update record with ID ${editRecord.id} successful`);
        fetchPengajaran(); // Refresh data
        setEditModalVisible(false); // Close modal
      } catch (error) {
        console.error('Error updating record:', error);
        message.error(`Failed to update record with ID ${editRecord.id}`);
      }
    }
  };

  const handleAddPreferences = async (id: number) => {
    try {
      message.success(`Added preferences for record with ID ${id}`);
    } catch (error) {
      console.error('Error adding preferences:', error);
      message.error(`Failed to add preferences for record with ID ${id}`);
    }
  };

  const handleViewSchedule = async (record: Pengajaran) => {
    try {
      const response = await fetch('https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp');
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const result = await response.json();
      console.log("Jadwal Response:", result);
      const scheduleItems: ScheduleItem[] = Array.isArray(result.items) 
      ? result.items.filter((item: any) => item.pengajaran && item.pengajaran.id === record.id) 
      : [];

      setScheduleData(scheduleItems);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    }
  };

  const columns = [
    {
      title: 'NIPN',
      dataIndex: 'dosen',
      key: 'nipn',
      render: (dosen: { nama_depan: string; nama_belakang: string }) => `${dosen.nama_depan} ${dosen.nama_belakang}`,
    },
    {
      title: 'Nama Depan',
      dataIndex: 'dosen',
      key: 'nama_depan',
      render: (dosen: { nama_depan: string }) => dosen.nama_depan,
    },
    {
      title: 'Email',
      dataIndex: 'dosen',
      key: 'email',
      render: (dosen: { email: string }) => dosen.email,
    },
    {
      title: 'Kelas',
      dataIndex: 'kelas',
      key: 'nama_kelas',
      render: (kelas: { nama_kelas: string }) => kelas.nama_kelas,
      filters: Array.from(new Set(data.map(item => item.kelas.nama_kelas))).map(namaKelas => ({ text: namaKelas, value: namaKelas })),
      onFilter: (value: any, record: any) => record.kelas.nama_kelas === value,
    },
    {
      title: 'Mata Kuliah',
      dataIndex: 'mata_kuliah',
      key: 'nama_mata_kuliah',
      render: (mata_kuliah: { nama_mata_kuliah: string }) => mata_kuliah.nama_mata_kuliah,
      filters: Array.from(new Set(data.map(item => item.mata_kuliah.nama_mata_kuliah))).map(namaMataKuliah => ({ text: namaMataKuliah, value: namaMataKuliah })),
      onFilter: (value: any, record: any) => record.mata_kuliah.nama_mata_kuliah === value,
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'jenis',
      render: (semester: { jenis: string; tahun_ajaran: string }) => `${semester.jenis} ${semester.tahun_ajaran}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: Pengajaran) => (
        <Dropdown overlay={() => menu(record)}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const menu = (record: Pengajaran) => (
    <Menu>
      <Menu.Item key="1" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
        Edit
      </Menu.Item>
      <Menu.Item key="2" icon={<PlusOutlined />} onClick={() => handleAddPreferences(record.id)}>
        Add Preferences
      </Menu.Item>
      <Menu.Item key="3" onClick={() => handleViewSchedule(record)}>
        Lihat Jadwal
      </Menu.Item>
    </Menu>
  );

  const renderEditModal = () => (
    <Modal
      title="Edit Pengajaran"
      visible={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={null}
    >
      <Form
        initialValues={editRecord || {}}
        onFinish={handleSaveEdit}
        layout="vertical"
      >
        <Form.Item
          name="id_dosen"
          label="Dosen"
          rules={[{ required: true, message: 'Please select a dosen' }]}
        >
          <Select 
              options={dosenOptions} 
              loading={optionsLoading}
          />

        </Form.Item>
        <Form.Item
          name="id_kelas"
          label="Kelas"
          rules={[{ required: true, message: 'Please select a kelas' }]}
        >
          <Select 
              options={kelasOptions} 
              loading={optionsLoading} // Show loading state while fetching
          />

        </Form.Item>
        <Form.Item
          name="id_mata_kuliah"
          label="Mata Kuliah"
          rules={[{ required: true, message: 'Please select a mata kuliah' }]}
        >
          <Select 
          options={mataKuliahOptions} 
          loading={optionsLoading}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderScheduleModal = () => (
    <Modal
      title="Schedule"
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      width={800}
      
    >
      <Table
        columns={[
          {
            title: 'Time',
            dataIndex: 'slot',
            key: 'time',
            render: (slot: { start_time: string; end_time: string }) => `${slot.start_time} - ${slot.end_time}`,
            width: 100,
          },
          ...scheduleData.map((item, index) => ({
            title: item.slot.day,
            dataIndex: `scheduleData[${index}]`,
            key: `day${index}`,
            render: (text : any) => (text ? 'OK' : 'Conflicted'),
            width: 150,
          })),
        ]}
        dataSource={scheduleData}
        rowKey="id"
        pagination={false}
        scroll={{ x: '100%', y: 500 }}
      />
    </Modal>
  );

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Card style={{ flex: '1', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap' }}>
            <Search placeholder="Search by NIPN or Nama Depan" onSearch={handleSearch} style={{ width: '100%', maxWidth: '300px', marginBottom: '10px' }} />
            <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: '10px' }}>Add</Button>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: '100%', y: 450 }}
            rowKey="id"
          />
        </Card>
      </div>
      {renderEditModal()}
      {renderScheduleModal()}
    </div>
  );
};

export default PengajaranPage;
