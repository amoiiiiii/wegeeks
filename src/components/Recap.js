import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Recap = () => {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null); 
  const [recapData, setRecapData] = useState([]); 
  const [dataFound, setDataFound] = useState(true); 

  const fetchData = async (url) => {
    try {
      const params = {
        startDate: startDate ? startDate.toISOString().split('T')[0] : '',
        endDate: endDate ? endDate.toISOString().split('T')[0] : '',
      };
      const response = await axios.get(url, {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      console.log('Response Data:', response.data);

      const formattedData = Array.isArray(response.data) && response.data.length > 0
        ? response.data.map(user => ({
            ...user,
            total_present: user.attendance_count,
            total_absent: user.absences_count,
          }))
        : [];
      
      console.log(response.data);
      setRecapData(formattedData);
      setDataFound(formattedData.length > 0); 
      if (formattedData.length === 0) {
        toast.info('Data Not Found');
      }
    } catch (error) {
      console.error('Error fetching recap data:', error);
      setDataFound(false); 
      toast.error('Failed to fetch data.');
    }
  };
  
  const handleSearch = () => {
    let url = 'http://localhost:8080/api/recap/all';

    if (searchTerm) {
      url = `http://localhost:8080/api/recap/username/${searchTerm}`;
    }
    
    fetchData(url);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="recap-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Cari nama pengguna..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered"
        />
        {searchTerm && (
          <>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Pilih tanggal mulai"
              className="input input-bordered"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="Pilih tanggal akhir"
              className="input input-bordered"
            />
          </>
        )}
        <button onClick={handleSearch} className="btn btn-primary">
          Cari
        </button>
      </div>
      
      {dataFound ? (
        <div className="recap-results">
          <table className="table-auto">
            <thead>
              <tr>
                <th>No</th>
                <th>Username</th>
                <th>Jumlah Kehadiran</th>
                <th>Jumlah Ketidakhadiran</th>
              </tr>
            </thead>
            <tbody>
              {recapData.map((user, index) => (
                <tr key={user.username}>
                  <td className="px-6 py-4">{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.total_present}</td>
                  <td>{user.total_absent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Data Available</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default Recap;
