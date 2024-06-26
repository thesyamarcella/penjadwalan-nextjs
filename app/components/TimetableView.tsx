// // components/TimetableView.tsx

// import { Table } from 'antd';
// import { useEffect, useState } from 'react';

// const TimetableView = () => {
//   const [scheduleData, setScheduleData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("https://penjadwalan-be-j6usm5hcwa-et.a.run.app/api/jadwal/temp?page=1&size=500");
//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }
//         const data = await response.json();
//         setScheduleData(data); // Setelah berhasil fetch data, set ke state scheduleData
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         // Handle error fetching data, misalnya menampilkan pesan error atau fallback
//       }
//     };

//     fetchData();
//   }, []); // Fetch data hanya sekali saat komponen dimount

//   // Mengubah data jadwal menjadi format tabel yang dibutuhkan oleh Ant Design
//   const transformedData = scheduleData.map(item => ({
//     key: item.id,
//     time: `${item.slot.start_time} - ${item.slot.end_time}`,
//     day: item.slot.day,
//     ruangan: `${item.ruangan.nama_gedung} - Ruangan ${item.ruangan.nama_ruangan}`,
//     mataKuliah: item.pengajaran.mata_kuliah.nama_mata_kuliah,
//     dosen: `${item.pengajaran.dosen.gelar_depan} ${item.pengajaran.dosen.nama_depan} ${item.pengajaran.dosen.nama_belakang} ${item.pengajaran.dosen.gelar_belakang}`,
//   }));

//   // Kolom-kolom yang akan ditampilkan di tabel
//   const columns = [
//     {
//       title: 'Jam',
//       dataIndex: 'time',
//       key: 'time',
//     },
//     {
//       title: 'Senin',
//       dataIndex: 'day',
//       key: 'day',
//       render: (text, record) => {
//         if (record.day === 'Mon') {
//           return (
//             <>
//               <div>Ruangan: {record.ruangan}</div>
//               <div>Mata Kuliah: {record.mataKuliah}</div>
//               <div>Dosen: {record.dosen}</div>
//             </>
//           );
//         }
//         return null;
//       },
//     },
//     // Kolom untuk hari-hari lainnya bisa ditambahkan di sini
//   ];

//   return (
//     <Table
//       columns={columns}
//       dataSource={transformedData}
//       pagination={false} // Jika ingin menampilkan pagination, ubah menjadi `pagination={true}`
//     />
//   );
// };

// export default TimetableView;
