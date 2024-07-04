import React from 'react';
import { Table, Button, Tag } from 'antd';
import { ScheduleItem, ColumnItem } from '../types/type';

interface ScheduleTableProps {
  scheduleData: ScheduleItem[];
  filteredData: ScheduleItem[];
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handleFixSchedule: (scheduleItem: ScheduleItem) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({
  scheduleData,
  filteredData,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  handleFixSchedule,
}) => {
  const columns: ColumnItem[] = [
    {
      title: 'Class',
      dataIndex: 'pengajaran.kelas.nama_kelas',
      key: 'class',
      filters: Array.from(new Set(scheduleData.map((item) => item.pengajaran.kelas.nama_kelas))).map((kelas) => ({ text: kelas, value: kelas })),
      onFilter: (value, record) => record.pengajaran.kelas.nama_kelas === value,
    },
    {
      title: 'Course',
      dataIndex: 'pengajaran.mata_kuliah.nama_mata_kuliah',
      key: 'course',
      filters: Array.from(new Set(scheduleData.map((item) => item.pengajaran.mata_kuliah.nama_mata_kuliah))).map((course) => ({
        text: course,
        value: course,
      })),
      onFilter: (value, record) => record.pengajaran.mata_kuliah.nama_mata_kuliah === value,
      sorter: (a, b) => a.pengajaran.mata_kuliah.nama_mata_kuliah.localeCompare(b.pengajaran.mata_kuliah.nama_mata_kuliah),
    },
    {
      title: 'Instructor',
      dataIndex: 'pengajaran.dosen',
      key: 'instructor',
      render: (dosen: any) => `${dosen.nama_depan} ${dosen.nama_belakang}`,
      filters: Array.from(
        new Set(scheduleData.map((item) => `${item.pengajaran.dosen.nama_depan} ${item.pengajaran.dosen.nama_belakang}`))
      ).map((instructor) => ({ text: instructor, value: instructor })),
      onFilter: (value, record) => `${record.pengajaran.dosen.nama_depan} ${record.pengajaran.dosen.nama_belakang}` === value,
    },
    {
      title: 'Day',
      dataIndex: 'slot.day',
      key: 'day',
      sorter: (a, b) => a.slot.day.localeCompare(b.slot.day),
    },
    {
      title: 'Time',
      dataIndex: 'slot',
      key: 'time',
      render: (slot: any) => `${slot.start_time} - ${slot.end_time}`,
    },
    {
      title: 'Room',
      dataIndex: 'ruangan.nama_ruangan',
      key: 'room',
      filters: Array.from(new Set(scheduleData.map((item) => item.ruangan.nama_ruangan))).map((room) => ({ text: room, value: room })),
      onFilter: (value, record) => record.ruangan.nama_ruangan === value,
    },
    {
      title: 'Status',
      dataIndex: 'is_conflicted',
      key: 'status',
      render: (isConflicted: boolean, record: ScheduleItem) => (
        <>
          <Tag color={isConflicted ? 'red' : 'green'}>{isConflicted ? 'Conflict' : 'OK'}</Tag>
          {isConflicted && (
            <Button size="small" type="link" onClick={() => handleFixSchedule(record)}>
              Fix
            </Button>
          )}
        </>
      ),
      filters: [
        { text: 'OK', value: false },
        { text: 'Conflict', value: true },
      ],
      onFilter: (value, record) => record.is_conflicted === value,
    },
  ];

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: filteredData.length,
        onChange: (page, newPageSize) => {
          setCurrentPage(page);
          setPageSize(newPageSize);
        },
        showSizeChanger: true,
      }}
      onChange={onChange}
      scroll={{ y: 'calc(100vh - 250px)' }}
    />
  );
};

export default ScheduleTable;
