import React, { useEffect, useState } from 'react'
import { MdLocationPin } from "react-icons/md"
import cloud from "../images/cloud.png"
import Haze from "../images/Haze.png"
import rain from "../images/rain.png"
import sun from "../images/sun.png"
import fog from "../images/fog.png"
import moon from "../images/moon.png"
import moonHaze from "../images/moonHaze.png"
import "./Weather.css";

const Weather = () => {
    const [finalweather, setfinalweather] = useState("karachi")
    const [currWeather, setWeather] = useState("");
    const [api, setapi] = useState(null);
    const [location, setlocation] = useState(null)
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setlocation(position);
                setfinalweather("");
            }, () => console.log("Error"));
        }
        else {
            alert("Geolocation is not supported by this browser.");
        }
    }, []);
    useEffect(() => {
        let navigate = location && location.coords
            ? `lat=${location.coords.latitude}&lon=${location.coords.longitude}`
            : `q=${finalweather}`;
        fetch(`https://api.openweathermap.org/data/2.5/weather?${navigate}&appid=d4f833131ea6da8bf9a113b6691ad0fd&units=metric`)
            .then((res) => res.json())
            .then((result) => setapi(result))
            .catch((err) => console.log(err));
    }, [finalweather]);
    const date = new Date;
    const month = date.getMonth();
    const month_arr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const final_month = month_arr[month];
    const date2 = date.getDate();
    const final_date = `${final_month} ${date2}`;
    const day = date.getDay();
    const day_arr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const final_day = day_arr[day];
    const typeofweather = api && api.weather && api.weather[0] && api.weather[0].main;
    let shift = api && api.weather && api.weather[0] && api.weather[0].icon && api.weather[0].icon[2]
    let image_src;
    switch (typeofweather) {
        case "Sunny" && "Clear":
            switch (shift){
                case "d":
                    image_src = sun
                    break;
                default:
                    image_src = moon

                    break;
            }
            break;
        case "Haze":
            switch (shift) {
                case "d":
                    image_src = Haze
                    break;
                default:
                    image_src = moonHaze;
                    break;
            }
            break;
        case "Clouds":
            image_src = cloud
            break;
        case "Rain":
            image_src = rain
            break;
        case "Drizzle":
            image_src = rain
            break;
        case "Smoke":
            image_src = fog
            break;
    }
    return (
        <>
            <div className="MainBox">
                <h1>Weather Forecast</h1>
                <div className='container'>
                    <div className="details">
                        <div className="cityname">
                            <MdLocationPin fontSize="24px" />
                            <h3>{api && api.name}</h3>
                        </div>
                        <div className="date">
                            <h4>{final_date}</h4>
                        </div>
                    </div>
                    <div className="day">{final_day}</div>
                    <div className="temp">
                        <div className="image">
                            <img src={image_src} width="150px" height="150px" />
                            <h4>{typeofweather}</h4>
                        </div>
                        <div className="feel">
                            <div>{Math.round(api && api.main && api.main.temp)}<span>º</span></div>
                            <h4>Feels Like {Math.round(api && api.main && api.main.feels_like)}</h4>
                        </div>
                    </div>
                    <div className="input_field">
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            setfinalweather(() => currWeather);
                            setWeather("");
                            setlocation(null);
                        }}>
                            <input type="text"
                                autoFocus
                                placeholder='Enter Your City Name'
                                value={currWeather}
                                onChange={(e) => setWeather(e.target.value)} />
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Weather
