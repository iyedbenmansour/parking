import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function Userdash() {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await axios.get("http://localhost:5000/api/allusers");
        let users = usersResponse.data.users;

        // Filter users to include only those with the role of "user"
        users = users.filter(user => user.role === 'user');

        // Set the total user count
        setTotalUsers(users.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Data for the bar chart
  const data = [
    {
      name: 'Total Users',
      count: totalUsers,
    },
  ];

  return (
    <div>
      <h2>User Dashboard:</h2>
      <p>Total Users: {totalUsers}</p>
      <BarChart
        width={600}
        height={200}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        layout="vertical"
        barSize={20}
        barCategoryGap={"10%"}
      >
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
}
