<!-- src/components/PersonDetailsModal.vue -->
<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h3>{{ person.FNAME }} {{ person.NAME }} {{ person.LNAME }} ({{ person.BIRTHDATE_STR }})</h3>
      <p><strong>Место рождения:</strong> {{ person.BIRTHPLACE }}</p>
      <p><strong>Национальность:</strong> {{ person.NATION }}</p>
      <p><strong>Работа:</strong> {{ person.AWORK }}</p>
      <p><strong>Последний адрес:</strong> {{ person.LIVEPLACE }}</p>
      <p><strong>Дата ареста:</strong> {{ person.ARESTDATE_STR }}</p>
      <p><strong>Дата суда:</strong> {{ person.SUDDATE_STR }}</p>
      <p><strong>Дата смерти:</strong> {{ person.MORTDATE_STR }}</p>
      <p><strong>Дата реабилитации:</strong> {{ person.REABDATE_STR }}</p>
      <p><strong>Обвинение:</strong> {{ person.STAT }}</p> 
      <button @click="close">x</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonDetailsModal',
  props: {
    person: {
      type: Object,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
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
</style>
