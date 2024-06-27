export interface Dosen {
    id: number;
    nama_depan: string;
    nama_belakang: string;
    preferensi: {
      slot: {
        id: number;
      };
    }[];
  }
  
  export interface Slot {
    id: number;
    day: string;
    start_time: string;
    end_time: string;
  }
  
  export interface ScheduleItem {
    id: number;
    slot: Slot;
    pengajaran: {
      mata_kuliah: {
        nama_mata_kuliah: string;
      };
      kelas: {
        nama_kelas: string;
      };
      dosen: Dosen;
    };
    ruangan: {
      nama_ruangan: string;
    };
    is_conflicted?: boolean;
  }
  