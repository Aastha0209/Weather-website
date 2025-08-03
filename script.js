document.getElementById("searchButton").addEventListener("click", searchWeather);
document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchWeather();
    }
});

const apiKey = "d40420b0536b040d8e93a200fe16e01b"; // OpenWeatherMap API Key
const newsApiKey = "35b3171387ea4fb998394f0cf7a96c5c"; // NewsAPI Key

async function searchWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found!");

        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        alert("Error fetching weather data. Please try again.");
    }
}

function updateWeatherUI(data) {
    document.getElementById("weather-info").style.display = "block";
    document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `🌡 ${data.main.temp}°C`;
    document.getElementById("condition").textContent = `☁️ ${data.weather[0].description}`;

    updateBackground(data.weather[0].main);
}

function updateBackground(weatherCondition) {
    const body = document.body;
    body.classList.remove("sunny", "rainy", "cloudy", "snowy", "default-bg");

    const weatherClasses = {
        "Clear": "sunny",
        "Clouds": "cloudy",
        "Rain": "rainy",
        "Drizzle": "rainy",
        "Thunderstorm": "rainy",
        "Snow": "snowy",
        "Mist": "cloudy",
        "Haze": "cloudy"
    };

    const newClass = weatherClasses[weatherCondition] || "default-bg";
    body.classList.add(newClass);
}

const defaultCities = ["New York", "London", "Tokyo", "Mumbai"];
window.addEventListener("load", () => {
    defaultCities.forEach((city, index) => fetchCityWeather(city, `city${index + 1}`));
    fetchNews();
    fetchAirQualityAndUV();
});

async function fetchCityWeather(city, elementId) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found!");

        const data = await response.json();
        document.getElementById(elementId).innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <p>🌡 ${data.main.temp}°C</p>
            <p>☁️ ${data.weather[0].description}</p>
        `;
    } catch (error) {
        document.getElementById(elementId).textContent = "Error loading weather data";
    }
}

async function fetchNews() {
    const url = `https://newsapi.org/v2/everything?q=weather&sortBy=publishedAt&apiKey=${newsApiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching news");

        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        document.getElementById("news-feed").textContent = "Error loading news";
    }
}

function displayNews(articles) {
    const newsFeed = document.getElementById("news-feed");
    newsFeed.innerHTML = "";

    articles.slice(0, 5).forEach(article => {
        const newsItem = document.createElement("div");
        newsItem.classList.add("news-item");
        newsItem.innerHTML = `
            <img src="${article.urlToImage || 'placeholder.jpg'}" alt="News Image">
            <h3>${article.title}</h3>
            <p>${article.description || "No description available."}</p>
            <a href="${article.url}" target="_blank">Read More</a>
        `;
        newsFeed.appendChild(newsItem);
    });
}

async function fetchAirQualityAndUV() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            const uvUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

            try {
                const [aqiResponse, uvResponse] = await Promise.all([
                    fetch(aqiUrl), fetch(uvUrl)
                ]);

                if (!aqiResponse.ok || !uvResponse.ok) throw new Error("Error fetching AQI/UV data");

                const aqiData = await aqiResponse.json();
                const uvData = await uvResponse.json();

                document.getElementById("aqi-value").textContent = aqiData.list[0].main.aqi;
                document.getElementById("uv-value").textContent = uvData.current.uvi;
                updateHealthWarning(aqiData.list[0].main.aqi, uvData.current.uvi);
            } catch (error) {
                document.getElementById("aqi-value").textContent = "Error loading AQI";
                document.getElementById("uv-value").textContent = "Error loading UV Index";
            }
        }, () => {
            document.getElementById("aqi-value").textContent = "Location permission denied";
            document.getElementById("uv-value").textContent = "Location permission denied";
        });
    } else {
        document.getElementById("aqi-value").textContent = "Geolocation not supported";
        document.getElementById("uv-value").textContent = "Geolocation not supported";
    }
}

function updateHealthWarning(aqi, uv) {
    let warning = "";

    if (aqi > 3) {
        warning += "⚠️ Poor air quality! Consider wearing a mask outside. ";
    }
    if (uv > 5) {
        warning += "☀️ High UV Index! Use sunscreen and stay hydrated. ";
    }
    document.getElementById("health-warning").textContent = warning || "Air quality and UV levels are good!";
}

// ✅ Scroll Button Functionality for News Section
document.getElementById("scroll-left").addEventListener("click", () => {
    document.getElementById("news-feed").scrollBy({ left: -300, behavior: 'smooth' });
});

document.getElementById("scroll-right").addEventListener("click", () => {
    document.getElementById("news-feed").scrollBy({ left: 300, behavior: 'smooth' });
});
