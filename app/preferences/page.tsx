"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Card,
  Checkbox,
  Select,
  Button,
  Typography,
  message,
  Spin,
  Table,
  Row,
  Col,
  Tag,
  Space,
} from "antd";
import { useRouter } from "next/navigation";

const { Title } = Typography;

interface Dosen {
  id: number;
  nama_depan: string;
  nama_belakang: string;
  preferensi: { id: number; slot: { id: number } }[];
}

interface Slot {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
}

interface ScheduleItem {
  id: number;
  id_slot: number;
  id_ruangan: number;
  id_pengajaran: number;
  slot: {
    id: number;
    day: string;
    start_time: string;
    end_time: string;
  };
  ruangan: {
    nama_ruangan: string;
  };
  pengajaran: {
    dosen: {
      id: number;
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

export default function PreferencesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dosen, setDosen] = useState<Dosen[]>([]);
  const [selectedDosenId, setSelectedDosenId] = useState<number | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [allScheduleData, setAllScheduleData] = useState<ScheduleItem[]>([]);
  const [filteredScheduleData, setFilteredScheduleData] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (status === "loading") {
      return;
    } else if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setIsLoading(true);

      // Fetch dosen data
      fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/dosen?page=1&size=500")
        .then((res) => res.json())
        .then((data) => {
          setDosen(data.items);
        });

      // Fetch slot data
      fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/slot?page=1&size=500")
        .then((res) => res.json())
        .then((data) => {
          setSlots(data.items);
        });

      // Fetch all schedule data
      fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp?page=1&size=500")
        .then((res) => res.json())
        .then((data) => {
          setAllScheduleData(data.items);
          setFilteredScheduleData(data.items);
        })
        .finally(() => setIsLoading(false));
    }
  }, [status, router]);

  useEffect(() => {
    if (selectedDosenId) {
      setIsLoading(true);
      const selectedDosen = dosen.find((d) => d.id === selectedDosenId);
      const initialPreferences = selectedDosen?.preferensi.map((pref) => pref.slot.id) || [];
      setSelectedSlots(initialPreferences);

      // Filter schedule data for the selected dosen
      const filteredData = allScheduleData.filter(
        (item) => item.pengajaran.dosen.id === selectedDosenId
      );
      setFilteredScheduleData(filteredData);

      setIsLoading(false);
    } else {
      setFilteredScheduleData(allScheduleData); // Show all schedule data if no dosen selected
    }
  }, [selectedDosenId, dosen, allScheduleData]);

  const handleSavePreferences = async () => {
    if (!selectedDosenId) return;

    try {
      const response = await fetch(`/api/preferences?dosenId=${selectedDosenId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotIds: selectedSlots }),
      });

      if (response.ok) {
        message.success("Preferences saved successfully!");
      } else {
        message.error("Failed to save preferences.");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      message.error("An error occurred while saving preferences.");
    }
  };

  const scheduleForDay = (day: string) => {
    return filteredScheduleData
      .filter((item) => item.slot.day === day)
      .reduce((acc, item) => {
        if (!acc[item.slot.start_time]) {
          acc[item.slot.start_time] = [];
        }
        acc[item.slot.start_time].push(item);
        return acc;
      }, {} as Record<string, ScheduleItem[]>);
  };

  const timeSlots = Array.from(new Set(slots.map(slot => slot.start_time))).sort();

  return (
    <div>
      {isLoading ? (
        <Spin size="large" style={{ width: "full", display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }} />
      ) : (
        <Row gutter={16}>
          <Col xs={24} md={6}>
            <Card title="Select Instructor">
            <Select
              placeholder="Select Instructor"
              value={selectedDosenId || "all"} 
              onChange={(value) => setSelectedDosenId(value !== "all" ? Number(value) : null)} 
              style={{ width: "100%" }}
            >
              <Select.Option key="all" value="all">
                Show All
              </Select.Option>
              {Array.isArray(dosen) && dosen.length > 0 ? (
                dosen.map((dosen) => (
                  <Select.Option key={dosen.id} value={dosen.id}>
                    {`${dosen.nama_depan} ${dosen.nama_belakang}`}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled>No instructors available</Select.Option>
              )}
            </Select>



            </Card>
            {selectedDosenId && (
              <Card title="Preferences" style={{ marginTop: 16 }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {slots.map((slot) => (
                    <Checkbox
                      key={slot.id}
                      checked={selectedSlots.includes(slot.id)}
                      onChange={(e) => {
                        setSelectedSlots(
                          e.target.checked
                            ? [...selectedSlots, slot.id]
                            : selectedSlots.filter((id) => id !== slot.id)
                        );
                      }}
                    >
                      {`${slot.day} ${slot.start_time} - ${slot.end_time}`}
                    </Checkbox>
                  ))}
                  <Button type="primary" onClick={handleSavePreferences}>
                    Save Preferences
                  </Button>
                </Space>
              </Card>
            )}
          </Col>
          <Col xs={24} md={18}>
            <Card title="Temporary Schedule">
              <Table
                pagination={false}
                dataSource={timeSlots.map((time, index) => ({ key: index, time }))}
                columns={[
                  {
                    title: "Time",
                    dataIndex: "time",
                    key: "time",
                    render: (time: string) => time,
                    fixed: "left",
                    width: 100,
                  },
                  ...daysOfWeek.map((day) => ({
                    title: day,
                    dataIndex: "time",
                    key: day,
                    width: 150,
                    render: (time: string) => {
                      const scheduleItems = scheduleForDay(day)[time] || [];
                      return (
                        <>
                          {scheduleItems.map((item) => (
                            <Tag key={item.id} color={item.is_conflicted ? "red" : "green"}>
                              {item.pengajaran.mata_kuliah.nama_mata_kuliah}
                              ({item.pengajaran.kelas.nama_kelas})
                            </Tag>
                          ))}
                        </>
                      );
                    },
                  })),
                ]}
                scroll={{ x: true }}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
