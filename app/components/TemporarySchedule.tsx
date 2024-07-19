// TemporarySchedule.tsx
import React from "react";
import { Table, Tag, Card, Select, Space, Form } from "antd";
import { Dosen, Kelas, Ruangan, Slot, ScheduleItem } from "../types/type";
import { useMediaQuery } from 'react-responsive';


interface TemporaryScheduleProps {
  slots: Slot[];
  filteredScheduleData: ScheduleItem[];
  dosen: Dosen[];
  kelas: Kelas[];
  ruangan: Ruangan[];
  selectedDosenId: number | null;
  selectedKelasId: number | null;
  selectedRuanganId: number | null;
  onDosenChange: (dosenId: number | null) => void;
  onKelasChange: (kelasId: number | null) => void;
  onRuanganChange: (ruanganId: number | null) => void;
}

const TemporarySchedule: React.FC<TemporaryScheduleProps> = ({
  slots,
  filteredScheduleData,
  dosen,
  kelas,
  ruangan,
  selectedDosenId,
  selectedKelasId,
  selectedRuanganId,
  onDosenChange,
  onKelasChange,
  onRuanganChange,
}) => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const scheduleForDay = (day: string) => {
    return filteredScheduleData
      .filter(item => item.slot.day === day)
      .reduce((acc, item) => {
        if (!acc[item.slot.start_time]) {
          acc[item.slot.start_time] = [];
        }
        acc[item.slot.start_time].push(item);
        return acc;
      }, {} as Record<string, ScheduleItem[]>)
  };

  const timeSlots = Array.from(new Set(slots.map((slot) => slot.start_time))).sort();
  const isMobile = useMediaQuery({ maxWidth: 767 }); // Adjust breakpoint as needed
  const [form] = Form.useForm();


  return (
   
      <Card style={{ width: "100%" }}>
        <div>

        </div>
        
        <Space
        style={{
          width: "100%",
          marginBottom: "20px",
          display: "flex",
          justifyContent: isMobile ? "start" : "center", // Align to start on mobile
          gap: "10px",
          flexWrap: "wrap", // Allow wrapping on mobile
        }}
      >
            <Select
              showSearch
              placeholder="Select Instructor"
              value={selectedDosenId || "all"}
              onChange={(value) => onDosenChange(value !== "all" ? Number(value) : null)}
              style={{ width: "100%" }}
            >
              <Select.Option key="all" value="all">
                Semua Dosen
              </Select.Option>
              {Array.isArray(dosen) && dosen.length > 0 ? (
                dosen.map((d) => (
                  <Select.Option key={d.id} value={d.id}>
                    {`${d.nama_depan} ${d.nama_belakang}`}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled>No instructors available</Select.Option>
              )}
            </Select>

            <Select
              placeholder="Select Kelas"
              value={selectedKelasId || "all"}
              onChange={(value) => onKelasChange(value !== "all" ? Number(value) : null)}
            >
              <Select.Option key="all" value="all">
                Semua Kelas
              </Select.Option>
              {Array.isArray(kelas) && kelas.length > 0 ? (
                kelas.map((k) => (
                  <Select.Option key={k.id} value={k.id}>
                    {k.nama_kelas}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled>No kelas available</Select.Option>
              )}
            </Select>

            <Select
              placeholder="Select Ruangan"
              value={selectedRuanganId || "all"}
              onChange={(value) => onRuanganChange(value !== "all" ? Number(value) : null)}
            >
              <Select.Option key="all" value="all">
                Semua ruangan
              </Select.Option>
              {Array.isArray(ruangan) && ruangan.length > 0 ? (
                ruangan.map((ruangan) => (
                  <Select.Option key={ruangan.id} value={ruangan.id}>
                    {ruangan.nama_ruangan}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled>No ruangan available</Select.Option>
              )}
            </Select>
        </Space>

        <Table
          pagination={false}
          dataSource={timeSlots.map((time, index) => ({ key: index, time }))}
          columns={[
            {
              title: "Time",
              dataIndex: "time",
              key: "time",
              render: (time: string) => {
                const matchingSlot = slots.find(slot => slot.start_time === time);
                return matchingSlot ? `${matchingSlot.start_time} - ${matchingSlot.end_time}` : time;
              },
              fixed: isMobile ? false : "left",
              width: isMobile ? 80 : 100,
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
                        {`${item.pengajaran.mata_kuliah.nama_mata_kuliah} (${item.pengajaran.kelas.nama_kelas}) - ${item.ruangan.nama_ruangan} - ${item.pengajaran.dosen.nama_depan} ${item.pengajaran.dosen.nama_belakang}`}
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
  );
};

export default TemporarySchedule;
