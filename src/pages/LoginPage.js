import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
  };

  return (
    <div>
      <header>
        {/* Header content */}
      </header>
      <main>
        <section>
          <h1>Masuk ke Aplikasi Manajemen Absensi Karyawan</h1>
          <form onSubmit={handleLogin}>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Masuk</button>
          </form>
          <p><a href="#">Lupa Password?</a></p>
        </section>
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default LoginPage;
