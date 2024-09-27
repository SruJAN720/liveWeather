import React, { useState, useEffect } from 'react';
import '/Users/srujanvandavasi/Desktop/route/route1/src/RouteTime.css';

const RouteTime = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_KEY = '5b3ce3597851110001cf62481062e9c04cfc4d67bfa1d9618f38cc37';
    const BASE_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';

    const fetchRouteData = async () => {
        const startPoint = 'Vellore, Tamil Nadu';
        const endPoint = 'Mysore, Karnataka';

        const requestUrl = `${BASE_URL}?start=17.4065,78.4772°&end=12.9716,77.5946`; // You need to provide the correct coordinates

        try {
            const response = await fetch(requestUrl, {
                headers: {
                    'Authorization': API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const routeData = await response.json();
            setData(routeData.routes[0]); // Get the first route
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRouteData();
    }, []);

    return (
        <div className="route-container">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {data && (
                <div className="route-info">
                    <h2>Route Information</h2>
                    <p>Duration: {data.summary.duration / 60} minutes</p>
                    <p>Distance: {data.summary.distance / 1000} km</p>
                    <p>Estimated Arrival: {new Date(Date.now() + data.summary.duration * 1000).toLocaleTimeString()}</p>
                </div>
            )}
        </div>
    );
};

export default RouteTime;
