import React from 'react';
import { Table, Typography } from 'antd';
import { Slot, ScheduleItem } from '../types/type'; // Adjust the import path as necessary

const { Title } = Typography;

interface ScheduleTableProps {
  slots: Slot[];
  scheduleData: ScheduleItem[];
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ slots, scheduleData }) => {
  const groupedSchedule = scheduleData.reduce((acc, item) => {
    const key = `${item.slot.start_time}-${item.slot.end_time}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
  ];

  const dataSource = Object.entries(groupedSchedule).map(([time, items], index) => ({
    key: index,
    time,
    details: (
      <>
        {items.map((item) => (
          <div key={item.id} style={{ marginBottom: '10px' }}>
            <div>{item.pengajaran.mata_kuliah.nama_mata_kuliah}</div>
            <div>{item.pengajaran.kelas.nama_kelas}</div>
            <div>{`${item.pengajaran.dosen.nama_depan} ${item.pengajaran.dosen.nama_belakang}`}</div>
            <div>{item.ruangan.nama_ruangan}</div>
          </div>
        ))}
      </>
    ),
  }));

  return (
    <>
      <Title level={4}>Schedule</Title>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </>
  );
};

export default ScheduleTable;
