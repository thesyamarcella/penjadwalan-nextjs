export const formItemsMap: { [key: string]: Array<{ name: string, label: string, rules?: any[] }> } = {
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
      { name: 'nama_mata_kuliah', label: 'Nama Mata Kuliah', rules: [{ required: true, message: 'Please input the subject name!' }] },
      { name: 'sks', label: 'SKS', rules: [{ required: true, message: 'Please input the SKS!' }] },
    ],
    pengajaran: [
      { name: 'id_dosen', label: 'ID Dosen', rules: [{ required: true, message: 'Please input the ID Dosen!' }] },
      { name: 'id_kelas', label: 'ID Kelas', rules: [{ required: true, message: 'Please input the ID Kelas!' }] },
      { name: 'id_mata_kuliah', label: 'ID Mata Kuliah', rules: [{ required: true, message: 'Please input the ID Mata Kuliah!' }] },
    ],
  };
  
  export const columnsMap: { [key: string]: any[] } = {
    dosen: [
      { title: 'NIP', dataIndex: 'nip', key: 'nip', sorter: (a: any, b: any) => a.nip.localeCompare(b.nip) },
      { title: 'NIDN', dataIndex: 'nidn', key: 'nidn', sorter: (a: any, b: any) => (a.nidn ?? '').localeCompare(b.nidn ?? '') },
      { title: 'Nama Dosen', dataIndex: 'nama_depan', key: 'nama_depan', sorter: (a: any, b: any) => a.nama_depan.localeCompare(b.nama_depan), render: (text: string, record: any) => `${record.nama_depan} ${record.nama_belakang}, ${record.gelar_belakang}` },
      { title: 'Email', dataIndex: 'email', key: 'email', sorter: (a: any, b: any) => a.email.localeCompare(b.email) },
    ],
    kelas: [
      { title: 'Nama Kelas', dataIndex: 'nama_kelas', key: 'nama_kelas', sorter: (a: any, b: any) => a.nama_kelas.localeCompare(b.nama_kelas) },
      { title: 'Nama Prodi', dataIndex: 'nama_prodi', key: 'nama_prodi', sorter: (a: any, b: any) => a.nama_prodi.localeCompare(b.nama_prodi) },
      { title: 'Shift', dataIndex: 'shift', key: 'shift', filters: [
          { text: 'Pagi', value: 'pagi' },
          { text: 'Siang', value: 'siang' },
          { text: 'Sore', value: 'sore' },
          { text: 'Malam', value: 'malam' },
        ],
        onFilter: (value: any, record: any) => record.shift.indexOf(value) === 0
      },
      { title: 'Kuota', dataIndex: 'kuota', key: 'kuota', sorter: (a: any, b: any) => a.kuota - b.kuota },
      {
        title: 'Dosen Wali',
        dataIndex: 'dosen',
        key: 'dosen',
        sorter: (a: any, b: any) => (a.dosen?.nama_depan ?? '').localeCompare(b.dosen?.nama_depan ?? ''),
        render: (dosen: any) => dosen ? `${dosen.nama_depan} ${dosen.nama_belakang}, ${dosen.gelar_belakang}` : 'N/A',
      },
    ],
    ruangan: [
      { title: 'Nama Ruangan', dataIndex: 'nama_ruangan', key: 'nama_ruangan', sorter: (a: any, b: any) => a.nama_ruangan.localeCompare(b.nama_ruangan) },
      { title: 'Nama Gedung', dataIndex: 'nama_gedung', key: 'nama_gedung', sorter: (a: any, b: any) => a.nama_gedung.localeCompare(b.nama_gedung) },
      { title: 'Kapasitas', dataIndex: 'kapasitas', key: 'kapasitas', sorter: (a: any, b: any) => a.kapasitas - b.kapasitas },
      { title: 'Is Lab', dataIndex: 'is_lab', key: 'is_lab', filters: [
          { text: 'Yes', value: true },
          { text: 'No', value: false },
        ],
        onFilter: (value: any, record: any) => record.is_lab === value,
        render: (is_lab: boolean) => (is_lab ? 'Yes' : 'No')
      },
    ],
    'mata-kuliah': [
      { title: 'Nama Mata Kuliah', dataIndex: 'nama_mata_kuliah', key: 'nama_mata_kuliah', sorter: (a: any, b: any) => a.nama_mata_kuliah.localeCompare(b.nama_mata_kuliah) },
      { title: 'SKS', dataIndex: 'sks', key: 'sks', sorter: (a: any, b: any) => a.sks - b.sks },
    ],
    
    pengajaran: [
        {
          title: 'Dosen',
          dataIndex: 'dosen',
          key: 'dosen',
          sorter: (a: any, b: any) => (a.dosen?.nama_depan ?? '').localeCompare(b.dosen?.nama_depan ?? ''),
          render: (dosen: { nama_depan: string; nama_belakang: string; gelar_belakang: string }) =>
            dosen ? `${dosen.nama_depan} ${dosen.nama_belakang}, ${dosen.gelar_belakang}` : 'N/A',
        },
        {
          title: 'Kelas',
          dataIndex: 'kelas',
          key: 'kelas',
          sorter: (a: any, b: any) => a.kelas.nama_kelas.localeCompare(b.kelas.nama_kelas),
          render: (kelas: { nama_kelas: string }) => kelas?.nama_kelas || 'N/A',
        },
        {
          title: 'Mata Kuliah',
          dataIndex: 'mata_kuliah',
          key: 'mata_kuliah',
          sorter: (a: any, b: any) => a.mata_kuliah.nama_mata_kuliah.localeCompare(b.mata_kuliah.nama_mata_kuliah),
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
  };
  
  
  