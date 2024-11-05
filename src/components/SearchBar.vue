<!-- src/components/SearchBar.vue -->

<template>
  <div>
    <input
      type="text"
      placeholder="Search..."
      v-model="query"
      @keydown.enter="handleSearch"
    />
    <button @click="handleSearch">Search</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  name: 'SearchBar',
  emits: ['search-results'],
  setup(props, { emit }) {
    const query = ref('');

    const handleSearch = () => {
      axios.get(`http://localhost:5000/api/search?q=${encodeURIComponent(query.value)}`)
        .then(response => {
          emit('search-results', response.data);
        })
        .catch(error => {
          console.error('Error during search:', error);
        });
    };

    return {
      query,
      handleSearch,
    };
  },
};
</script>

<style>
/* Add any custom styles here */
</style>
