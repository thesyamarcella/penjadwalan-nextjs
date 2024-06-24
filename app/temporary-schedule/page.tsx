"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, Table, Tag, Typography, Alert, Input, Space, Button, message, Spin, Row, Col } from "antd";
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
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateResponse, setRegenerateResponse] = useState<null | {
    best_violating_preferences: string[];
    conflict_list: string[];
  }>(null);

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

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const response = await fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRegenerateResponse(data);
        message.success("Schedule regenerated successfully!");
      } else {
        message.error("Failed to regenerate schedule.");
      }
    } catch (error) {
      console.error("Error regenerating schedule:", error);
      message.error("An error occurred while regenerating the schedule.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleGoogleCalendarIntegration = async () => {
    try {
      const response = await fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        message.success("Integrated with Google Calendar successfully!");
      } else {
        message.error("Failed to integrate with Google Calendar.");
      }
    } catch (error) {
      console.error("Error integrating with Google Calendar:", error);
      message.error("An error occurred while integrating with Google Calendar.");
    }
  };

  const columns = [
    {
      title: "Class",
      dataIndex: ["pengajaran", "kelas", "nama_kelas"],
      key: "class",
      filters: Array.from(new Set(scheduleData.map(item => item.pengajaran.kelas.nama_kelas)))
        .map(kelas => ({ text: kelas, value: kelas })),
      onFilter: (value : any, record : any) => record.pengajaran.kelas.nama_kelas === value,
    },
    {
      title: "Course",
      dataIndex: ["pengajaran", "mata_kuliah", "nama_mata_kuliah"],
      key: "course",
      filters: Array.from(new Set(scheduleData.map(item => item.pengajaran.mata_kuliah.nama_mata_kuliah)))
        .map(course => ({ text: course, value: course })),
      onFilter: (value :  any, record : any) => record.pengajaran.mata_kuliah.nama_mata_kuliah === value,
      sorter: (a : any, b : any) => a.pengajaran.mata_kuliah.nama_mata_kuliah.localeCompare(b.pengajaran.mata_kuliah.nama_mata_kuliah),
    },
    {
      title: "Instructor",
      dataIndex: ["pengajaran", "dosen"],
      key: "instructor",
      render: (dosen: any) => `${dosen.nama_depan} ${dosen.nama_belakang}`,
      filters: Array.from(new Set(scheduleData.map(item => `${item.pengajaran.dosen.nama_depan} ${item.pengajaran.dosen.nama_belakang}`)))
        .map(instructor => ({ text: instructor, value: instructor })),
      onFilter: (value :  any, record : any) => `${record.pengajaran.dosen.nama_depan} ${record.pengajaran.dosen.nama_belakang}` === value,
    },
    {
      title: "Day",
      dataIndex: ["slot", "day"],
      key: "day",
      sorter: (a : any, b : any) => dayjs(a.slot.day).unix() - dayjs(b.slot.day).unix(),
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
      onFilter: (value :  any, record : any) => record.ruangan.nama_ruangan === value,
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
      onFilter: (value :  any, record : any) => record.is_conflicted === value,
    },
  ];

  const onChange = (pagination : any, filters : any, sorter : any, extra : any) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ marginBottom: 16, width: '100%' }}>
        <Input.Search
          placeholder="Search by course"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: '100%' }}
        />
      </Space>

      <Row gutter={16}>
        <Col span={6}>
          <Card title="Regenerate Schedule">
            <Button type="primary" onClick={handleRegenerate} loading={isRegenerating}>
              Regenerate Schedule
            </Button>
            {regenerateResponse && (
              <div style={{ marginTop: 16, maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
                <Title level={4}>Best Violating Preferences:</Title>
                <ul>
                  {regenerateResponse.best_violating_preferences.map((pref, index) => (
                    <li key={index}>{pref}</li>
                  ))}
                </ul>
                <Title level={4}>Conflict List:</Title>
                <ul>
                  {regenerateResponse.conflict_list.map((conflict, index) => (
                    <li key={index}>{conflict}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <Card title="Integrate with Google Calendar" style={{ marginTop: 16 }}>
            <Button type="primary" onClick={handleGoogleCalendarIntegration}>
              Integrate with Google Calendar
            </Button>
          </Card>
        </Col>

        <Col span={18}>
          {filteredData.some((item) => item.is_conflicted) && (
            <Alert message="There are schedule conflicts!" type="warning" showIcon style={{ marginBottom: 16 }} />
          )}
          <Card style={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
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
        </Col>
      </Row>
    </div>
  );
}
