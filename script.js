// Initialize the map
const map = L.map('map').setView([27.7, 85.4], 14);

// Add a base layer with transparency
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  opacity: 0.7,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Variable to store the GeoJSON layer
let geojsonLayer;

// Load GeoJSON data
fetch('data/kolvi_1.json')
  .then(response => response.json())
  .then(data => {
    // Function to create a GeoJSON layer with filtered data
    const createFilteredLayer = (filterFunction) => {
      // Remove any existing layer
      if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
      }

      // Add a new filtered GeoJSON layer
      geojsonLayer = L.geoJSON(data, {
        filter: filterFunction,
        onEachFeature: function (feature, layer) {
          const { VDC, WARDNO, PARCELNO } = feature.properties;
          layer.bindPopup(`VDC: ${VDC}<br>Ward No: ${WARDNO}<br>Parcel No: ${PARCELNO}`);
        },
        style: {
          color: 'blue',
          weight: 1
        }
      }).addTo(map);

      // Adjust map view to the bounds of the filtered layer
      if (geojsonLayer.getLayers().length > 0) {
        map.fitBounds(geojsonLayer.getBounds());
      } else {
        alert('No parcels found matching your query.');
      }
    };

    // Add search functionality
    document.getElementById('search-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const vdc = document.getElementById('vdc').value;
      const wardno = document.getElementById('wardno').value;
      const parcelno = document.getElementById('parcelno').value;

      // Define the filter function
      const filterFunction = (feature) => {
        const { VDC, WARDNO, PARCELNO } = feature.properties;
        return (
          (!vdc || VDC === vdc) &&
          (!wardno || WARDNO === wardno) &&
          (!parcelno || PARCELNO === parcelno)
        );
      };

      // Create a filtered GeoJSON layer
      createFilteredLayer(filterFunction);
    });

    // Display all parcels on initial load
    createFilteredLayer(() => true);
  })
  .catch(error => console.error('Error loading GeoJSON:', error));
