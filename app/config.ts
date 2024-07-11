import { ColumnItem, FormItem } from "./types/type";

export const formItemsMap: { [key: string]: FormItem[] } = {
    dosen: [
      { name: 'nip', label: 'NIP', rules: [{ required: true, message: 'Please input the NIP!' }] },
      { name: 'nidn', label: 'NIDN', rules: [{ required: true, message: 'Please input the NIDN!' }] },
      { name: 'nama_depan', label: 'Nama Depan', rules: [{ required: true, message: 'Please input the first name!' }] },
      { name: 'nama_belakang', label: 'Nama Belakang', rules: [{ required: true, message: 'Please input the last name!' }] },
      { name: 'gelar_belakang', label: 'Gelar Belakang', rules: [{ required: true, message: 'Please input the title!' }] },
      { name: 'email', label: 'Email', rules: [{ required: true, message: 'Please input the email!' }] },
    ],
    kelas: [
      { name: 'nama_kelas', label: 'Nama Kelas', rules: [{ required: true, message: 'Please input the class name!' }] },
      { name: 'id_prodi', label: 'ID Prodi', rules: [{ required: true, message: 'Please input the ID Prodi!' }] },
      { name: 'nama_prodi', label: 'Nama Prodi', rules: [{ required: true, message: 'Please input the Prodi name!' }] },
      { name: 'shift', label: 'Shift', rules: [{ required: true, message: 'Please input the shift!' }] },
      { name: 'kuota', label: 'Kuota', rules: [{ required: true, message: 'Please input the quota!' }] },
      { name: 'id_dosen_wali', label: 'ID Dosen Wali', rules: [{ required: true, message: 'Please input the ID Dosen Wali!' }] },
    ],
    ruangan: [
      { name: 'nama_ruangan', label: 'Nama Ruangan', rules: [{ required: true, message: 'Please input the room name!' }] },
      { name: 'nama_gedung', label: 'Nama Gedung', rules: [{ required: true, message: 'Please input the building name!' }] },
      { name: 'kapasitas', label: 'Kapasitas', rules: [{ required: true, message: 'Please input the capacity!' }] },
      { name: 'is_lab', label: 'Is Lab', rules: [{ required: true, message: 'Please input if it is a lab!' }] },
    ],
    'mata-kuliah': [
    { name: 'kd_mata_kuliah', label: 'Kode Mata Kuliah', rules: [{ required: true, message: 'Please input the subject code!' }] },
    { name: 'nama_mata_kuliah', label: 'Nama Mata Kuliah', rules: [{ required: true, message: 'Please input the subject name!' }] },
    { name: 'nama_mata_kuliah_inggris', label: 'Nama Mata Kuliah (Inggris)', rules: [{ required: true, message: 'Please input the subject name in English!' }] },
    { name: 'sks', label: 'SKS', rules: [{ required: true, message: 'Please input the SKS!' }] },
    { name: 'semester', label: 'Semester', rules: [{ required: true, message: 'Please input the semester!' }] },
    { name: 'tingkat_mata_kuliah', label: 'Tingkat', rules: [{ required: true, message: 'Please input the level!' }] },
    { name: 'is_lab', label: 'Lab', valuePropName: 'checked', type: 'switch' },  // Switch
    { name: 'index_minimum', label: 'Index Minimum', valuePropName: 'checked', type: 'switch' }, 
    { name: 'id_program_studi', label: 'ID Program Studi', rules: [{ required: true, message: 'Please input the study program ID!' }] }, 
    { name: 'nama_prodi', label: 'Nama Prodi', rules: [{ required: true, message: 'Please input the study program name!' }] },
    { name: 'nama_prodi_en', label: 'Nama Prodi (Inggris)', rules: [{ required: true, message: 'Please input the study program name in English!' }] },
  ],
    pengajaran: [
      { name: 'id_dosen', label: 'ID Dosen', rules: [{ required: true, message: 'Please input the ID Dosen!' }] },
      { name: 'id_kelas', label: 'ID Kelas', rules: [{ required: true, message: 'Please input the ID Kelas!' }] },
      { name: 'id_mata_kuliah', label: 'ID Mata Kuliah', rules: [{ required: true, message: 'Please input the ID Mata Kuliah!' }] },
      { name: 'id_semester', label: 'ID semester', rules: [{ required: true, message: 'Please input the ID Semester!' }] },
    ],
    slot: [
      { 
        name: 'day', 
        label: 'Hari', 
        rules: [{ required: true, message: 'Masukkan hari!' }], 
        type: 'select', 
        options: [
          { label: 'Senin', value: 'Mon' },
          { label: 'Selasa', value: 'Tue' },
          { label: 'Rabu', value: 'Wed' },
          { label: 'Kamis', value: 'Thu' },
          { label: 'Jumat', value: 'Fri' },
          { label: 'Sabtu', value: 'Sat' },
        ]
      },
      { name: 'start_time', label: 'Waktu Mulai', rules: [{ required: true, message: 'Masukkan waktu mulai!' }], type: 'time' },
      { name: 'end_time', label: 'Waktu Selesai', rules: [{ required: true, message: 'Masukkan waktu selesai!' }], type: 'time' },
      { name: 'is_lab_slot', label: 'Slot Lab', valuePropName: 'checked', type: 'switch' },
    ],
  };
  
  export const columnsMap: { [key: string]: ColumnItem[] } = {
    dosen: [
      { title: 'NIP', dataIndex: 'nip', key: 'nip', sorter: (a, b) => a.nip.localeCompare(b.nip) },
      { title: 'NIDN', dataIndex: 'nidn', key: 'nidn', sorter: (a, b) => (a.nidn ?? '').localeCompare(b.nidn ?? '') },
      { title: 'Nama Dosen', dataIndex: 'nama_depan', key: 'nama_depan', sorter: (a, b) => a.nama_depan.localeCompare(b.nama_depan), render: (text: string, record) => `${record.nama_depan} ${record.nama_belakang}, ${record.gelar_belakang}` },
      { title: 'Email', dataIndex: 'email', key: 'email', sorter: (a, b) => a.email.localeCompare(b.email) },
    ],
    kelas: [
      { title: 'Nama Kelas', dataIndex: 'nama_kelas', key: 'nama_kelas', sorter: (a, b) => a.nama_kelas.localeCompare(b.nama_kelas) },
      { title: 'Nama Prodi', dataIndex: 'nama_prodi', key: 'nama_prodi', sorter: (a, b) => a.nama_prodi.localeCompare(b.nama_prodi) },
      { title: 'Shift', dataIndex: 'shift', key: 'shift', filters: [
          { text: 'Pagi', value: 'pagi' },
          { text: 'Siang', value: 'siang' },
          { text: 'Sore', value: 'sore' },
          { text: 'Malam', value: 'malam' },
        ],
        onFilter: (value, record) => record.shift.indexOf(value) === 0
      },
      { title: 'Kuota', dataIndex: 'kuota', key: 'kuota', sorter: (a, b) => a.kuota - b.kuota },
      {
        title: 'Dosen Wali',
        dataIndex: 'dosen',
        key: 'dosen',
        sorter: (a, b) => (a.dosen?.nama_depan ?? '').localeCompare(b.dosen?.nama_depan ?? ''),
        render: (dosen) => dosen ? `${dosen.nama_depan} ${dosen.nama_belakang}, ${dosen.gelar_belakang}` : 'N/A',
      },
    ],
    ruangan: [
      { title: 'Nama Ruangan', dataIndex: 'nama_ruangan', key: 'nama_ruangan', sorter: (a, b) => a.nama_ruangan.localeCompare(b.nama_ruangan) },
      { title: 'Nama Gedung', dataIndex: 'nama_gedung', key: 'nama_gedung', sorter: (a, b) => a.nama_gedung.localeCompare(b.nama_gedung) },
      { title: 'Kapasitas', dataIndex: 'kapasitas', key: 'kapasitas', sorter: (a, b) => a.kapasitas - b.kapasitas },
      { title: 'Is Lab', dataIndex: 'is_lab', key: 'is_lab', filters: [
          { text: 'Yes', value: true },
          { text: 'No', value: false },
        ],
        onFilter: (value, record) => record.is_lab === value,
        render: (is_lab: boolean) => (is_lab ? 'Yes' : 'No')
      },
    ],
    'mata-kuliah': [
      { title: 'Nama Mata Kuliah', dataIndex: 'nama_mata_kuliah', key: 'nama_mata_kuliah', sorter: (a, b) => a.nama_mata_kuliah.localeCompare(b.nama_mata_kuliah) },
      { title: 'SKS', dataIndex: 'sks', key: 'sks', sorter: (a, b) => a.sks - b.sks },
    ],
    
    pengajaran: [
        {
          title: 'Dosen',
          dataIndex: 'dosen',
          key: 'dosen',
          sorter: (a, b) => (a.dosen?.nama_depan ?? '').localeCompare(b.dosen?.nama_depan ?? ''),
          render: (dosen: { nama_depan: string; nama_belakang: string; gelar_belakang: string }) =>
            dosen ? `${dosen.nama_depan} ${dosen.nama_belakang}, ${dosen.gelar_belakang}` : 'N/A',
        },
        {
          title: 'Kelas',
          dataIndex: 'kelas',
          key: 'kelas',
          sorter: (a, b) => a.kelas.nama_kelas.localeCompare(b.kelas.nama_kelas),
          render: (kelas: { nama_kelas: string }) => kelas?.nama_kelas || 'N/A',
        },
        {
          title: 'Mata Kuliah',
          dataIndex: 'mata_kuliah',
          key: 'mata_kuliah',
          sorter: (a, b) => a.mata_kuliah.nama_mata_kuliah.localeCompare(b.mata_kuliah.nama_mata_kuliah),
          render: (mata_kuliah: { nama_mata_kuliah: string }) => mata_kuliah?.nama_mata_kuliah || 'N/A',
        },
        {
          title: 'Semester',
          dataIndex: 'semester',
          key: 'semester',
          render: (semester: { jenis: string; tahun_ajaran: string }) =>
            semester ? `${semester.jenis} ${semester.tahun_ajaran}` : 'N/A',
        },
      ],
      slot: [
        { title: 'Hari', dataIndex: 'day', key: 'day' },
        { 
          title: 'Waktu Mulai', 
          dataIndex: 'start_time', 
          key: 'start_time',
          render: (text: string) => text ? text.slice(0,5) : 'N/A',  // Check if text is defined
        },
        { 
          title: 'Waktu Selesai', 
          dataIndex: 'end_time', 
          key: 'end_time',
          render: (text: string) => text ? text.slice(0,5) : 'N/A',  // Check if text is defined
        },
      ],
  };

  
  
  
  