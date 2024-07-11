// DosenPreferencesPage.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, Button, Typography, message, Spin, Space, Select, Table, Checkbox } from "antd";
import { useRouter } from "next/navigation";
import { Dosen, Slot, Preference } from "../types/type";

const { Title } = Typography;
const { Option } = Select;

export default function DosenPreferencesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dosen, setDosen] = useState<Dosen[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [preferences, setPreferences] = useState<
    { id: number; slot: { id: number } }[]
  >([]);
  const [selectedDosen, setSelectedDosen] = useState<Dosen | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dosenRes, slotsRes] = await Promise.all([
          fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/dosen?page=1&size=500"),
          fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/slot?page=1&size=500")
        ]);

        if (!dosenRes.ok || !slotsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [dosenData, slotsData] = await Promise.all([
          dosenRes.json(),
          slotsRes.json()
        ]);

        setDosen(dosenData.items);
        setSlots(slotsData.items);
      } catch (error) {
        message.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDosenChange = (dosenId: number) => {
    const selected = dosen.find(d => d.id === dosenId) || null;
    setSelectedDosen(selected);
    setPreferences(selected?.preferensi || []);
  };

  const handleCheckboxChange = (slotId: number, checked: boolean) => {
    if (!selectedDosen) return;

    const updatedPreferences = checked
        ? [...preferences, {
           
            id: preferences.length + 1,
            slot: { id: slotId },
        }]
        : preferences.filter(pref => pref.slot.id !== slotId);

    setPreferences(updatedPreferences);
};


  const handleSavePreferences = async () => {
    if (!selectedDosen) {
      message.error("Please select a lecturer");
      return;
    }

    try {
      const currentPreferences = selectedDosen.preferensi || [];

      const addPreferences = preferences.filter((pref) => !currentPreferences.some((p) => p.slot.id === pref.slot.id));
      const removePreferences = currentPreferences.filter((pref) => !preferences.some((p) => p.slot.id === pref.slot.id));

      const addPromises = addPreferences.map((pref) =>
        fetch(`https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/preferensi`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_dosen: selectedDosen.id, id_slot: pref.slot.id }),
        })
      );

      const removePromises = removePreferences.map((pref) =>
        fetch(`https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/preferensi/${pref.id}`, {
          method: "DELETE",
        })
      );

      await Promise.all([...addPromises, ...removePromises]);

      message.success("Preferences saved successfully");
    } catch (error) {
      message.error("Failed to save preferences");
    }
  };

  if (isLoading) {
    return (
      <Space style={{ width: "100%", justifyContent: "center", marginTop: "20px" }}>
        <Spin size="large" />
      </Space>
    );
  }

  const filledSlots = slots?.filter(slot => 
    dosen?.some(dosen => dosen.preferensi?.some(pref => pref.slot?.id === slot.id))
);

const displayedSlots = selectedDosen ? preferences.map(pref => pref.slot) : filledSlots;

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeSlots = Array.from(
    new Set(slots.map((slot) => `${slot.start_time} - ${slot.end_time}`))
  );

  const columns = [
    { title: "Time", dataIndex: "time", key: "time" },
    ...daysOfWeek.map((day) => ({
      title: day,
      dataIndex: day,
      key: day,
      render: (text: any, record: any) => {
        const slot = slots.find(
          (slot) =>
            slot.day === day &&
            `${slot.start_time} - ${slot.end_time}` === record.time
        );
        return slot ? (
          <Checkbox
            checked={preferences.some((pref) => pref.slot.id === slot.id)}
            onChange={(e) => handleCheckboxChange(slot.id, e.target.checked)}
          />
        ) : null;
      },
    })),
  ];

  const dataSource = timeSlots.map((time) => {
    const rowData: any = { time };
    daysOfWeek.forEach((day) => {
      const slot = slots.find(
        (slot) => slot.day === day && `${slot.start_time} - ${slot.end_time}` === time
      );
      rowData[day] = slot ? preferences.some((pref) => pref.slot.id === slot.id) : false;
    });
    return rowData;
  });


  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Card>
        <Title level={3}>Dosen Preferences</Title>
        <Select
          style={{ width: 200 }}
          placeholder="Select a lecturer"
          onChange={handleDosenChange}
        >
          {dosen.map((d) => (
            <Option key={d.id} value={d.id}>
              {d.nama_depan} {d.nama_belakang}
            </Option>
          ))}
        </Select>
      </Card>

      <Card title="Preferences">
        <Table columns={columns} dataSource={dataSource} pagination={false} rowKey="time" />
      </Card>

      <Space>
        <Button type="primary" onClick={handleSavePreferences}>
          Save Preferences
        </Button>
      </Space>
    </Space>
  );
}
