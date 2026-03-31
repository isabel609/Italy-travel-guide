/* =========================
   基本 DOM 與狀態
========================= */

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
    list.innerHTML = "<p>❌ 資料載入失敗，請確認 JSON 路徑</p>";
    console.error(err);
  }
}

/* =========================
   主渲染（支援交通方式）
========================= */

function render() {
  list.innerHTML = "";

  const dayData = itineraries.find(d => d.day === currentDay);
  if (!dayData || !dayData.stops) {
    list.innerHTML = "<p>⚠ 找不到行程資料</p>";
    return;
  }

  dayData.stops.forEach(item => {

    /* ===== 🚏 景點 / 餐廳卡片 ===== */
    if (item.place) {
      const place = allPlaces.find(p => p.id === item.place);
      if (!place) return;

      // 類型篩選
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

          <p><strong>⏰ 營業時間：</strong>${place.opening_hours || "－"}</p>
          <p><strong>🚇 交通方式：</strong>${place.transport || "－"}</p>

          ${
            place.tips
              ? `
                <p><strong>⚠ 注意事項：</strong></p>
                <ul>
                  ${place.tips.map(t => `<li>${t}</li>`).join("")}
                </ul>
              `
              : ""
          }

          <button class="map-btn">📍 在 Google 地圖中開啟</button>
        </div>
      `;

      /* Accordion（一次只開一張） */
      card.querySelector(".card-header").onclick = () => {
        document.querySelectorAll(".card.open").forEach(c => {
          if (c !== card) c.classList.remove("open");
        });
        card.classList.toggle("open");
      };

      /* 開 Google Maps（手機最穩） */
      card.querySelector(".map-btn").onclick = (e) => {
        e.stopPropagation();
        window.location.href = place.map_url;
      };

      list.appendChild(card);
    }

    /* ===== 🚶 交通方式 ===== */
    if (item.transport) {
      const transportDiv = document.createElement("div");
      transportDiv.className = "transport";
      transportDiv.innerHTML = item.transport;
      list.appendChild(transportDiv);
    }

  });
}

/* =========================
   Day 分頁
========================= */

document.querySelectorAll("#tabs button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("#tabs button").forEach(b =>
      b.classList.remove("active")
    );
    btn.classList.add("active");
    currentDay = btn.dataset.day;
    render();
  };
});

/* =========================
   類型篩選（景點 / 餐廳）
========================= */

document.querySelectorAll("#filters button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("#filters button").forEach(b =>
      b.classList.remove("active")
    );
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
