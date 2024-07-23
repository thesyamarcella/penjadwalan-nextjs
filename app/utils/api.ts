// utils/api.ts

export const fetchAllData = async () => {
    try {
      const [dosen, kelas, mataKuliah, ruangan, pengajaran] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/dosen").then((res) => res.json()),
        fetch("http://127.0.0.1:8000/api/kelas").then((res) => res.json()),
        fetch("http://127.0.0.1:8000/api/mata-kuliah").then((res) => res.json()),
        fetch("http://127.0.0.1:8000/api/ruangan").then((res) => res.json()),
        fetch("http://127.0.0.1:8000/api/pengajaran").then((res) => res.json()),
      ]);
  
      const scheduleData = await fetch("http://127.0.0.1:8000/api/jadwal/temp?page=1&size=500").then((res) => res.json());
  
      const allData = {
        dosen: dosen.total_elements,
        kelas: kelas.total_elements,
        mataKuliah: mataKuliah.total_elements,
        ruangan: ruangan.total_elements,
        pengajaran: pengajaran.total_elements,
        scheduleData: scheduleData.items,
      };
  
      console.log("All data fetched successfully:", allData); 
  
      return allData;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };
  