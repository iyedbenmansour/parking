import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Zonedash() {
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
                        acc[carModel] = { total: 0, zones: {} };
                    }
                    acc[carModel].total += 1;
                    if (!acc[carModel].zones[title]) {
                        acc[carModel].zones[title] = 0;
                    }
                    acc[carModel].zones[title] += 1;
                    return acc;
                }, {});

                const carModelData = [];
                for (const carModel in groupedBookings) {
                    const total = groupedBookings[carModel].total;
                    const zones = groupedBookings[carModel].zones;
                    const percentages = {};
                    for (const zone in zones) {
                        percentages[zone] = (zones[zone] / total) * 100;
                    }
                    carModelData.push({ carModel, percentages });
                }

                setCarModelData(carModelData);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, []);

    const ZonedashChart = ({ carModel, percentages, color }) => {
        const data = Object.entries(percentages).map(([zone, percentage]) => ({ zone, percentage: percentage.toFixed(2) }));

        return (
            <div className="zonedash-chart">
                <h2>{carModel} Dashboard:</h2>
                <BarChart
                    width={600}
                    height={490} // Increased chart height
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="zone" />
                    <YAxis ticks={[0, 20, 40, 60, 80, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percentage" fill={color} />
                </BarChart>
            </div>
        );
    };

    return (
        <div className="zonedash-container">
            {carModelData.map(({ carModel, percentages }, index) => (
                <ZonedashChart key={carModel} carModel={carModel} percentages={percentages} color={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
            ))}
        </div>
    );
}
