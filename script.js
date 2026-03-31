const list = document.getElementById("list");

const allPlaces = [
  {
    id: "asakusa",
    name: "淺草寺",
    type: "attraction",
    description: "測試用景點",
    map_url: "https://www.google.com/maps/search/?api=1&query=淺草寺"
  },
  {
    id: "ueno_zoo",
    name: "上野動物園",
    type: "attraction",
    description: "測試用動物園",
    map_url: "https://www.google.com/maps/search/?api=1&query=上野動物園"
  }
];

const itineraries = [
  {
    day: "day1",
    stops: [
      { place: "asakusa" },
      { transport: "🚇 測試交通：淺草 → 上野" },
      { place: "ueno_zoo" }
    ]
  }
];

let currentDay = "day1";

function render() {
  list.innerHTML = "";

  const dayData = itineraries.find(d => d.day === currentDay);
  if (!dayData) {
    list.innerHTML = "<p>找不到 day</p>";
    return;
  }

  dayData.stops.forEach(item => {

    if (item.transport) {
      const t = document.createElement("div");
      t.className = "transport";
      t.innerText = item.transport;
      list.appendChild(t);
      return;
    }

    if (item.place) {
      const place = allPlaces.find(p => p.id === item.place);
      if (!place) return;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="card-header">
          <h3>${place.name}</h3>
        </div>
        <div class="card-details">
          <p>${place.description}</p>
          <button class="map-btn">在地圖中開啟</button>
        </div>
      `;

      card.querySelector(".card-header").onclick = () => {
        card.classList.toggle("open");
      };

      card.querySelector(".map-btn").onclick = () => {
        window.location.href = place.map_url;
      };

      list.appendChild(card);
    }
  });
}

render();
