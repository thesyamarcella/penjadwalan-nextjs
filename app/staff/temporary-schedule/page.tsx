"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Alert,
  Input,
  Space,
  Button,
  message,
  Modal,
  Form,
  Row,
  Col,
  Select,
} from "antd";
import {
  TablePaginationConfig,
  SorterResult,
  FilterValue,
} from "antd/es/table/interface";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { SessionType } from "../../types/user";
import { ScheduleItem, EmptySlot, ColumnItem } from "../../types/type";
import {
  EditOutlined,
  GoogleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import ExportToPDF from "@/app/components/ExportToPdf";
import ExportToExcel from "@/app/components/ExportToExcel";


const { Title } = Typography;

export default function TemporarySchedulePage() {
  const { data: session, status } = useSession() as unknown as {
    data: SessionType;
    status: string;
  };
  const [googleCalendarToken, setGoogleCalendarToken] = useState(null);
  const router = useRouter();
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [filteredData, setFilteredData] = useState<ScheduleItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [emptySlots, setEmptySlots] = useState<EmptySlot[]>([]);
  const [filteredEmptySlots, setFilteredEmptySlots] = useState<EmptySlot[]>([]);
  const [currentEmptySlotPage, setCurrentEmptySlotPage] = useState(1);
  const [emptySlotPageSize, setEmptySlotPageSize] = useState(5);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );
  const [hasConflicts, setHasConflicts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(
    null
  );

  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(
    null
  );
  const [regenerateResponse, setRegenerateResponse] = useState<null | {
    best_violating_preferences: string[];
    conflict_list: string[];
  }>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setHasConflicts(scheduleData.some((item) => item.is_conflicted));
  }, [scheduleData]);

  useEffect(() => {
    if (status === "loading") {
      return;
    } else if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetch(
        "https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp?page=1&size=500"
      )
        .then((res) => res.json())
        .then((data) => {
          setScheduleData(data.items);
          setFilteredData(data.items);
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
      const response = await fetch(
        "https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp?page=1&size=500",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRegenerateResponse(data);
        await fetchScheduleData();

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

  const fetchScheduleData = async () => {
    try {
      const response = await fetch(
        "https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp?page=1&size=500"
      );
      const data = await response.json();
      console.log(data.items);
      setScheduleData(data.items);
      setFilteredData(data.items);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      message.error("An error occurred while fetching the schedule.");
    }
  };

  const handleFixSchedule = async (scheduleItem: ScheduleItem) => {
    try {
      const response = await fetch(
        "https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/empty"
      );
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      const emptySlots = data || [];
      setEmptySlots(emptySlots);
      setSelectedScheduleId(scheduleItem.id);
      setIsModalVisible(true);
      setSelectedSchedule(scheduleItem); // Store the selected schedule
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching empty slots:", error);
      message.error("An error occurred while fetching empty slots.");
    }
  };

  const handleConfirmFix = async (emptySlotId: number, roomId: number) => {
    try {
      const updateResponse = await fetch(
        `https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp/${selectedScheduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_slot: emptySlotId,
            id_ruangan: roomId,
          }),
        }
      );

      if (updateResponse.ok) {
        const updatedData = await updateResponse.json();
        setScheduleData((prev) =>
          prev.map((item) => (item.id === updatedData.id ? updatedData : item))
        );
        setFilteredData((prev) =>
          prev.map((item) => (item.id === updatedData.id ? updatedData : item))
        );
        message.success("Schedule conflict fixed successfully!");
        setIsModalVisible(false);
      } else {
        throw new Error(
          `Failed to update schedule item with ID ${selectedScheduleId}`
        );
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      message.error("Error occurred while updating the schedule.");
    }
  };

  const handleGoogleCalendarIntegration = async () => {
    setIsSaving(true); // Show loading state
    setSaveStatus(null); // Clear previous messages

    try {
      const response = await fetch(
        "https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6InlhMjkuYTBBWG9vQ2dzblBvZE1YN1lNQUNVWVpoU0JPUGUtWEVOUVJYRW81YkRzN3Z4Z2N6YXAtTFpvQUVrUm1RZDRkQjQtZWN4R3Y0WHFJR1dDS2xqZ0pfQWFxRWdZQm1TT2I4SkQ4UWU3WUVHcGZZcUtxT0cyYjI2VDNyS3FMdmpWdmJ6WUFKalFJNWs5clJsYWZKNEJDQjBHdmx0LUdmQXdzV1BRekl3QWFDZ1lLQVJZU0FSTVNGUUhHWDJNaVZXeWtCUlBzXzNGdkEyQnBxbk5zeHcwMTcxIiwicmVmcmVzaF90b2tlbiI6IjEvLzA0TXBmWVFJZC1Ca1RDZ1lJQVJBQUdBUVNOd0YtTDlJclNJREVUMHVrRHNlNkd5NzBoa0gtckRpb2tfV1F6dWtPX2tDZ3RzZzVwRG8tOXFIOHpuTkhJaHliOHVfdVVGRmZreVEiLCJ0b2tlbl91cmkiOiJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsInNjb3BlcyI6WyJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL2NhbGVuZGFyLmV2ZW50cyIsImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvdXNlcmluZm8ucHJvZmlsZSIsIm9wZW5pZCIsImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvdXNlcmluZm8uZW1haWwiXSwidXNlcm5hbWUiOiJUaGVzeWEiLCJ1c2VySWQiOiJ0aGVzeWFtYXJjZWxsYUBnbWFpbC5jb20iLCJwcm9maWxlX3BpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMSlJfbm5rSFhVRUwxelpUVkQzMWFpMTZ1YjBiUHN1OTFFWTVMWmQwaHU1SEdFX2VfQj1zOTYtYyIsImV4cCI6MTcyMTM2OTc4Nn0.NhpDT5-g8qaEaeuFg3TZK2FeEOpRxWOQ-QH_GZvWiDA`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setSaveStatus("success"); // Mark success
        message.success("Integrated with Google Calendar successfully!");
      } else {
        setSaveStatus("error"); // Mark error
        message.error("Failed to integrate with Google Calendar.");
      }
    } catch (error) {
      setSaveStatus("error"); // Mark error
      console.error("Error integrating with Google Calendar:", error);
      message.error(
        "An error occurred while integrating with Google Calendar."
      );
    } finally {
      setIsSaving(false); // Hide loading state
    }
  };

  const emptySlotColumns: ColumnItem[] = [
    {
      title: "Day",
      dataIndex: ["slot", "day"],
      key: "day",
      filters: Array.from(new Set(emptySlots.map((item) => item.slot.day))).map(
        (day) => ({ text: day, value: day })
      ),
      onFilter: (value, record) => record.slot.day === value,
    },
    {
      title: "Time",
      dataIndex: ["slot"],
      key: "time",
      render: (slot: any) => `${slot.start_time} - ${slot.end_time}`,
      filters: Array.from(
        new Set(
          emptySlots.map(
            (item) => `${item.slot.start_time} - ${item.slot.end_time}`
          )
        )
      ).map((timeRange) => ({ text: timeRange, value: timeRange })),
      onFilter: (value, record) =>
        `${record.slot.start_time} - ${record.slot.end_time}` === value,
    },
    {
      title: "Room",
      dataIndex: ["room", "nama_ruangan"],
      key: "room",
      filters: Array.from(
        new Set(emptySlots.map((item) => item.room.nama_ruangan))
      ).map((roomName) => ({ text: roomName, value: roomName })),
      onFilter: (value, record) => record.room.nama_ruangan === value,
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
      dataIndex: "",
    },
  ];

  const columns: ColumnItem[] = [
    {
      title: "Class",
      dataIndex: ["pengajaran", "kelas", "nama_kelas"],
      key: "class",
      filters: Array.from(
        new Set(scheduleData.map((item) => item.pengajaran.kelas.nama_kelas))
      ).map((kelas) => ({ text: kelas, value: kelas })),
      onFilter: (value, record) => record.pengajaran.kelas.nama_kelas === value,
    },
    {
      title: "Course",
      dataIndex: ["pengajaran", "mata_kuliah", "nama_mata_kuliah"],
      key: "course",
      filters: Array.from(
        new Set(
          scheduleData.map(
            (item) => item.pengajaran.mata_kuliah.nama_mata_kuliah
          )
        )
      ).map((course) => ({ text: course, value: course })),
      onFilter: (value, record) =>
        record.pengajaran.mata_kuliah.nama_mata_kuliah === value,
      sorter: (a, b) =>
        a.pengajaran.mata_kuliah.nama_mata_kuliah.localeCompare(
          b.pengajaran.mata_kuliah.nama_mata_kuliah
        ),
    },
    {
      title: "Instructor",
      dataIndex: ["pengajaran", "dosen"],
      key: "instructor",
      render: (dosen: any) => `${dosen.nama_depan} ${dosen.nama_belakang}`,
      filters: Array.from(
        new Set(
          scheduleData.map(
            (item) =>
              `${item.pengajaran.dosen.nama_depan} ${item.pengajaran.dosen.nama_belakang}`
          )
        )
      ).map((instructor) => ({ text: instructor, value: instructor })),
      onFilter: (value, record) =>
        `${record.pengajaran.dosen.nama_depan} ${record.pengajaran.dosen.nama_belakang}` ===
        value,
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
      filters: Array.from(
        new Set(scheduleData.map((item) => item.ruangan.nama_ruangan))
      ).map((room) => ({ text: room, value: room })),
      onFilter: (value, record) => record.ruangan.nama_ruangan === value,
    },
    {
      title: "Status",
      dataIndex: "is_conflicted",
      key: "status",
      render: (isConflicted: boolean, record: ScheduleItem) => (
        <>
          <Tag color={isConflicted ? "red" : "green"}>
            {isConflicted ? "Conflict" : "OK"}
          </Tag>
          <Button
            size="small"
            type="link"
            onClick={() => handleFixSchedule(record)}
            icon={isConflicted ? null : <EditOutlined />}
          >
            {isConflicted ? "Fix" : "Edit"}
          </Button>
        </>
      ),
      filters: [
        { text: "OK", value: false },
        { text: "Conflict", value: true },
      ],
      onFilter: (value, record) => record.is_conflicted === value,
    },
  ];

  const onChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ScheduleItem> | SorterResult<ScheduleItem>[],
    extra: any
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div style={{ padding: 24 }}>
      {!hasConflicts && ( // New conditional for "No Conflict" message
        <Alert
          message="No schedule conflicts!"
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      {hasConflicts &&
        regenerateResponse && ( // Existing code for conflicts
          <Alert
            message="There are schedule conflicts!"
            description={
              <ul>
                {regenerateResponse.conflict_list.map((conflict, index) => (
                  <li key={index}>{conflict}</li>
                ))}
              </ul>
            }
            type="warning"
            showIcon
            closable
            style={{ marginBottom: 16 }}
          />
        )}

      <Row gutter={16}>
        <Col xs={24}>
          <Card>
          <Row justify="start" align="middle" gutter={16} style={{ marginBottom: 16 }}>
  <Col xs={24} md={12} lg={16}>
    <Input.Search
      placeholder="Search by course"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      style={{ width: "100%" }}
    />
  </Col>

  {/* Spacer */}
  <Col xs={0} sm={0} md={1} lg={1}>
    <div style={{ width: '100%' }}></div> {/* This will create a gap */}
  </Col>

  {/* Buttons */}
  <Col xs={24} sm={8} md={3} lg={2}>
    <Button 
      onClick={handleRegenerate} 
      loading={isRegenerating} 
      icon={<ReloadOutlined />} // Ikon untuk Generate Jadwal
      style={{ width: "100%" }}
    >
      Generate
    </Button>
  </Col>

  <Col xs={24} sm={8} md={3} lg={2}>
    <Button
      onClick={handleGoogleCalendarIntegration}
      loading={isSaving}
      icon={<GoogleOutlined />}
      style={{ width: "100%" }}
    >
      Simpan
    </Button>
    {saveStatus === "success" && (
      <Alert
        message="Jadwal berhasil disimpan!"
        type="success"
        style={{ marginTop: 8 }}
      />
    )}
    {saveStatus === "error" && (
      <Alert
        message="Gagal menyimpan jadwal!"
        type="error"
        style={{ marginTop: 8 }}
      />
    )}
  </Col>

  {/* Export Buttons */}
  <Col xs={24} sm={8} md={6} lg={2}>
    <Space direction="horizontal" size={8} style={{width:'100%'}}> 
      <ExportToPDF data={filteredData} />
      <ExportToExcel data={filteredData} />
    </Space>
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
              onChange={onChange}
              scroll={{ y: "calc(100vh - 250px)" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Modal for Fix Schedule */}
      <Modal
        title={
          selectedSchedule?.is_conflicted
            ? `Fix Conflict for: ${selectedSchedule?.pengajaran?.mata_kuliah?.nama_mata_kuliah}`
            : `Ubah Jadwal  ${selectedSchedule?.pengajaran?.mata_kuliah?.nama_mata_kuliah} kelas  ${selectedSchedule?.pengajaran?.kelas?.nama_kelas} ke Hari:`
        }
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedSchedule(null);
        }}
        footer={null}
      >
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
    </div>
  );
}
