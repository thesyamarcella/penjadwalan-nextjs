export interface Slot {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
}

export interface Dosen {
  id: number;
  nidn: string;
  nama_depan: string;
  nama_belakang: string;
  email?: string;
  id_pegawai: string;
  inisial: string;
  gelar_depan: string;
  gelar_belakang: string;
  alamat: string;
  agama: string;
  telp_seluler: string;
    preferensi: { id: number; slot: { id: number } }[];
  }

  
export interface Kelas {
  id: number;
  nama_kelas: string;
  id_prodi: number;
  nama_prodi: string;
  shift: string;
  kuota: number;
  id_dosen_wali: number;
  dosen: {
    id: number;
    nip: string;
    nidn: string;
    nama_depan: string;
    nama_belakang: string;
    gelar_belakang: string;
    email: string;
  };
}


export interface Ruangan {
  id: number;
  nama_ruangan: string;
  nama_gedung: string;
  kapasitas: number;
  is_lab: boolean;
}

export interface MataKuliah {
  id: number;
  nama_mata_kuliah: string;
  nama_mata_kuliah_inggris: string;
  sks: number;
  semester: string;
  tingkat_mata_kuliah: number;
  is_lab: boolean;
  index_minimum: boolean; 
  id_program_studi: number;
  nama_prodi: string;
  nama_prodi_en: string;
}

export interface ScheduleItem {
  id: number;
  id_slot: number;
  id_ruangan: number;
  id_pengajaran: number;
  slot: {
    id: number;
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
      id: number;
      nama_depan: string;
      nama_belakang: string;
    };
    kelas: {
      id: number;
      nama_kelas: string;
    };
    mata_kuliah: {
      nama_mata_kuliah: string;
    };
  };
  is_conflicted?: boolean;
}


export interface EmptySlot {
  slot: {
    id: number;
    start_time: string;
    end_time: string;
    day: string;
  };
  room: {
    id: number;
    nama_ruangan: string;
    nama_gedung: string;
    kapasitas: number;
    is_lab: boolean;
  };
}

export interface Pengajaran {
  created_at: string;
  updated_at: string;
  id: number;
  id_dosen: number;
  id_kelas: number;
  id_mata_kuliah: number;
  id_semester: number;
  dosen: {
    id: any;
    nama_depan: string;
    nama_belakang: string;
    email: string;
  };
  kelas: {
    id: any;
    nama_kelas: string;
    prodi: {
      nama_prodi: string;
    };
    dosen: {
      nama_depan: string;
      nama_belakang: string;
    };
  };
  mata_kuliah: {
    id: number,
    nama_mata_kuliah: string;
    sks: number;
    semester: string;
  };
  semester: {
    id: number;
    jenis: string;
    tahun_ajaran: string;
  };
}

export type DataType = Kelas | Ruangan | MataKuliah | Pengajaran;



export interface FormItem {
  name: string;
  label: string;
  rules?: { required?: boolean; message: string }[];
  type?: 'switch' | 'text' | 'number' | 'select'; 
  valuePropName?: string;
  options?: { label: string; value: string | number }[]; 
}

export interface Rule {
  required?: boolean;
  message?: string;
}

export interface ColumnItem {
  title: string;
  dataIndex: string | string[];
  key: string;
  sorter?: (a: any, b: any) => number; 
  render?: (text: any, record: any) => React.ReactNode;
  filters?: { text: string; value: any }[];
  onFilter?: (value: any, record: any) => boolean;
}
