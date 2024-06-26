"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Typography,
  Input,
  Row,
  Col,
  Statistic,
  Button,
  Radio,
  RadioChangeEvent,
} from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import type { ColumnsType } from 'antd/es/table';
import { ScheduleOutlined, TableOutlined } from '@ant-design/icons';
import TimetableView from "../components/TimetableView";

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
    id: number;
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
}


export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [counts, setCounts] = useState({
    dosen: 0,
    kelas: 0,
    mataKuliah: 0,
    semester: 0,
    ruangan: 0,
  });
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [filteredData, setFilteredData] = useState<ScheduleItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    if (status === "loading") {
      return;
    } else if (status === "unauthenticated") {
      router.push("/login");
    } else {
      Promise.all([
        fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/dosen").then((res) => res.json()),
        fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/kelas").then((res) => res.json()),
        fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/mata_kuliah").then((res) => res.json()),
        fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/semester").then((res) => res.json()),
        fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/ruangan").then((res) => res.json()),
        fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp?page=1&size=500").then((res) => res.json()),
      ])
        .then(([dosenData, kelasData, mataKuliahData, semesterData, ruanganData, scheduleData]) => {
          setCounts({
            dosen: dosenData.total_elements,
            kelas: kelasData.total_elements,
            mataKuliah: mataKuliahData.total_elements,
            semester: semesterData.total_elements,
            ruangan: ruanganData.total_elements,
          });
          console.log(scheduleData)
          setScheduleData(scheduleData.items);
          setFilteredData(scheduleData.items);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
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

  const columns: ColumnsType<ScheduleItem> = [
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
      render: (dosen) => `${dosen.nama_depan} ${dosen.nama_belakang}`,
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
      render: (slot) => `${slot.start_time} - ${slot.end_time}`,
    },
    {
      title: "Room",
      dataIndex: ["ruangan", "nama_ruangan"],
      key: "room",
      filters: Array.from(new Set(scheduleData.map(item => item.ruangan.nama_ruangan)))
        .map(room => ({ text: room, value: room })),
      onFilter: (value, record) => record.ruangan.nama_ruangan === value,
    },
  ];

  const handleTableChange = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setCurrentPage(pagination.current!);
  };

  const handleViewModeChange = (e: RadioChangeEvent) => {
    setViewMode(e.target.value);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Dashboard</Title>

      {/* Data Count Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {Object.keys(counts).map(key => (
          <Col key={key} xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic title={key} value={counts[key]} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* View Mode Switch */}
      <Radio.Group value={viewMode} onChange={handleViewModeChange} style={{ marginBottom: 16 }}>
        <Radio.Button value="table">
          <TableOutlined /> Table View
        </Radio.Button>
        <Radio.Button value="timetable">
          <ScheduleOutlined /> Timetable View
        </Radio.Button>
      </Radio.Group>

      {/* Schedule Table or Timetable View */}
      <Card title="Jadwal">
        {viewMode === "table" ? (
          <>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} md={12} lg={16}>
                <Input.Search
                  placeholder="Search by course"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
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
              onChange={handleTableChange}
              scroll={{ y: "calc(100vh - 250px)" }}
            />
          </>
        ) : (
          <TimetableView scheduleData={scheduleData} />
        )}
      </Card>
    </div>
  );
}
