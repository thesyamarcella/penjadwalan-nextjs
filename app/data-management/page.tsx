"use client"
import React, { useEffect, useState } from 'react';
import { Button, message, Card, Form, Tabs } from 'antd';
import TableView from '../components/TableView';
import ModalForm from '../components/ModalForm';
import SearchBar from '../components/SearchBar';
import { Kelas, Ruangan, MataKuliah, Pengajaran, DataType, Dosen } from '../interfaces';
import { formItemsMap, columnsMap } from '../config';

const { TabPane } = Tabs;

const DataManagementPage: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const handleSearch = (value: string) => {
    setSearchText(value); 
  };
  const [view, setView] = useState<'kelas' | 'ruangan' | 'mata-kuliah' | 'pengajaran' | 'dosen'>('kelas');

  const fetchData = async (view: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/${view}?page=1&size=500`);
      const data = await response.json();
      setData(data.items);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(view);
  }, [view]);

  const showModal = (record?: DataType) => {
    setIsEditModal(!!record);
    setSelectedRecord(record ?? null);
    setIsModalVisible(true);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };



  const filteredData = data.filter((item: any) => {
    const searchString = searchText.toLowerCase();
    return Object.values(item).some((val: any) => {
      if (typeof val === 'object' && val !== null) {
        return Object.values(val).some((nestedVal: any) => {
        
          if (typeof nestedVal === 'string' || typeof nestedVal === 'number') {
            return nestedVal.toString().toLowerCase().includes(searchString);
          }
          return false;
        });
      }
      return val.toString().toLowerCase().includes(searchString);
    });
  });
  

  return (
    <Card>
      <Tabs activeKey={view} onChange={(key) => setView(key as any)}>
        <TabPane tab="Kelas" key="kelas" />
        <TabPane tab="Ruangan" key="ruangan" />
        <TabPane tab="Mata Kuliah" key="mata-kuliah" />
        <TabPane tab="Pengajaran" key="pengajaran" />
        <TabPane tab="Dosen" key="dosen" />
      </Tabs>
      <Button type="primary" onClick={() => showModal()} style={{ marginTop: 16, marginRight:16 }}>
        +
      </Button>
      <SearchBar searchText={searchText} onSearch={handleSearch} />
      <TableView
        columns={columnsMap[view]}
        data={filteredData}
        loading={loading}
        onEdit={showModal}
      />
    </Card>
  );
};

export default DataManagementPage;
