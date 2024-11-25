// Initialize the map
const map = L.map('map').setView([27.7, 85.4], 14);

// Add a base layer with transparency
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  opacity: 0.4,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load GeoJSON data
fetch('data/kolvi_1.json')
  .then(response => response.json())
  .then(data => {
    // Add the GeoJSON layer to the map
    const geojsonLayer = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        const { VDC, WARDNO, PARCELNO } = feature.properties;
        layer.bindPopup(`VDC: ${VDC}<br>Ward: ${WARDNO}<br>Kitta No: ${PARCELNO}`);
      }
    }).addTo(map);

    // Zoom to the bounds of the GeoJSON data on load
    map.fitBounds(geojsonLayer.getBounds());

    // Add search functionality
    document.getElementById('search-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const vdc = document.getElementById('vdc').value;
      const wardno = document.getElementById('wardno').value;
      const parcelno = document.getElementById('parcelno').value;

      geojsonLayer.eachLayer(function (layer) {
        const { VDC, WARDNO, PARCELNO } = layer.feature.properties;
        if (VDC === vdc && WARDNO === wardno && PARCELNO === parcelno) {
          map.fitBounds(layer.getBounds());
          layer.setStyle({
            color: 'red',
            weight: 1
          });
          layer.openPopup();
        } else {
          layer.setStyle({
            color: 'blue',
            weight: 0.4
          });
        }
      });
    });
  })
  .catch(error => console.error('Error loading GeoJSON:', error));
