console.log("Map JS loaded");
const { lat, lng } = window.coordinates;

const map = L.map("map").setView(
    [lat, lng],
    13
);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors & CARTO'
}).addTo(map);

L.marker([lat, lng])
  .addTo(map)
  .bindPopup(`
    <div>
      <strong>${window.locationName}</strong>
    </div>
  `);