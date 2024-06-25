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
  id: number; // Ensure the id property is included
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
    id: number; // Ensure the id property is included
    day: string;
    start_time: string;
    end_time: string;
  };
  ruangan: {
    nama_ruangan: string;
  };
  pengajaran: {
    dosen: {
      id: number; // Add dosen id here
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
      fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/dosen")
        .then((res) => res.json())
        .then((data) => {
          setDosen(data.items);
        });

      // Fetch slot data
      fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/slot")
        .then((res) => res.json())
        .then((data) => {
          setSlots(data.items);
        });

      // Fetch all schedule data
      fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp")
        .then((res) => res.json())
        .then((data) => {
          setAllScheduleData(data.items);
          setFilteredScheduleData(data.items); // Initially show all schedule data
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
        acc[item.slot.id] = item;
        return acc;
      }, {} as Record<number, ScheduleItem | null>);
  };

  return (
    <div>
      <Title level={2}>Preferences</Title>

      {isLoading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={16}>
          <Col xs={24} md={6}>
            <Card title="Select Instructor">
              <Select
                placeholder="Select Instructor"
                value={selectedDosenId}
                onChange={(value) => setSelectedDosenId(value)}
                style={{ width: "100%" }}
              >
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
                dataSource={slots.map((slot) => ({ key: slot.id }))}
                columns={[
                  {
                    title: "Time",
                    dataIndex: "key",
                    key: "time",
                    render: (slotId: number) =>
                      slots.find((slot) => slot.id === slotId)?.start_time,
                    fixed: "left",
                    width: 100, // Set a fixed width for the Time column
                  },
                  ...daysOfWeek.map((day) => ({
                    title: day,
                    dataIndex: "key",
                    key: day,
                    width: 150, // Set a fixed width for each day column
                    render: (slotId: number) => {
                      const scheduleItem = scheduleForDay(day)[slotId];
                      return scheduleItem ? (
                        <Tag color={scheduleItem.is_conflicted ? "red" : "green"}>
                          {scheduleItem.pengajaran.mata_kuliah.nama_mata_kuliah} (
                          {scheduleItem.pengajaran.kelas.nama_kelas})
                        </Tag>
                      ) : null;
                    },
                  })),
                ]}
                scroll={{ x: true }} // Enable horizontal scroll for the table
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
