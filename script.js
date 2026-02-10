// selecting the elements
let city_input = document.getElementById("city-input");
let search_btn = document.getElementById("search-btn");
let city_display = document.getElementById("city-name");
let current_date = document.getElementById("current-date");
let current_temp = document.getElementById("current-temp");
let weather_desc = document.getElementById("weather-desc");
let weather_icon_main = document.getElementById("weather-icon-main");
let apparent_temp = document.getElementById("feels-like");
let curr_humidity = document.getElementById("humidity");
let curr_wind = document.getElementById("wind-speed");
let atm_pressure = document.getElementById("pressure");
let daily_forecast_container = document.getElementById("daily-forecast-container");
let hourly_container = document.getElementById("hourly-container");
let hourly_container_day = document.getElementById("hourly-container-day");

// globally declared variables
const weatherMap = {
    // Clear / Cloudy (Added Night Icons)
    0: { desc: "Sunny", icon: "fa-sun", night: "fa-moon", color: "text-yellow-400" },
    1: { desc: "Mainly Clear", icon: "fa-cloud-sun", night: "fa-cloud-moon", color: "text-yellow-200" },
    2: { desc: "Partly Cloudy", icon: "fa-cloud-sun", night: "fa-cloud-moon", color: "text-gray-400" },
    3: { desc: "Overcast", icon: "fa-cloud", night: "fa-cloud-moon", color: "text-gray-500" },

    // Fog
    45: { desc: "Foggy", icon: "fa-smog", color: "text-gray-400" },
    48: { desc: "Rime Fog", icon: "fa-smog", color: "text-gray-400" },

    // Drizzle
    51: { desc: "Light Drizzle", icon: "fa-cloud-rain", color: "text-blue-300" },
    53: { desc: "Drizzle", icon: "fa-cloud-rain", color: "text-blue-400" },
    55: { desc: "Heavy Drizzle", icon: "fa-cloud-showers-heavy", color: "text-blue-500" },

    // Freezing Drizzle
    56: { desc: "Freezing Drizzle", icon: "fa-snowflake", color: "text-blue-300" },
    57: { desc: "Heavy Freezing Drizzle", icon: "fa-snowflake", color: "text-blue-500" },

    // Rain
    61: { desc: "Slight Rain", icon: "fa-cloud-rain", color: "text-blue-400" },
    63: { desc: "Rain", icon: "fa-cloud-showers-heavy", color: "text-blue-500" },
    65: { desc: "Heavy Rain", icon: "fa-cloud-showers-water", color: "text-blue-600" },

    // Freezing Rain
    66: { desc: "Freezing Rain", icon: "fa-snowflake", color: "text-blue-400" },
    67: { desc: "Heavy Freezing Rain", icon: "fa-snowflake", color: "text-blue-600" },

    // Snow
    71: { desc: "Slight Snow", icon: "fa-snowflake", color: "text-white" },
    73: { desc: "Moderate Snow", icon: "fa-snowflake", color: "text-white" },
    75: { desc: "Heavy Snow", icon: "fa-snowflake", color: "text-white" },
    77: { desc: "Snow Grains", icon: "fa-snowflake", color: "text-white" },

    // Showers
    80: { desc: "Slight Showers", icon: "fa-cloud-rain", color: "text-blue-300" },
    81: { desc: "Moderate Showers", icon: "fa-cloud-showers-heavy", color: "text-blue-400" },
    82: { desc: "Violent Showers", icon: "fa-cloud-showers-water", color: "text-blue-600" },
    85: { desc: "Snow Showers", icon: "fa-snowflake", color: "text-white" },
    86: { desc: "Heavy Snow Showers", icon: "fa-snowflake", color: "text-white" },

    // Thunderstorm
    95: { desc: "Thunderstorm", icon: "fa-bolt", color: "text-yellow-500" },
    96: { desc: "Thunderstorm & Hail", icon: "fa-bolt", color: "text-yellow-500" },
    99: { desc: "Heavy Thunderstorm", icon: "fa-bolt", color: "text-red-500" },
};


const days = {
    day_ind : {
        Sunday : 1,
        Monday : 2,
        Tuesday : 3 ,
        Wednesday : 4,
        Thursday : 5,
        Friday : 6,
        Saturday : 7,
    },
    ind_day : {
        1 : "Sunday",
        2 : "Monday",
        3 : "Tuesday",
        4 : "Wednesday",
        5 : "Thursday",
        6 : "Friday",
        0 : "Saturady",
    }
};




// functionality section 


search_btn.addEventListener("click", () =>{
    if(city_input.value.trim() === "")
    {
        console.log("enter a valid city name");
        return;
    }
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city_input.value.trim()}&count=1&language=en&format=json`).then((response)=> {
        console.log(response);
        if(!response.ok)
        {
            throw new Error("error encounterred");
        }
        if(response.status === 404)
        {
            throw new Error("server down");
        }
        return response.json();
    }).then((location_data) =>{
        console.log(location_data);
        coordinates = filterfunction1(location_data.results);
        return coordinates;

    }).then((geo_location) =>{
        let lat = geo_location.lat;
        let lon = geo_location.lon;
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`).then((weather_response) =>
        {
            if(!weather_response.ok)
            {
                throw new Error("not a valid geo location");
            }
            return weather_response.json();
        }).then((weather_data) => {
            console.log(weather_data);
            renderformain(weather_data.current);
            renderdaily(weather_data.daily);
            renderhourly(weather_data.hourly);

        })
    }).catch((response)=>{
        alert("something went wrong");
        return;
    })

})


// Helper function 
function filterfunction1(location_data)
{
    let filtered_data = location_data.map((weather_object) => {
        return {
            lat : weather_object.latitude,
            lon : weather_object.longitude,
            name : weather_object.name,
            country : weather_object.country,
        };
    });
    return filtered_data[0];
}

function getDateDetails(inputDate = new Date()) {
    const dateObj = new Date(inputDate);
    
    // Array for Day Names
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return {
        date: dateObj.getDate(),        // e.g., 10
        year: dateObj.getFullYear(),    // e.g., 2026
        dayName: days[dateObj.getDay()], // e.g., "Tuesday"
        
        // New: Short Month Name (e.g., "Feb")
        monthShort: dateObj.toLocaleString('default', { month: 'short' })
    };
}


function renderformain(current_data)
{
    city_display.textContent=`${coordinates.name} , ${coordinates.country}`;
    current_temp.textContent=`${current_data.temperature_2m}`;
    apparent_temp.textContent= `${current_data.apparent_temperature}`;
    curr_wind.textContent = `${current_data.wind_speed_10m}`;
    atm_pressure.textContent=`${current_data.surface_pressure}`;
    curr_humidity.textContent = `${current_data.relative_humidity_2m}`;
    
    let current_weather_code = current_data.weather_code;
    let weather_info = weatherMap[current_weather_code] || weatherMap[0];
    
    let code_desc = weather_info.desc;
    
    let currentHour = new Date().getHours();
    let isNight = currentHour >= 19 || currentHour < 6;
    let code_icon = weather_info.icon;
    
    if (isNight && weather_info.night) {
        code_icon = weather_info.night;
    }

    console.log(code_desc);

    weather_desc.textContent=`${code_desc}`;
    let weather_color = weather_info.color;
    weather_icon_main.className = `fa-solid ${code_icon} ${weather_color} text-6xl`;
}
function renderdaily(weather_data)
{
    let weather_codes = weather_data.weather_code;
    let temp_2m = weather_data.temperature_2m_max;
    daily_forecast_container.innerHTML=``;
    let today = getDateDetails();
    hourly_container_day.textContent = today.dayName;
    let curr_day = today.dayName;
    let curr_date = today.date;
    current_date.textContent=`${curr_day}, ${today.monthShort} ${curr_date}, ${today.year}`;
    let ind = days.day_ind;
    let next_day_id = ind[curr_day]+1;
    let fragemnt = document.createDocumentFragment();
    for(let i=0;i<=6;i++)
    {
        let next_day_tempe = temp_2m[i];
        let next_day_code = weather_codes[i];
        let next_day_image= weatherMap[next_day_code].icon;
        let next_day_text = weatherMap[next_day_code].color;
        let next_day = days.ind_day[next_day_id];
        console.log(next_day);
        next_day_id = (next_day_id+1)%7;

        // creating the card
        let next_day_card = document.createElement("div");
        next_day_card.className=`bg-[#202B3B] p-3 rounded-xl text-center hover:bg-[#2d3b4e] transition`;

        // setting the day name
        let next_day_name= document.createElement("p");
        next_day_name.textContent=`${next_day}`;
        next_day_name.className =`text-gray-400 text-xs mb-2`;

        // setting the icon 
        let next_day_icon = document.createElement("i");
        next_day_icon.className =`fa-solid ${next_day_image} ${next_day_text} text-xl mb-2`


        // setting the data for the temperature
        let next_day_temperature = document.createElement("p");
        next_day_temperature.textContent = next_day_tempe;
        next_day_temperature.className =`text-sm font-bold`;


        // apennding all the childrens
        next_day_card.appendChild(next_day_name);
        next_day_card.appendChild(next_day_icon);
        next_day_card.appendChild(next_day_temperature);

        // appending it to the fragment

        fragemnt.appendChild(next_day_card);
    }
    daily_forecast_container.appendChild(fragemnt);

}


function renderhourly(hourly_data) {
    let temperature = hourly_data.temperature_2m;
    let time_stamps = hourly_data.time;
    let weather_codes = hourly_data.weather_code;
    
    hourly_container.innerHTML = "";
    
    const currentHour = new Date().getHours();
    
    let fragment = document.createDocumentFragment();

    for(let i = currentHour; i < currentHour + 24; i++) {
        if(!temperature[i]) break;

        let temp = temperature[i];
        let code = weather_codes[i];
        let timeRaw = time_stamps[i]; 

        let timeDisplay = timeRaw.split("T")[1]; 
        
        // Extract the hour as a number (e.g., "19" from "19:00")
        let hour = parseInt(timeDisplay.split(":")[0]);

        let weather_info = weatherMap[code] || weatherMap[0];

        // LOGIC: Check if it is Night (>= 19:00 OR < 06:00)
        let iconClass = weather_info.icon; // Default to day icon
        let isNight = hour >= 19 || hour < 6;

        // If it is night AND a night icon exists in the map, use it
        if (isNight && weather_info.night) {
            iconClass = weather_info.night;
        }

        let hourly_card = document.createElement("div");
        hourly_card.className = `bg-[#202B3B] p-3 rounded-xl text-center min-w-[80px] hover:bg-[#2d3b4e] transition mr-3`;

        let time_elem = document.createElement("p");
        time_elem.textContent = timeDisplay;
        time_elem.className = `text-gray-400 text-xs mb-2`;

        let icon_elem = document.createElement("i");
        // Use the dynamic iconClass variable here
        icon_elem.className = `fa-solid ${iconClass} ${weather_info.color} text-lg mb-2`;

        let temp_elem = document.createElement("p");
        temp_elem.textContent = `${temp}°C`;
        temp_elem.className = `text-sm font-bold text-gray-100`;

        hourly_card.appendChild(time_elem);
        hourly_card.appendChild(icon_elem);
        hourly_card.appendChild(temp_elem);

        fragment.appendChild(hourly_card);
    }
    
    hourly_container.appendChild(fragment);
}