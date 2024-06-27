// import { Table } from 'antd';
// import type { ColumnsType } from 'antd/es/table';
// import dayjs from 'dayjs';

// interface ScheduleItem {
//   id: number;
//   id_slot: number;
//   id_ruangan: number;
//   id_pengajaran: number;
//   slot: {
//     day: string;
//     start_time: string;
//     end_time: string;
//   };
//   ruangan: {
//     id: number;
//     nama_ruangan: string;
//   };
//   pengajaran: {
//     dosen: {
//       nama_depan: string;
//       nama_belakang: string;
//     };
//     kelas: {
//       nama_kelas: string;
//     };
//     mata_kuliah: {
//       nama_mata_kuliah: string;
//     };
//   };
// }


// function ScheduleTable({ scheduleData, filteredData, currentPage, pageSize, handleTableChange }: {
//   scheduleData: ScheduleItem[], 
//   filteredData: ScheduleItem[], 
//   currentPage: number, 
//   pageSize: number, 
//   handleTableChange: (pagination: any, filters: any, sorter: any, extra: any) => void
// }) {
//   const columns: ColumnsType<ScheduleItem> = [
//     // ... (column definitions from your original code)
//   ];

//   return (
//     <Table
//       columns={columns}
//       dataSource={filteredData}
//       pagination={{
//         current: currentPage,
//         pageSize: pageSize,
//         total: filteredData.length,
//         onChange: handleTableChange,
//         showSizeChanger: true,
//       }}
//       onChange={handleTableChange} // Pass the onChange function
//       scroll={{ x: true, y: 400 }}
//     />
//   );
// }

// export default ScheduleTable;
