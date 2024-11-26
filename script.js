// Initialize the map
const map = L.map('map').setView([27.7, 85.4], 14);

// Add a base layer with transparency
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  opacity: 0.7,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Variables to store the GeoJSON layers
let geojsonLayer; // Layer for the full dataset
let parcelLayer;  // Layer for the filtered data

// Load GeoJSON data
fetch('data/kolvi_1.json')
  .then(response => response.json())
  .then(data => {
    // Function to add the full GeoJSON data to the map
    const loadFullData = () => {
      geojsonLayer = L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
          const { VDC, WARDNO, PARCELNO } = feature.properties;
          layer.bindPopup(`VDC: ${VDC}<br>Ward No: ${WARDNO}<br>Parcel No: ${PARCELNO}`);
        },
        style: {
          color: 'blue',
          weight: 0.4
        }
      }).addTo(map);

      // Zoom to the full extent of the data
      map.fitBounds(geojsonLayer.getBounds());
    };

    // Function to filter data based on query and display only the filtered parcels
    const displayFilteredData = (filterFunction) => {
      // Remove the existing filtered layer, if any
      if (parcelLayer) {
        map.removeLayer(parcelLayer);
      }

      // Create a new layer for the filtered data
      parcelLayer = L.geoJSON(data, {
        filter: filterFunction,
        onEachFeature: function (feature, layer) {
          const { VDC, WARDNO, PARCELNO } = feature.properties;
          layer.bindPopup(`VDC: ${VDC}<br>Ward No: ${WARDNO}<br>Parcel No: ${PARCELNO}`);
        },
        style: {
          color: 'red',
          weight: 1
        }
      }).addTo(map);

      // Check if there are any matching parcels
      if (parcelLayer.getLayers().length > 0) {
        // Zoom to the bounds of the filtered layer
        map.fitBounds(parcelLayer.getBounds());
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

      // Display only the filtered parcels
      displayFilteredData(filterFunction);
    });

    // Load the full data initially
    loadFullData();
  })
  .catch(error => console.error('Error loading GeoJSON:', error));
