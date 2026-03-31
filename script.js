const list = document.getElementById("list");

let allPlaces = [];
let itineraries = [];
let currentDay = "day1";
let currentType = "all";

/* =========================
   載入資料
========================= */

async function loadData() {
  try {
    const placesRes = await fetch("./data/places.json");
    const itineraryRes = await fetch("./data/itinerary.json");

    allPlaces = await placesRes.json();
    itineraries = await itineraryRes.json();

    render();
  } catch (err) {
    console.error(err);
    list.innerHTML = "<p>❌ 資料載入失敗，請確認 JSON 結構</p>";
  }
}

/* =========================
   統一取得行程順序
   ✅ 同時支援 places / stops
========================= */

function getStops(dayData) {
  // ✅ 新格式
  if (Array.isArray(dayData.stops)) {
    return dayData.stops;
  }

  // ✅ 舊格式自動轉換
  if (Array.isArray(dayData.places)) {
    return dayData.places.map(id => ({ place: id }));
  }

  return [];
}

/* =========================
   主渲染
========================= */

function render() {
  list.innerHTML = "";

  const dayData = itineraries.find(d => d.day === currentDay);
  if (!dayData) return;

  const stops = getStops(dayData);

  stops.forEach(item => {

    /* ===== 交通說明 ===== */
    if (item.transport) {
      const t = document.createElement("div");
      t.className = "transport";
      t.innerText = item.transport;
      list.appendChild(t);
      return;
    }

    /* ===== 地點卡片 ===== */
    if (item.place) {
      const place = allPlaces.find(p => p.id === item.place);
      if (!place) return;

      if (currentType !== "all" && place.type !== currentType) return;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="card-header">
          <h3>${place.name}</h3>
          <span class="card-type">
            ${place.type === "restaurant" ? "餐廳" : "景點"}
          </span>
        </div>

        <div class="card-details">
          <p>${place.description || ""}</p>
          <button class="map-btn">📍 在 Google 地圖中開啟</button>
        </div>
      `;

      card.querySelector(".card-header").onclick = () => {
        document.querySelectorAll(".card.open").forEach(c => {
          if (c !== card) c.classList.remove("open");
        });
        card.classList.toggle("open");
      };

      card.querySelector(".map-btn").onclick = (e) => {
        e.stopPropagation();
        window.location.href = place.map_url;
      };

      list.appendChild(card);
    }
  });
}

/* =========================
   Tabs / Filters
========================= */

document.querySelectorAll("#tabs button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("#tabs button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentDay = btn.dataset.day;
    render();
  };
});

document.querySelectorAll("#filters button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("#filters button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentType = btn.dataset.type;
    render();
  };
});

/* =========================
   啟動
========================= */

loadData();
``
