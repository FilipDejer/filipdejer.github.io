const API_KEY = "023e7bb5c038c176c82e038eba3488c9";

const inputCity = document.getElementById("cityInput");
const btnWeather = document.getElementById("getWeatherBtn");
const sectionCurrent = document.getElementById("currentWeather");
const sectionForecast = document.getElementById("forecast");
const containerForecast = document.getElementById("forecastContainer");

btnWeather.addEventListener("click", () => {
  const city = inputCity.value.trim();
  if (city === "") {
    alert("Proszę wpisać nazwę miejscowości!");
    return;
  }

  fetchCurrentWeather(city);
  fetchForecast(city);
});

function fetchCurrentWeather(city) {
  const curr = new XMLHttpRequest();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

  curr.open("GET", url, true);
  curr.onload = function () {
    if (curr.status === 200) {
      const data = JSON.parse(curr.responseText);
      console.log("Odpowiedź API (Current Weather - XML)");
      console.log(data);

      displayCurrentWeather(data);
    } else {
      console.error("Błąd", curr.statusText);
      alert("Nie udało się pobrać bieżącej pogody.");
    }
  };
  curr.onerror = function () {
    console.error("Błąd");
  };
  curr.send();
}

function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Błąd sieci lub nie znaleziono miasta");
      }
      return response.json();
    })
    .then(data => {
      console.log("Odpowiedź API (5 Day Forecast - Fetch)");
      console.log(data);

      displayForecast(data);
    })
    .catch(error => {
      console.error("Błąd:", error);
    });
}

function displayCurrentWeather(data) {
  const date = new Date(data.dt * 1000).toLocaleString('pl-PL');
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  sectionCurrent.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p style="color: #666;">Stan na: ${date}</p>
        <img src="${iconUrl}" alt="${data.weather[0].description}">
        <div class="main-temp">${data.main.temp.toFixed(1)} °C</div>
        <div class="desc">${data.weather[0].description}</div>
        <p>Odczuwalna: <strong>${data.main.feels_like.toFixed(1)} °C</strong> | Wilgotność: ${data.main.humidity}% | Ciśnienie: ${data.main.pressure} hPa</p>
    `;

  sectionCurrent.classList.remove("hidden");
}

function displayForecast(data) {
  containerForecast.innerHTML = "";

  data.list.forEach(item => {
    const dateObj = new Date(item.dt * 1000);
    const dayString = dateObj.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
    const timeString = dateObj.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
            <div style="font-weight: bold;">${dayString}</div>
            <div style="color: #666;">${timeString}</div>
            <img src="${iconUrl}" alt="ikona pogody">
            <div class="f-temp">${item.main.temp.toFixed(1)} °C</div>
            <div style="font-size: 0.85rem;">Odc: ${item.main.feels_like.toFixed(1)} °C</div>
            <div style="font-size: 0.85rem; margin-top: 5px; text-transform: capitalize;">${item.weather[0].description}</div>
        `;
    containerForecast.appendChild(card);
  });

  sectionForecast.classList.remove("hidden");
}
