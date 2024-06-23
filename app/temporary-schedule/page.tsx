"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, Table, Tag, Typography, Alert, Input, Space } from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const { Title } = Typography;

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
  pengajaran: {
    dosen: {
      nama_depan: string;
      nama_belakang: string;
    };
    kelas: {
      nama_kelas: string;
    };
    mata_kuliah: {
      nama_mata_kuliah: string;
    };
  };
  is_conflicted?: boolean;
}

export default function TemporarySchedulePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [filteredData, setFilteredData] = useState<ScheduleItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (status === "loading") {
      return;
    } else if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp")
        .then((res) => res.json())
        .then((data) => {
          setScheduleData(data.items);
          setFilteredData(data.items); // Initialize filteredData
        });
    }
  }, [status, router]);

  useEffect(() => {
    const filtered = scheduleData.filter((item) => {
      const searchMatch =
        searchValue === "" ||
        item.pengajaran.mata_kuliah.nama_mata_kuliah
          .toLowerCase()
          .includes(searchValue.toLowerCase());

      return searchMatch;
    });

    setFilteredData(filtered.length > 0 ? filtered : scheduleData);
    setCurrentPage(1);
  }, [searchValue, scheduleData]);

  const columns = [
    {
      title: "Class",
      dataIndex: ["pengajaran", "kelas", "nama_kelas"],
      key: "class",
      filters: Array.from(new Set(scheduleData.map(item => item.pengajaran.kelas.nama_kelas)))
        .map(kelas => ({ text: kelas, value: kelas })),
      onFilter: (value, record) => record.pengajaran.kelas.nama_kelas === value,
    },
    {
      title: "Course",
      dataIndex: ["pengajaran", "mata_kuliah", "nama_mata_kuliah"],
      key: "course",
      filters: Array.from(new Set(scheduleData.map(item => item.pengajaran.mata_kuliah.nama_mata_kuliah)))
        .map(course => ({ text: course, value: course })),
      onFilter: (value, record) => record.pengajaran.mata_kuliah.nama_mata_kuliah === value,
      sorter: (a, b) => a.pengajaran.mata_kuliah.nama_mata_kuliah.localeCompare(b.pengajaran.mata_kuliah.nama_mata_kuliah),
    },
    {
      title: "Instructor",
      dataIndex: ["pengajaran", "dosen"],
      key: "instructor",
      render: (dosen: any) => `${dosen.nama_depan} ${dosen.nama_belakang}`,
      filters: Array.from(new Set(scheduleData.map(item => `${item.pengajaran.dosen.nama_depan} ${item.pengajaran.dosen.nama_belakang}`)))
        .map(instructor => ({ text: instructor, value: instructor })),
      onFilter: (value, record) => `${record.pengajaran.dosen.nama_depan} ${record.pengajaran.dosen.nama_belakang}` === value,
    },
    {
      title: "Day",
      dataIndex: ["slot", "day"],
      key: "day",
      sorter: (a, b) => dayjs(a.slot.day).unix() - dayjs(b.slot.day).unix(),
    },
    {
      title: "Time",
      dataIndex: ["slot"],
      key: "time",
      render: (slot: any) => `${slot.start_time} - ${slot.end_time}`,
    },
    {
      title: "Room",
      dataIndex: ["ruangan", "nama_ruangan"],
      key: "room",
      filters: Array.from(new Set(scheduleData.map(item => item.ruangan.nama_ruangan)))
        .map(room => ({ text: room, value: room })),
      onFilter: (value, record) => record.ruangan.nama_ruangan === value,
    },
    {
      title: "Status",
      dataIndex: "is_conflicted",
      key: "status",
      render: (isConflicted: boolean) => (
        <Tag color={isConflicted ? "red" : "green"}>
          {isConflicted ? "Conflict" : "OK"}
        </Tag>
      ),
      filters: [
        { text: 'OK', value: false },
        { text: 'Conflict', value: true }
      ],
      onFilter: (value, record) => record.is_conflicted === value,
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div style={{ padding: 2 }}>
      <Space direction="vertical" style={{ marginBottom: 16, width: '100%' }}>
        <Input.Search
          placeholder="Search by course"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: '100%' }}
        />
      </Space>

      {filteredData.some((item) => item.is_conflicted) && (
        <Alert message="There are schedule conflicts!" type="warning" showIcon />
      )}
      <Card>
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
            showSizeChanger: true
          }}
          onChange={onChange}
          scroll={{ y: 'calc(100vh - 250px)' }}
        />
      </Card>
    </div>
  );
}
