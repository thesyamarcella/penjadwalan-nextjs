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
    preferensi: any[];
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
    nama_ruangan: string;
    nama_gedung: string;
    kapasitas: number;
    is_lab: boolean;
  }
  
  export interface MataKuliah {
    id: number;
    nama_mata_kuliah: string;
    sks: number;
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
      nama_depan: string;
      nama_belakang: string;
      email: string;
    };
    kelas: {
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
      nama_mata_kuliah: string;
      sks: number;
      semester: string;
    };
    semester: {
      jenis: string;
      tahun_ajaran: string;
    };
  }
  
  export type DataType = Kelas | Ruangan | MataKuliah | Pengajaran;
  