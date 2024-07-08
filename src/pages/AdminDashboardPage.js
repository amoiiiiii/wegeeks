import React from 'react';

const AdminDashboardPage = () => {
  return (
    <div>
      <header>
        {/* Header content */}
      </header>
      <nav>
        <ul>
          <li>Daftar Karyawan</li>
          <li>Tambah Karyawan</li>
          <li>Log Aplikasi</li>
        </ul>
      </nav>
      <main>
        <section>
          <h1>Dashboard Admin</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Karyawan</th>
                <th>Jabatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* List of employees */}
              <tr>
                <td>1</td>
                <td>John Doe</td>
                <td>Manager</td>
                <td>[Edit] [Hapus]</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default AdminDashboardPage;