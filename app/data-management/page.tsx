"use client"
import React, { useEffect, useState } from 'react';
import { Button, message, Card, Form, Tabs } from 'antd';
import TableView from '../components/TableView';
import ModalForm from '../components/ModalForm';
import SearchBar from '../components/SearchBar';
import { Kelas, Ruangan, MataKuliah, Pengajaran, DataType, Dosen, Slot } from '../types/type';
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
  const [view, setView] = useState<'kelas' | 'ruangan' | 'mata-kuliah' | 'pengajaran' | 'dosen' | 'slot'>('kelas');

  const handleSearch = (value: string) => {
    setSearchText(value); 
  };

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

  const handleOk = async (values: DataType) => {
    try {
      let url = `https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/${view}`;
      const method = isEditModal ? 'PUT' : 'POST';

      if (isEditModal && selectedRecord) {
        url = `${url}/${selectedRecord.id}`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          id: selectedRecord?.id,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
      message.success(`Data ${isEditModal ? 'updated' : 'added'} successfully`);
      fetchData(view);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error saving data:', error);
      message.error('Failed to save data');
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
    <div>
      <Card>
        <Tabs activeKey={view} onChange={(key) => setView(key as any)}>
          <TabPane tab="Kelas" key="kelas" />
          <TabPane tab="Ruangan" key="ruangan" />
          <TabPane tab="Mata Kuliah" key="mata-kuliah" />
          <TabPane tab="Pengajaran" key="pengajaran" />
          <TabPane tab="Dosen" key="dosen" />
          <TabPane tab="Slot" key="slot" />
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
      <ModalForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        form={form}
        isEdit={isEditModal}
        view={view}
      />
    </div>
  );
};

export default DataManagementPage;