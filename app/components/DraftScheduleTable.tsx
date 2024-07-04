// // components/ScheduleTable.tsx

// import React from "react";
// import { Table, Button, Tag, Input } from "antd";
// import { ScheduleItem } from "../types/type";
// import dayjs from "dayjs";

// interface DraftScheduleTableProps {
//   scheduleData: ScheduleItem[];
//   filteredData: ScheduleItem[];
//   setSearchValue: (value: string) => void;
//   searchValue: string;
//   currentPage: number;
//   pageSize: number;
//   setCurrentPage: (page: number) => void;
//   setPageSize: (size: number) => void;
//   handleFixSchedule: (scheduleItem: ScheduleItem) => void;
//   handleRegenerate: () => void;
//   isRegenerating: boolean;
//   handleGoogleCalendarIntegration: () => void;
// }

// const ScheduleTable: React.FC<DraftScheduleTableProps> = ({
//   scheduleData,
//   filteredData,
//   setSearchValue,
//   searchValue,
//   currentPage,
//   pageSize,
//   setCurrentPage,
//   setPageSize,
//   handleFixSchedule,
//   handleRegenerate,
//   isRegenerating,
//   handleGoogleCalendarIntegration,
// }) => {
//   const columns = [
//     {
//       title: "Class",
//       dataIndex: ["pengajaran", "kelas", "nama_kelas"],
//       key: "class",
//       filters: Array.from(new Set(scheduleData.map(item => item.pengajaran.kelas.nama_kelas)))
//         .map(kelas => ({ text: kelas, value: kelas })),
//       onFilter: (value, record) => record.pengajaran.kelas.nama_kelas === value,
//     },
//     {
//       title: "Course",
//       dataIndex: ["pengajaran", "mata_kuliah", "nama_mata_kuliah"],
//       key: "course",
//       filters: Array.from(new Set(scheduleData.map(item => item.pengajaran.mata_kuliah.nama_mata_kuliah)))
//         .map(course => ({ text: course, value: course })),
//       onFilter: (value, record) => record.pengajaran.mata_kuliah.nama_mata_kuliah === value,
//       sorter: (a, b) => a.pengajaran.mata_kuliah.nama_mata_kuliah.localeCompare(b.pengajaran.mata_kuliah.nama_mata_kuliah),
//     },
//     {
//       title: "Instructor",
//       dataIndex: ["pengajaran", "dosen"],
//       key: "instructor",
//       render: (dosen: any) => `${dosen.nama_depan} ${dosen.nama_belakang}`,
//       filters: Array.from(new Set(scheduleData.map(item => `${item.pengajaran.dosen.nama_depan} ${item.pengajaran.dosen.nama_belakang}`)))
//           .map(instructor => ({ text: instructor, value: instructor })),
//           onFilter: (value, record) => `${record.pengajaran.dosen.nama_depan} ${record.pengajaran.dosen.nama_belakang}` === value,
//     },
//     {
//       title: "Day",
//       dataIndex: ["slot", "day"],
//       key: "day",
//       sorter: (a, b) => dayjs(a.slot.day).unix() - dayjs(b.slot.day).unix(),
//     },
//     {
//       title: "Time",
//       dataIndex: ["slot"],
//       key: "time",
//       render: (slot: any) => `${slot.start_time} - ${slot.end_time}`,
//     },
//     {
//       title: "Room",
//       dataIndex: ["ruangan", "nama_ruangan"],
//       key: "room",
//       filters: Array.from(new Set(scheduleData.map(item => item.ruangan.nama_ruangan)))
//         .map(room => ({ text: room, value: room })),
//       onFilter: (value, record) => record.ruangan.nama_ruangan === value,
//     },
//     {
//       title: "Status",
//       dataIndex: "is_conflicted",
//       key: "status",
//       render: (isConflicted: boolean, record: ScheduleItem) => (
//         <>
//           <Tag color={isConflicted ? "red" : "green"}>
//             {isConflicted ? "Conflict" : "OK"}
//           </Tag>
//           {isConflicted && (
//             <Button
//               size="small"
//               type="link"
//               onClick={() => handleFixSchedule(record)}
//             >
//               Fix
//             </Button>
//           )}
//         </>
//       ),
//       filters: [
//         { text: 'OK', value: false },
//         { text: 'Conflict', value: true }
//       ],
//       onFilter: (value, record) => record.is_conflicted === value,
//     },
//   ];

//   const onChange = (pagination, filters, sorter, extra) => {
//     console.log('params', pagination, filters, sorter, extra);
//   };

//   return (
//     <div>
//       <Input.Search
//         placeholder="Search by course"
//         value={searchValue}
//         onChange={(e) => setSearchValue(e.target.value)}
//         style={{ width: "100%", marginBottom: 16 }}
//       />
//       <Table
//         columns={columns}
//         dataSource={filteredData}
//         pagination={{
//           current: currentPage,
//           pageSize: pageSize,
//           total: filteredData.length,
//           onChange: (page, newPageSize) => {
//             setCurrentPage(page);
//             setPageSize(newPageSize);
//           },
//           showSizeChanger: true,
//         }}
//         onChange={onChange}
//         scroll={{ y: "calc(100vh - 250px)" }}
//       />
//       <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
//         <Button onClick={handleRegenerate} loading={isRegenerating}>
//           Generate Jadwal
//         </Button>
//         <Button onClick={handleGoogleCalendarIntegration}>
//           Simpan Jadwal
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default DraftScheduleTable;
