import React from 'react';

const UserDashboardPage = () => {
  return (
    <div>
      <header>
        {/* Header content */}
      </header>
      <nav>
        <ul>
          <li>Profil Pengguna</li>
          <li>Absensi Saya</li>
        </ul>
      </nav>
      <main>
        <section>
          <h1>Dashboard User</h1>
          <div>
            <h2>Informasi Profil</h2>
            <p>Nama: John Doe</p>
            <p>Email: john.doe@example.com</p>
            <p>Foto Profil: [Gambar]</p>
          </div>
          <div>
            <h2>Absensi Hari Ini</h2>
            <p>Tanggal: 08-07-2024</p>
            <p>Status: Masuk</p>
          </div>
        </section>
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default UserDashboardPage;