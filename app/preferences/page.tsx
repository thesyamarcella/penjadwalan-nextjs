// PreferencesPage.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, Button, Typography, message, Spin, Space } from "antd";
import { useRouter } from "next/navigation";
import TemporarySchedule from "../components/TemporarySchedule";
import PreferenceCheckbox from "../components/PreferencesCheckbox"; 
import { Dosen, Kelas, Ruangan, Slot, ScheduleItem } from "../types/type";

const { Title } = Typography;


export default function PreferencesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dosen, setDosen] = useState<Dosen[]>([]);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [ruangan, setRuangan] = useState<Ruangan[]>([]);
  const [selectedDosenId, setSelectedDosenId] = useState<number | null>(null);
  const [selectedKelasId, setSelectedKelasId] = useState<number | null>(null);
  const [selectedRuanganId, setSelectedRuanganId] = useState<number | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [allScheduleData, setAllScheduleData] = useState<ScheduleItem[]>([]);
  const [filteredScheduleData, setFilteredScheduleData] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dosenRes, slotsRes, scheduleRes, kelasRes, ruanganRes] = await Promise.all([
          fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/dosen?page=1&size=500"),
          fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/slot?page=1&size=500"),
          fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp?page=1&size=500"),
          fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/kelas?page=1&size=500"),
          fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/ruangan?page=1&size=500"),
        ]);

        if (!dosenRes.ok || !slotsRes.ok || !scheduleRes.ok || !kelasRes.ok || !ruanganRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [dosenData, slotsData, scheduleData, kelasData, ruanganData] = await Promise.all([
          dosenRes.json(),
          slotsRes.json(),
          scheduleRes.json(),
          kelasRes.json(),
          ruanganRes.json(),
        ]);

        setDosen(dosenData.items);
        setSlots(slotsData.items);
        setAllScheduleData(scheduleData.items);
        setKelas(kelasData.items);
        setRuangan(ruanganData.items);
      } catch (error) {
        message.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredScheduleData(
      allScheduleData.filter((item) => {
        const matchDosen = selectedDosenId ? item.pengajaran.dosen.id === selectedDosenId : true;
        const matchKelas = selectedKelasId ? item.pengajaran.kelas.id === selectedKelasId : true;
        const matchRuangan = selectedRuanganId ? item.ruangan.id === selectedRuanganId : true;
        return matchDosen && matchKelas && matchRuangan;
      })
    );
  }, [selectedDosenId, selectedKelasId, selectedRuanganId, allScheduleData]);

  const handleDosenChange = (dosenId: number | null) => {
    setSelectedDosenId(dosenId);
  };

  const handleKelasChange = (kelasId: number | null) => {
    setSelectedKelasId(kelasId);
  };

  const handleRuanganChange = (ruanganId: number | null) => {
    setSelectedRuanganId(ruanganId);
  };

  const handleSlotChange = (slotId: number, checked: boolean) => {
    setSelectedSlots((prevSelectedSlots) =>
      checked ? [...prevSelectedSlots, slotId] : prevSelectedSlots.filter((id) => id !== slotId)
    );
  };

  const handleSavePreferences = async () => {
    try {
      const response = await fetch(`/api/dosen/preferences/${selectedDosenId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedSlots,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

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

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Card>
        <Title level={3}>Set Preferences</Title>
        <TemporarySchedule
          slots={slots}
          filteredScheduleData={filteredScheduleData}
          dosen={dosen}
          kelas={kelas}
          ruangan={ruangan}
          selectedDosenId={selectedDosenId}
          selectedKelasId={selectedKelasId}
          selectedRuanganId={selectedRuanganId}
          onDosenChange={handleDosenChange}
          onKelasChange={handleKelasChange}
          onRuanganChange={handleRuanganChange}
        />
      </Card>

      <Card title="Preferences">
        <Space direction="vertical" style={{ width: "100%" }}>
          {slots.map((slot) => (
            <PreferenceCheckbox
              key={slot.id}
              slotId={slot.id}
              day={slot.day}
              startTime={slot.start_time}
              endTime={slot.end_time}
              checked={selectedSlots.includes(slot.id)}
              onChange={(checked) => handleSlotChange(slot.id, checked)}
            />
          ))}
        </Space>
      </Card>

      <Space>
        <Button type="primary" onClick={handleSavePreferences}>
          Save Preferences
        </Button>
      </Space>
    </Space>
  );
}