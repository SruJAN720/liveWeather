import '/Users/srujanvandavasi/Desktop/route/route1/src/WeatherDCS.css';
import React, { useEffect, useState } from 'react';

function WeatherData() {
    const [weatherData, setWeatherData] = useState({
        temp: null,
        isDay: null,
        wind: null,
        windDir: null,
        pressure: null,
        precipitation: null,
        humidity: null,
        feelsLike: null,
        visibility: null,
        uv: null,
        dewPoint: null,
    });
    const [error, setError] = useState(null);
    const [bgColor, setBgColor] = useState('');
    const [warnings, setWarnings] = useState([]);
    const city = 'Patna';

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch('http://api.weatherapi.com/v1/current.json?key=e2c926f4177e4ae3aeb124954242709&q=Patna');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const temp = data.current.temp_c;
                const humidity = data.current.humidity;
                const precipitation = data.current.precip_mm;
                const uv = data.current.uv;

                setWeatherData({
                    temp: temp,
                    isDay: data.current.is_day,
                    wind: data.current.wind_kph,
                    windDir: data.current.wind_dir,
                    pressure: data.current.pressure_mb,
                    precipitation: precipitation,
                    humidity: humidity,
                    feelsLike: data.current.feelslike_c,
                    visibility: data.current.vis_km,
                    uv: uv,
                    dewPoint: data.current.dewpoint_c,
                });

                if (data.current.vis_km < 0.1) {
                    setBgColor('red'); // Set to red if visibility is less than 0.1 km
                    setWarnings(prevWarnings => [...prevWarnings, "Critical visibility is less than 0.1 km!"]);
                } else {
                    setBgColor(''); // Reset color if visibility is fine
                }

                // Check wind speed for warnings
                if (data.current.wind_kph > 45) {
                    setWarnings(prevWarnings => [...prevWarnings, "Warning: Wind speed exceeds 45 kph!"]);
                }

                if (temp > 45) {
                    setWarnings(prevWarnings => [...prevWarnings, "Warning: Temperature exceeds 45 °C!"]);
                } else if (temp < -10) {
                    setWarnings(prevWarnings => [...prevWarnings, "Warning: Temperature is below -10 °C!"]);
                }
                if (humidity > 90) {
                    setWarnings(prevWarnings => [...prevWarnings, "Warning: Humidity exceeds 90%!"]);
                }
                if (precipitation > 7.6) {
                    setWarnings(prevWarnings => [...prevWarnings, "Warning: Precipitation exceeds 7.6 mm!"]);
                }
                if (uv > 6) {
                    setWarnings(prevWarnings => [...prevWarnings, "Warning: UV index exceeds 6!"]);
                }

            } catch (err) {
                setError(err.message);
            }
        };
        fetchWeatherData();
    }, []);

    return (
        <div className="weather-container" style={{ backgroundColor: bgColor }}>
            <h2>Current Weather Data in {city}</h2>
            {error && <p className="error">Error: {error}</p>}
            <div className="weather-data">
                <p>Temperature: {weatherData.temp} °C</p>
                <p>Is Day: {weatherData.isDay ? 'Yes' : 'No'}</p>
                <p>Wind: {weatherData.wind} kph</p>
                <p>Wind Direction: {weatherData.windDir}</p>
                <p>Pressure: {weatherData.pressure} mb</p>
                <p>Precipitation: {weatherData.precipitation} mm</p>
                <p>Humidity: {weatherData.humidity} %</p>
                <p>Feels Like: {weatherData.feelsLike} °C</p>
                <p>Visibility: {weatherData.visibility} km</p>
                <p>UV: {weatherData.uv}</p>
                <p>Dew Point: {weatherData.dewPoint} °C</p>
            </div>
            {warnings.length > 0 && (
                <>
                    <h3>Warnings:</h3>
                    {warnings.map((warning, index) => (
                        <p key={index} className="warning">{warning}</p>
                    ))}
                </>
            )}
            <h3>Warning Explanations:</h3>
            <table className="warning-table">
                <thead>
                    <tr>
                        <th>Condition</th>
                        <th>Warning</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Visibility</td>
                        <td>Critical visibility is less than 0.1 km!</td>
                    </tr>
                    <tr>
                        <td>Wind Speed</td>
                        <td>Exceeds 45 kph!</td>
                    </tr>
                    <tr>
                        <td>Temperature</td>
                        <td>Exceeds 45 °C or below -10 °C!</td>
                    </tr>
                    <tr>
                        <td>Humidity</td>
                        <td>Exceeds 90%!</td>
                    </tr>
                    <tr>
                        <td>Precipitation</td>
                        <td>Exceeds 7.6 mm!</td>
                    </tr>
                    <tr>
                        <td>UV Index</td>
                        <td>Exceeds 6!</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default WeatherData;