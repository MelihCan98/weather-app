const cityInput = document.querySelector(".inputText");
const btn = document.querySelector(".btn");
btn.addEventListener("click", () => {
  getData(cityInput.value);
  getForecast(cityInput.value);
});

function getData(name) {
  const API = "f90601b19afa952d1815cdb9c2db86e7";
  const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}&units=metric&lang=tr`;
  fetch(baseUrl)
    .then((res) => res.json())
    .then((data) => {
      const {
        name,
        sys: { country },
        main: { temp, feels_like },
        weather: [{ description }],
      } = data;
      const city = document.querySelector("#sehir");
      const temperature = document.querySelector("#sicaklik");
      const weatherDesc = document.querySelector("#havaDurumu");
      const feel = document.querySelector("#hissedilen");
      city.textContent = `${name},${country}`;
      weatherDesc.textContent = `${description}`;
      temperature.textContent = `${temp}`;
      feel.textContent = `${feels_like}`;
    })
    .catch((err) => console.error(err));
}

// 5 günlük tahmin fonksiyonu
function getForecast(name) {
  const API = "f90601b19afa952d1815cdb9c2db86e7";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${API}&units=metric&lang=tr`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const forecastList = document.getElementById("forecast-list");
      forecastList.innerHTML = ""; // Önceki tahminleri temizle

      // Her gün için öğlen 12:00 verisini al
      const dailyData = {};
      data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        const hour = item.dt_txt.split(" ")[1];
        if (hour === "12:00:00" && !dailyData[date]) {
          dailyData[date] = item;
        }
      });

      Object.values(dailyData)
        .slice(0, 5)
        .forEach((item) => {
          const date = new Date(item.dt_txt);
          const day = date.toLocaleDateString("tr-TR", { weekday: "long" });
          const temp = Math.round(item.main.temp);
          const desc = item.weather[0].description;
          const icon = item.weather[0].icon;

          const card = document.createElement("div");
          card.className = "forecast-card";
          card.innerHTML = `
          <div>${day}</div>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
          <div>${temp}°C</div>
          <div>${desc}</div>
        `;
          forecastList.appendChild(card);
        });
    })
    .catch((err) => console.error(err));
}
