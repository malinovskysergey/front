 
 <!-- src/components/Map.vue -->
<template>
  <div id="map" style="width: 100%; height: 100vh"></div>
  <!-- Include the PersonDetailsModal component -->
  <PersonDetailsModal
    v-if="showModal"
    :person="selectedPerson"
    @close="closeModal"
  />
</template>

<script>
import mapboxgl from 'mapbox-gl';
import api from '../services/api'; // Ensure api.js is correctly set up
import PersonDetailsModal from './PersonDetailsModal.vue'; // Import the modal component

export default {
  name: 'MapComponent',
  components: {
    PersonDetailsModal,
  },
  props: {
    items: Object, // Expecting a GeoJSON FeatureCollection
  },
  data() {
    return {
      map: null,
      mapLoaded: false, // Flag to check if map is loaded
      showModal: false, // Controls modal visibility
      selectedPerson: {}, // Holds details of the selected person
    };
  },
  watch: {
    items(newItems) {
      if (this.map && this.mapLoaded && newItems) {
        this.addDataToMap(newItems);
      }
    },
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidnVmb3JpYSIsImEiOiJjbTJybXJiaWsxOHVnMmpzYnZtZWk4ZXB1In0.24OWriNL8SBYXoLdBtO9EA';
   
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/navigation-night-v1', // mapbox://styles/mapbox/navigation-night-v1
      center: [30.314432,59.940095], // Set to a central coordinate or based on your data
      zoom: 12,        // Adjust zoom level as needed
    });

    // Listen for the 'load' event to ensure the style has fully loaded
    this.map.on('load', () => {
      this.mapLoaded = true;
      console.log('Map loaded successfully.');
      if (this.items) {
        this.addDataToMap(this.items);
      }
    });

    // Handle style loading errors
    this.map.on('error', (e) => {
      console.error('Mapbox GL JS Error:', e.error);
    });
  },
  methods: {
    addDataToMap(data) {
      try {
        console.log('Adding data to map:', data);

        // Remove existing sources and layers if they exist to prevent duplication
        if (this.map.getSource('items')) {
          this.map.removeLayer('clusters');
          this.map.removeLayer('unclustered-point');
          this.map.removeSource('items');
        }

        // Add the data source with clustering enabled
        this.map.addSource('items', {
          type: 'geojson',
          data: data,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 30,  // Radius of each cluster when clustering points (defaults to 50)
        });

        // Load and add the cluster image
        if (!this.map.hasImage('cluster-icon')) {
          this.map.loadImage('/images/m40.png', (error, image) => {
            if (error) throw error;
            this.map.addImage('cluster-icon', image);
          });
        }

        // Add cluster layer using the static image
        this.map.addLayer({
          id: 'clusters',
          type: 'symbol',
          source: 'items',
          filter: ['has', 'point_count'],
          layout: {
            'icon-image': 'cluster-icon',
            'icon-size': 1, // Adjust the size if needed
            'icon-allow-overlap': true,
          },
        });

        // Add unclustered points using the same cluster icon
        this.map.addLayer({
          id: 'unclustered-point',
          type: 'symbol', // Changed from 'circle' to 'symbol'
          source: 'items',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'icon-image': 'cluster-icon',
            'icon-size': 0.5, // Adjust size to differentiate from clusters
            'icon-allow-overlap': true,
          },
        });

        // Handle cluster click to zoom in
        this.map.on('click', 'clusters', (e) => {
          const features = this.map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
          const clusterId = features[0].properties.cluster_id;
          this.map.getSource('items').getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            this.map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
        });

        // Handle unclustered point click to show popup with "Load More" link
        this.map.on('click', 'unclustered-point', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const properties = e.features[0].properties;

          const FNAME = properties.FNAME || 'N/A';
          const NAME = properties.NAME || 'N/A';
          const LNAME = properties.LNAME || 'N/A';
          const BIRTHDATE_STR = properties.BIRTHDATE_STR || 'N/A';
          const PERSONID = properties.PERSONID || 'N/A'; 

          // Popup HTML with a data attribute for the PERSONID
          const popupHTML = `
            <div>
              <strong>${FNAME} </strong> <br/> 
              <strong>${NAME} ${LNAME}</strong> <br/>
              (${BIRTHDATE_STR})<br/> 
              <a href="#" data-personid="${PERSONID}">Больше информации</a>
            </div>
          `;

          const popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupHTML)
            .addTo(this.map);

          // Add an event listener to handle the "Load More" link click
          popup.getElement().addEventListener('click', (event) => {
            event.preventDefault();
            const personId = event.target.getAttribute('data-personid');
            if (personId) {
              this.loadPersonDetails(personId);
            }
          });
        });

        // Change the cursor to a pointer when over clusters
        this.map.on('mouseenter', 'clusters', () => {
          this.map.getCanvas().style.cursor = 'pointer';
        });
        this.map.on('mouseleave', 'clusters', () => {
          this.map.getCanvas().style.cursor = '';
        });

        // Change the cursor to a pointer when over unclustered points
        this.map.on('mouseenter', 'unclustered-point', () => {
          this.map.getCanvas().style.cursor = 'pointer';
        });
        this.map.on('mouseleave', 'unclustered-point', () => {
          this.map.getCanvas().style.cursor = '';
        });

        // Fit the map to the bounds of the data
        const bounds = new mapboxgl.LngLatBounds();
        data.features.forEach((feature) => {
          bounds.extend(feature.geometry.coordinates);
        });
        this.map.fitBounds(bounds, { padding: 50 });
      } catch (error) {
        console.error('Error adding data to map:', error);
      }
    },

    async loadPersonDetails(personId) {
      try {
        // Fetch person details from the API
        const response = await api.getPerson(personId);
        this.selectedPerson = response.data;
        this.showModal = true;
      } catch (error) {
        console.error('Error loading person details:', error);
        alert('Failed to load person details.');
      }
    },

    closeModal() {
      this.showModal = false;
      this.selectedPerson = {};
    },
  },
};
</script>
 

<style>
.mapboxgl-marker {
  background-image: url('../assets/m.png'); /* Optional: custom marker icon */
  background-size: cover;
  width: 30px;
  height: 30px; 
  cursor: pointer;
}
.mapboxgl-marker svg{
  display: none;
}
.mapboxgl-canvas{
  filter: contrast(140%) grayscale(100%) saturate(0%) brightness(74%);
}
body{
  margin: 0 !important;
}

/* Optional: Style popups for better readability */
.mapboxgl-popup-content {
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #333;
}

.mapboxgl-popup-content h3 {
  margin-top: 0;
  font-size: 16px;
  color: #000;
}

.mapboxgl-popup-content p {
  margin: 5px 0;
}

.mapboxgl-popup-content button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #51bbd6;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.mapboxgl-popup-content button:hover {
  background-color: #429ab8;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-content h3 {
  margin-top: 0;
  font-size: 18px;
  color: #333;
}

.modal-content p {
  margin: 10px 0;
  font-size: 14px;
  color: #555;
}

.modal-content button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #51bbd6;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.modal-content button:hover {
  background-color: #429ab8;
}
.mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib{
  display: none !important;
}
.mapboxgl-popup-content{
  background-color: #000009 !important;
  color: #ccc;
  padding-right: 30px;
  min-width: 222px;
}
.mapboxgl-popup-close-button{
background-color: transparent !important;
}
.mapboxgl-popup-content a{
  color: #ccc !important;
  padding-top: 20px !important;
  display: block;
}
.modal-content, .modal-content *{
  background-color: #000009 !important;
  color: #ccc !important; 
}
.modal-content button{
  position: absolute;
  right: 0;
  top: 0;
}
</style>