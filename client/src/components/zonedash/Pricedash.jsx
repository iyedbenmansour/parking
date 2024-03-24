import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function Pricedash() {
 const [carModelData, setCarModelData] = useState([]);

 useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/allbookings");
        const bookings = response.data.bookings;

        const groupedBookings = bookings.reduce((acc, booking) => {
          const carModel = booking.carModel;
          const title = booking.title;
          if (!acc[carModel]) {
            acc[carModel] = { totalPrice: 0, zones: {} };
          }
          acc[carModel].totalPrice += booking.price;
          if (!acc[carModel].zones[title]) {
            acc[carModel].zones[title] = 0;
          }
          acc[carModel].zones[title] += booking.price;
          return acc;
        }, {});

        const carModelData = [];
        for (const carModel in groupedBookings) {
          const totalPrice = groupedBookings[carModel].totalPrice;
          const zones = groupedBookings[carModel].zones;
          const revenueByZone = Object.entries(zones).map(([zone, revenue]) => ({
            name: zone,
            revenue: revenue,
          }));
          carModelData.push({ carModel, totalPrice, revenueByZone });
        }

        setCarModelData(carModelData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
 }, []);

 const PricedashChart = ({ carModel, totalPrice, revenueByZone }) => {
    const revenueData = Array.isArray(revenueByZone) ? revenueByZone : [];
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f0e', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc658'];

    // Custom tooltip content to show percentage of each slice from the total price
    const renderTooltipContent = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const percentage = (payload[0].value / totalPrice) * 100;
        return (
          <div className="custom-tooltip">
            <p className="label">{`${label} : ${payload[0].value} (${percentage.toFixed(2)}%)`}</p>
          </div>
        );
      }
      return null;
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{carModel} Revenue:</h2>
        <p>Total Price: {totalPrice ? totalPrice.toFixed(2) : '0.00'}</p>
        <PieChart width={400} height={400}>
          <Pie
            data={revenueData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={null}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="revenue"
          >
            {revenueData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={renderTooltipContent} />
          <Legend />
        </PieChart>
      </div>
    );
 };

 return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {carModelData.map(({ carModel, totalPrice, revenueByZone }) => (
        <PricedashChart key={carModel} carModel={carModel} totalPrice={totalPrice} revenueByZone={revenueByZone} />
      ))}
      <style>
        {`
          .custom-tooltip {
            background-color: #fff;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            color: #333;
          }
        `}
      </style>
    </div>
 );
}
