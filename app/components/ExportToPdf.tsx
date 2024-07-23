// components/ExportToPDF.tsx
import React from "react";
import { Button, Tooltip } from "antd";
import { jsPDF } from "jspdf"; 
import autoTable from "jspdf-autotable";
import { ScheduleItem } from "../types/type";
import { FilePdfFilled, FilePdfOutlined } from "@ant-design/icons";

interface ExportToPDFProps {
  data: ScheduleItem[];
}

const ExportToPDF: React.FC<ExportToPDFProps> = ({ data }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Apply autoTable plugin to jsPDF instance
    autoTable(doc, {
      head: [["Class", "Course", "Instructor", "Day", "Time", "Room", "Status"]],
      body: data.map((item) => [
        item.pengajaran.kelas.nama_kelas,
        item.pengajaran.mata_kuliah.nama_mata_kuliah,
        `${item.pengajaran.dosen.nama_depan} ${item.pengajaran.dosen.nama_belakang}`,
        item.slot.day,
        `${item.slot.start_time} - ${item.slot.end_time}`,
        item.ruangan.nama_ruangan,
        item.is_conflicted ? "Conflict" : "OK",
      ]),
      startY: 20
    });
    
    doc.text("Schedule Data", 14, 15);
    doc.save("schedule_data.pdf");
  };

  return<Tooltip title="Export to PDF">
  <Button 
    onClick={exportToPDF} 
    >
    Export   <FilePdfOutlined />
    </Button>
</Tooltip>;
};

export default ExportToPDF;
