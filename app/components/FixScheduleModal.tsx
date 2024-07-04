// components/FixScheduleModal.tsx

import React from "react";
import { Modal, Input, Select, Table, Button, Space } from "antd";
import { EmptySlot } from "../types/type";

interface FixScheduleModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  emptySlots: EmptySlot[];
  filteredEmptySlots: EmptySlot[];
  setFilteredEmptySlots: (slots: EmptySlot[]) => void;
  selectedRoomFilter: string | null;
  setSelectedRoomFilter: (filter: string | null) => void;
  selectedDayFilter: string | null;
  setSelectedDayFilter: (filter: string | null) => void;
  currentEmptySlotPage: number;
  setCurrentEmptySlotPage: (page: number) => void;
  emptySlotPageSize: number;
  setEmptySlotPageSize: (size: number) => void;
  handleConfirmFix: (emptySlotId: number, roomId: number) => void;
}

const FixScheduleModal: React.FC<FixScheduleModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  emptySlots,
  filteredEmptySlots,
  setFilteredEmptySlots,
  selectedRoomFilter,
  setSelectedRoomFilter,
  selectedDayFilter,
  setSelectedDayFilter,
  currentEmptySlotPage,
  setCurrentEmptySlotPage,
  emptySlotPageSize,
  setEmptySlotPageSize,
  handleConfirmFix,
}) => {
  const emptySlotColumns = [
    {
      title: "Day",
      dataIndex: ["slot", "day"],
      key: "day",
    },
    {
      title: "Time",
      dataIndex: ["slot"],
      key: "time",
      render: (slot: any) => `${slot.start_time} - ${slot.end_time}`,
    },
    {
      title: "Room",
      dataIndex: ["room", "nama_ruangan"],
      key: "room",
    },
    {
      title: "Building",
      dataIndex: ["room", "nama_gedung"],
      key: "building",
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: EmptySlot) => (
        <Button
          type="primary"
          onClick={() => handleConfirmFix(record.slot.id, record.room.id)}
        >
          Select
        </Button>
      ),
    },
  ];

  const filterEmptySlots = () => {
    const filtered = emptySlots.filter((item) => {
      const roomMatch = selectedRoomFilter === null || item.room.nama_ruangan === selectedRoomFilter;
      const dayMatch = selectedDayFilter === null || item.slot.day === selectedDayFilter;
      return roomMatch && dayMatch;
    });

    setFilteredEmptySlots(filtered);
    setCurrentEmptySlotPage(1);
  };

  React.useEffect(() => {
    filterEmptySlots();
  }, [emptySlots, selectedRoomFilter, selectedDayFilter]);

  return (
    <Modal
      title="Select Empty Slot and Room"
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input.Search
          placeholder="Search by room"
          onChange={(e) => setSelectedRoomFilter(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Filter by Day"
          allowClear
          onChange={(value) => setSelectedDayFilter(value)}
        >
          {Array.from(new Set(emptySlots.map(item => item.slot.day))).map(day => (
            <Select.Option key={day} value={day}>{day}</Select.Option>
          ))}
        </Select>
      </Space>

      <Table
        columns={emptySlotColumns}
        dataSource={filteredEmptySlots} 
        rowKey={(record) => `${record.slot.id}-${record.room.id}`}
        pagination={{
          current: currentEmptySlotPage,
          pageSize: emptySlotPageSize,
          total: filteredEmptySlots.length,
          onChange: (page, newPageSize) => {
            setCurrentEmptySlotPage(page);
            setEmptySlotPageSize(newPageSize);
          },
        }}
      />
    </Modal>
  );
};

export default FixScheduleModal;
