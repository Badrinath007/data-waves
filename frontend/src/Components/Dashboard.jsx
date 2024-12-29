import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the Flask API
    fetch('http://127.0.0.1:5000/data')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data from API');
        }
        return response.json();
      })
      .then((jsonData) => {
        console.log('Fetched Data:', jsonData); // Log to confirm structure
        setData(jsonData); // Set the fetched list to the state
      })
      .catch((error) => console.error('Error loading data:', error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {data.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Position</th>
              <th className="border border-gray-300 px-4 py-2">P+</th>
              <th className="border border-gray-300 px-4 py-2">Artist and Title</th>
              <th className="border border-gray-300 px-4 py-2">Weeks</th>
              <th className="border border-gray-300 px-4 py-2">Pk</th>
              <th className="border border-gray-300 px-4 py-2">(x?)</th>
              <th className="border border-gray-300 px-4 py-2">Streams</th>
              <th className="border border-gray-300 px-4 py-2">Streams+</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                <td className="border border-gray-300 px-4 py-2">{item.Pos}</td>
                <td className="border border-gray-300 px-4 py-2">{item["P+"]}</td>
                <td className="border border-gray-300 px-4 py-2">{item["Artist and Title"]}</td>
                <td className="border border-gray-300 px-4 py-2">{item.Wks}</td>
                <td className="border border-gray-300 px-4 py-2">{item.Pk}</td>
                <td className="border border-gray-300 px-4 py-2">{item["(x?)"]}</td>
                <td className="border border-gray-300 px-4 py-2">{item.Streams}</td>
                <td className="border border-gray-300 px-4 py-2">{item["Streams+"]}</td>
                <td className="border border-gray-300 px-4 py-2">{item.Total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Dashboard;
