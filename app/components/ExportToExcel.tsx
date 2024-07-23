// components/ExportToExcel.tsx

import React from "react";
import { Button, Tooltip } from "antd";
import * as XLSX from "xlsx";
import { ScheduleItem } from "../types/type";
import { FileExcelFilled, FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";

interface ExportToExcelProps {
  data: ScheduleItem[];
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ data }) => {
  const exportToExcel = () => {
    const formattedData = data.map((item) => ({
      Class: item.pengajaran.kelas.nama_kelas,
      Course: item.pengajaran.mata_kuliah.nama_mata_kuliah,
      Instructor: `${item.pengajaran.dosen.nama_depan} ${item.pengajaran.dosen.nama_belakang}`,
      Day: item.slot.day,
      Time: `${item.slot.start_time} - ${item.slot.end_time}`,
      Room: item.ruangan.nama_ruangan
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule Data");
    XLSX.writeFile(workbook, "schedule_data.xlsx");
  };

  return<Tooltip title="Export to Excel"> 
  <Button 
    onClick={exportToExcel} 
    >
     Export   <FileExcelOutlined />
    </Button>
</Tooltip>
};
export default ExportToExcel;
