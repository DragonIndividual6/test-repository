const form = document.getElementById("weatherForm");
const result = document.getElementById("result");

const apiKey = "7e67074d66d795f5ae90ceb13d7def6f";

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // 名前の取得
  const select = document.getElementById("prefSelect");
  const selectedName = select.options[select.selectedIndex].text;

  const value = document.getElementById("prefSelect").value;
  if (!value) return;

  const [lat, lon] = value.split(",");

  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`)
    .then(res => res.json())
    .then(data => {

      if (data.cod !== "200") {
        result.innerHTML = "<p>取得失敗</p>";
        return;
      }

      const today = new Date().getDate();
      const tomorrow = today + 1;

      let todayData = [];
      let tomorrowData = [];

      data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.getDate();
        const hour = date.getHours();

        // 0,6,12,18時だけ取得
        if ([0, 6, 12, 18].includes(hour)) {
          if (day === today) {
            todayData.push(item);
          } else if (day === tomorrow) {
            tomorrowData.push(item);
          }
        }
      });

      result.innerHTML = `
        <h2>${selectedName}</h2>
        <h3>今日</h3>
        ${renderWeather(todayData)}
        <h3>明日</h3>
        ${renderWeather(tomorrowData)}
        `;
    })
    .catch(() => {
      result.innerHTML = "<p>エラー発生</p>";
    });
});

function renderWeather(arr) {
  if (arr.length === 0) return "<p>データなし</p>";

  return arr.map(item => {
    const date = new Date(item.dt * 1000);
    const hour = date.getHours();

    return `
      <p>
        ${hour}時 :
        ${item.weather[0].description} /
        ${item.main.temp} ℃
      </p>
    `;
  }).join("");
}