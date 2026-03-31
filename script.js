const list = document.getElementById("list");
const map = document.getElementById("map");

let allPlaces = [];
let itineraries = [];
let currentDay = "day1";
let currentType = "all";

/* ===== 載入 JSON 資料 ===== */
async function loadData() {
  try {
    const placesRes = await fetch("./data/places.json");
    const itineraryRes = await fetch("./data/itinerary.json");

    allPlaces = await placesRes.json();
    itineraries = await itineraryRes.json();

    render();
  } catch (err) {
    console.error("資料載入失敗", err);
    list.innerHTML = "<p>❌ 資料載入失敗</p>";
  }
}

/* ===== 核心渲染（含 Accordion）===== */
function render() {
  list.innerHTML = "";

  const dayData = itineraries.find(d => d.day === currentDay);
  if (!dayData) return;

  allPlaces
    .filter(p => dayData.places.includes(p.id))
    .filter(p => currentType === "all" || p.type === currentType)
    .forEach(place => {

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
          <p>${place.description}</p>

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

          <button class="map-btn">在地圖上查看</button>
        </div>
      `;

      /* ✅ Accordion：一次只開一張 */
      card.querySelector(".card-header").onclick = () => {
        document.querySelectorAll(".card.open").forEach(c => {
          if (c !== card) c.classList.remove("open");
        });
        card.classList.toggle("open");
      };

     card.querySelector(".map-btn").onclick = (e) => {
      e.stopPropagation();
      window.open(place.map_url, "_blank");
    };

      list.appendChild(card);
    });
}

/* ===== Day 分頁 ===== */
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

/* ===== 類型篩選 ===== */
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

/* ✅ 啟動 */
loadData();
