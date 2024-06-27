"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, Table, Tag, Typography, Alert, Input, Space, Button, message, Spin, Row, Col, Modal, Form, Select } from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { SessionType } from "../types/user";

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
  is_conflicted?: boolean;
}

interface EmptySlot {
  slot: {
    id: number;
    start_time: string;
    end_time: string;
    day: string;
  };
  room: {
    nama_ruangan: string;
  };
}

export default function TemporarySchedulePage() {
  const { data: session, status } = useSession() as unknown as  {data: SessionType, status : string};
  const router = useRouter();
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [filteredData, setFilteredData] = useState<ScheduleItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [emptySlots, setEmptySlots] = useState<EmptySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<EmptySlot | null>(null); 
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [hasConflicts, setHasConflicts] = useState(false);
  const [regenerateResponse, setRegenerateResponse] = useState<null | {
    best_violating_preferences: string[];
    conflict_list: string[];
  }>(null);

  useEffect(() => {
    setHasConflicts(scheduleData.some(item => item.is_conflicted));
  }, [scheduleData]);

  useEffect(() => {
    if (status === "loading") {
      return;
    } else if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp?page=1&size=500")
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
      const response = await fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp?page=1&size=500", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
      const response = await fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp?page=1&size=500");
      const data = await response.json();
      console.log(data.items)
      setScheduleData(data.items);
      setFilteredData(data.items);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      message.error("An error occurred while fetching the schedule.");
    }
  };

  const handleFixSchedule = async (scheduleItem: ScheduleItem) => {
    try {
      const response = await fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/empty?page=1&size=100");
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setEmptySlots(data.items);
      setSelectedScheduleId(scheduleItem.id);
      Modal.confirm({
        title: 'Select Empty Slot',
        content: (
          <Form onFinish={handleConfirmFix}>
            <Form.Item name="emptySlotId" label="Empty Slot">
              <Select options={data.items.map((item: any) => ({label: `${item.slot.day} ${item.slot.start_time} - ${item.slot.end_time}`, value: item.slot.id}))} />
            </Form.Item>
          </Form>
        ),
      });
    } catch (error) {
      console.error("Error fetching empty slots:", error);
      message.error("An error occurred while fetching empty slots.");
    }
  };

  const handleConfirmFix = async (values: any) => {
    try {
      const selectedEmptySlot = emptySlots.find((slot: EmptySlot) => slot.slot.id === values.emptySlotId); 
      const roomId = selectedEmptySlot?.slot.id || null;
  
      const updateResponse = await fetch(
        `https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp/${selectedScheduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_slot: values.emptySlotId,
            id_ruangan: roomId, 
          }),
        }
      );

      if (updateResponse.ok) {
        const updatedData = await updateResponse.json();
        setScheduleData(prev => prev.map(item => {
          if (item.id === updatedData.id) {
            return updatedData;
          }
          return item;
        }));
        setFilteredData(prev => prev.map(item => {
          if (item.id === updatedData.id) {
            return updatedData;
          }
          return item;
        }));
        message.success("Schedule conflict fixed successfully!");
      } else {
        throw new Error(`Failed to update schedule item with ID ${selectedScheduleId}`);
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      message.error("Error occurred while updating the schedule.");
    }
  };

  const handleGoogleCalendarIntegration = async () => {
    console.log(session.user.accessToken)
    // try {
    //   const response = await fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal", {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${session?.user.accessToken}`,
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   if (response.ok) {
    //     message.success("Integrated with Google Calendar successfully!");
    //   } else {
    //     message.error("Failed to integrate with Google Calendar.");
    //   }
    // } catch (error) {
    //   console.error("Error integrating with Google Calendar:", error);
    //   message.error("An error occurred while integrating with Google Calendar.");
    // }
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
      render: (isConflicted: boolean, record: ScheduleItem) => (
        <>
          <Tag color={isConflicted ? "red" : "green"}>
            {isConflicted ? "Conflict" : "OK"}
          </Tag>
          {/* Add Fix button directly to the cell */}
          {isConflicted && (
            <Button
              size="small"
              type="link"
              onClick={() => handleFixSchedule(record)}
            >
              Fix
            </Button>
          )}
        </>
      ),
      filters: [
        { text: 'OK', value: false },
        { text: 'Conflict', value: true }
      ],
      onFilter: (value :  any, record : any) => record.is_conflicted === value,
    },
  ];

  const onChange = (pagination : any, filters : any, sorter : any, extra : any) => {
    console.log('params', pagination, filters, sorter, extra);
  };



  return (
    <div style={{ padding: 24 }}>
      {hasConflicts && regenerateResponse && (
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
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12} lg={16}>  
          <Input.Search
            placeholder="Search by course"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>

        <Col xs={24} md={6} lg={4}> 
          <Button onClick={handleRegenerate} loading={isRegenerating} style={{ width: "100%" }}>
            Generate Jadwal
          </Button>
        </Col>

        <Col xs={24} md={6} lg={4}>
          <Button onClick={handleGoogleCalendarIntegration} style={{ width: "100%" }}>
            Simpan Jadwal
          </Button>
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
    </div>
  );
}
