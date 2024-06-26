// types.ts
interface ScheduleItem {
    id: number;
    id_slot: number;
    id_ruangan: number;
    id_pengajaran: number;
    slot: {
      day: string;
      start_time: string;
      end_time: string;
    };
    ruangan: {
      id: number;
      nama_ruangan: string;
    };
    pengajaran: {
      dosen: {
        nama_depan: string;
        nama_belakang: string;
      };
      kelas: {
        nama_kelas: string;
      };
      mata_kuliah: {
        nama_mata_kuliah: string;
      };
    };
    is_conflicted?: boolean; 
  }
  
  interface EmptySlot {
    slot: {
      id: number;
      start_time: string;
      end_time: string;
      day: string;
    };
    room: {
      nama_ruangan: string;
    };
  }
  // ./types.ts or ./types.d.ts

interface ScheduleItem {
    id: number;
    id_slot: number;
    id_ruangan: number;
    id_pengajaran: number;
    slot: {
      day: string;
      start_time: string;
      end_time: string;
    };
    ruangan: {
      id: number;
      nama_ruangan: string;
    };
    pengajaran: {
      dosen: {
        nama_depan: string;
        nama_belakang: string;
      };
      kelas: {
        nama_kelas: string;
      };
      mata_kuliah: {
        nama_mata_kuliah: string;
      };
    };
    is_conflicted?: boolean;
  }

  