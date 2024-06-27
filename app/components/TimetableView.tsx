// TimetableView.tsx

import { Table, Typography } from "antd";
import dayjs from "dayjs";
import type { ColumnsType } from 'antd/es/table';

interface TimetableViewProps {
  scheduleData: ScheduleItem[];
}

const { Title } = Typography;

const TimetableView: React.FC<TimetableViewProps> = ({ scheduleData }) => {
  // Group schedule data by day
  const groupedData: { [key: string]: ScheduleItem[] } = {};
  scheduleData.forEach((item) => {
    const day = item.slot.day;
    if (!groupedData[day]) {
      groupedData[day] = [];
    }
    groupedData[day].push(item);
  });

  // Generate columns dynamically based on unique days
  const columns: ColumnsType<ScheduleItem> = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (_, record) => `${record.slot.start_time} - ${record.slot.end_time}`,
    },
    ...Object.keys(groupedData).map((day) => ({
      title: day,
      dataIndex: day,
      key: day,
      render: (_ : any, record : any) => {
        const items = groupedData[day].filter((item) => item.id === record.id);
        return (
          <div>
            {items.map((item) => (
              <div key={item.id}>
                {item.pengajaran.mata_kuliah.nama_mata_kuliah} - {item.ruangan.nama_ruangan}
              </div>
            ))}
          </div>
        );
      },
    })),
  ];

  // Flatten data for table rows
  const tableData = scheduleData.map((item) => ({
    ...item,
    key: item.id.toString(),
    time: `${item.slot.start_time} - ${item.slot.end_time}`,
    ...groupedData[item.slot.day].reduce<Record<string, ScheduleItem>>(
        (acc, cur) => {
          acc[cur.slot.day] = cur;
          return acc;
        },
        {} 
      ),
    }));

  return (
    <div>
      <Title level={3}>Timetable View</Title>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        scroll={{ x: true, y: 400 }}
      />
    </div>
  );
};

export default TimetableView;
