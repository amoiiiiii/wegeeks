import React from 'react';

const SuperAdminDashboardPage = () => {
  return (
    <div>
      <header>
        {/* Header content */}
      </header>
      <nav>
        <ul>
          <li>Manajemen Pengguna</li>
          <li>Laporan Aplikasi</li>
        </ul>
      </nav>
      <main>
        <section>
          <h1>Dashboard Super Admin</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Pengguna</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* List of users */}
              <tr>
                <td>1</td>
                <td>John Doe</td>
                <td>Admin</td>
                <td>[Edit]</td>
              </tr>
            </tbody>
          </table>
          <div>
            <h2>Grafik Statistik Aplikasi</h2>
            {/* Chart component */}
          </div>
        </section>
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default SuperAdminDashboardPage;