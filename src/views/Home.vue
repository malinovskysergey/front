<!-- src/views/Home.vue -->
<template>
  <div> 
    <MapComponent :items="items" />
  </div>
</template>

<script>
import MapComponent from '../components/Map.vue';
import api from '../services/api';

export default {
  name: 'MainHome',
  components: {
    MapComponent,
  },
  data() {
    return {
      items: null, // Will hold GeoJSON FeatureCollection
      searchQuery: '',
    };
  },
  methods: {
    fetchItems() {
      api
        .getItems(this.searchQuery)
        .then((response) => {
          const features = response.data.map((item) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(item.longitude),
                parseFloat(item.latitude),
              ],
            },
            properties: {
              PERSONID: item.PERSONID, // Ensure PERSONID is included
              FNAME: item.FNAME,
              NAME: item.NAME,
              LNAME: item.LNAME,
              BIRTHDATE_STR: item.BIRTHDATE_STR,
              // Include any other properties if needed
            },
          }));
          this.items = {
            type: 'FeatureCollection',
            features: features,
          };
          console.log('Fetched GeoJSON items:', this.items); // For debugging
        })
        .catch((error) => {
          console.error('Error fetching items:', error);
        });
    },

  },
  created() {
    this.fetchItems();
  },
};
</script>

<style scoped>
/* Add any additional styles if necessary */
</style>
