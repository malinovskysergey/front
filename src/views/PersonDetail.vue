<!-- src/views/PersonDetail.vue -->
<template>
  <div class="person-detail">
    <h1>{{ person.FNAME }} {{ person.NAME }} {{ person.LNAME }}</h1>
    <p><strong>Birthdate:</strong> {{ person.BIRTHDATE_STR }}</p>
    <p><strong>Birthplace:</strong> {{ person.BIRTHPLACE }}</p>
    <p><strong>Nationality:</strong> {{ person.NATION }}</p>
    <p><strong>Occupation:</strong> {{ person.AWORK }}</p>
    <p><strong>Current Residence:</strong> {{ person.LIVEPLACE }}</p>
    <p><strong>Arrest Date:</strong> {{ person.ARESTDATE_STR }}</p>
    <p><strong>Sentence Date:</strong> {{ person.SUDDATE_STR }}</p>
    <p><strong>Status:</strong> {{ person.STAT }}</p>
    <p><strong>Province:</strong> {{ person.PRIGOVOR }}</p>
    <p><strong>Death Date:</strong> {{ person.MORTDATE_STR }}</p>
    <p><strong>Rehabilitation Date:</strong> {{ person.REABDATE_STR }}</p>

    <button @click="goBack">Back to Map</button>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'PersonDetail',
  props: ['id'], // Received from the route
  data() {
    return {
      person: null,
      loading: true,
      error: null,
    };
  },
  methods: {
    fetchPerson() {
      api
        .getPerson(this.id)
        .then((response) => {
          this.person = response.data;
          this.loading = false;
          console.log('Fetched person details:', this.person);
        })
        .catch((error) => {
          console.error('Error fetching person details:', error);
          this.error = 'Failed to load person details.';
          this.loading = false;
        });
    },
    goBack() {
      this.$router.push('/');
    },
  },
  created() {
    this.fetchPerson();
  },
};
</script>

<style scoped>
.person-detail {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.person-detail h1 {
  margin-bottom: 20px;
}

.person-detail p {
  margin: 5px 0;
}

.person-detail button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #51bbd6;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.person-detail button:hover {
  background-color: #429ab8;
}
</style>
