"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, Table, Tag, Typography } from "antd";
import { redirect } from "next/navigation";

const { Title } = Typography;

interface ScheduleItem {
  key: string;
  date: string;
  time: string;
  activity: string;
  conflicts?: string[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    } else if (status === "authenticated") {
      // Fetch temporary schedule data (replace with your actual API call)
      fetch("/api/schedule")
        .then((res) => res.json())
        .then((data) => {
          // Assuming the API response is an array of schedule items
          setScheduleData(data);
        });
    }
  }, [status]);

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Activity", dataIndex: "activity", key: "activity" },
    {
      title: "Conflicts",
      dataIndex: "conflicts",
      key: "conflicts",
      render: (conflicts: string[] | undefined) => (
        <>
          {conflicts?.map((conflict) => (
            <Tag color="warning" key={conflict}>
              {conflict}
            </Tag>
          ))}
        </>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Dashboard</Title>

      <Card title="Temporary Schedule Summary">
        <Table dataSource={scheduleData} columns={columns} />
      </Card>

      {/* Add more dashboard components here (e.g., statistics, notifications) */}
    </div>
  );
}
