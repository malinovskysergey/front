<!-- src/views/ItemDetail.vue -->
<template>
  <div v-if="item">
    <h1>{{ item.name }}</h1>
    <p>{{ item.description }}</p>
    <!-- Add more fields as necessary -->
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'ItemDetail',
  props: ['id'],
  data() {
    return {
      item: null,
    };
  },
  methods: {
    fetchItem() {
      api.getItem(this.id).then(response => {
        this.item = response.data;
      });
    },
  },
  created() {
    this.fetchItem();
  },
};
</script>
