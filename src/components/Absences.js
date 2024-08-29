import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Absences = () => {
  const [data, setData] = useState([]); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/absences');
        setData(response.data);
        setError(null); // Clear previous errors
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Absences</h1>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      <table className="w-full text-sm text-left text-black-500">
        <thead className="text-xs text-black-700 uppercase bg-black-50">
          <tr>
            <th scope="col" className="px-6 py-3">No</th> {/* New column for numbers */}
            <th scope="col" className="px-6 py-3">User ID</th>
            <th scope="col" className="px-6 py-3">Username</th>
            <th scope="col" className="px-6 py-3">Start Date</th>
            <th scope="col" className="px-6 py-3">End Date</th>
            <th scope="col" className="px-6 py-3">Reason</th>
            <th scope="col" className="px-6 py-3">Proof</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id_user} className="odd:bg-white even:bg-black-50 border-b">
              <td className="px-6 py-4">{index + 1}</td> {/* Display index + 1 for numbering */}
              <td className="px-6 py-4">{item.id_user}</td>
              <td className="px-6 py-4 truncate max-w-xs">{item.username}</td>
              <td className="px-6 py-4">{item.start_date}</td>
              <td className="px-6 py-4">{item.end_date}</td>
              <td className="px-6 py-4">{item.reason}</td>
              <td className="px-6 py-4">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url.endsWith('.pdf') ? (
                      <p className="text-blue-500 underline">View PDF</p>
                    ) : (
                      <img src={item.url} alt="Proof" className="w-24 h-auto" /> // Adjust size as needed
                    )}
                  </a>
                ) : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Absences;
