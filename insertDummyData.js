const { Pool } = require('pg');
const moment = require('moment');

const pool = new Pool({
  user: 'postgres',  
  password:"082411",
  host: 'localhost',
  database: 'employee_absence',  // Ganti dengan nama database PostgreSQL kamu
  port: 5432,
});

const users = [
    { id_user: 80, username: "Fresillia aila kirana" },
    { id_user: 64, username: "Azka Qinthara Al-jauzaqi" },
    { id_user: 72, username: "Cila azzahra salsabilla" },
    { id_user: 68, username: "Fadhella Auli Varisha" },
    { id_user: 73, username: "Hanna Nur Amalina" },
    { id_user: 61, username: "Nasyhwa Oktaviani" },
    { id_user: 83, username: "superadmin" },
    { id_user: 76, username: "Devi Septyani" },
    { id_user: 67, username: "Inggrit Aqila" },
    { id_user: 82, username: "Intan Zahra Putri" },
    { id_user: 75, username: "Febriana Syahira" },
    { id_user: 79, username: "Apipah afra nayra" },
    { id_user: 69, username: "Nabil Al Faqih" },
    { id_user: 70, username: "Rahma Ayu Andari" },
    { id_user: 60, username: "Maira Salsabiela mey" },
    { id_user: 65, username: "fadhella varisha" },
  ];
  
  const generateRandomTime = (baseDate) => {
    const hour = Math.floor(Math.random() * 3) + 7; // Antara jam 7 dan 9 pagi
    const minute = Math.floor(Math.random() * 60);
    return moment(baseDate).set({ hour, minute }).format('YYYY-MM-DD HH:mm:ss');
  };
  
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  const insertDummyData = async () => {
    const totalDays = 30;
    const today = moment().format('YYYY-MM-DD');
    const insertQuery = `
      INSERT INTO attendance (id_user, username, check_in_date, check_in_time, check_out_time, status)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
  
    for (const user of users) {
      let days = Array.from({ length: totalDays }, (_, i) => i + 1);
      days = shuffleArray(days).slice(0, 10); // Ambil 10 hari secara acak
  
      for (const day of days) {
        const check_in_date = moment().subtract(day, 'days').format('YYYY-MM-DD');
        if (check_in_date !== today) { // Pastikan data bukan untuk hari ini
          const check_in_time = generateRandomTime(check_in_date);
          const check_out_time = moment(check_in_time).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
          const status = 'Worked';
  
          try {
            await pool.query(insertQuery, [user.id_user, user.username, check_in_date, check_in_time, check_out_time, status]);
            console.log(`Berhasil menambahkan data untuk ${user.username} pada ${check_in_date}`);
          } catch (err) {
            console.error(`Gagal menambahkan data untuk ${user.username} pada ${check_in_date}:`, err.message);
          }
        }
      }
    }
  
    console.log('Proses penambahan data dummy selesai.');
    await pool.end();
  };
  
  insertDummyData();