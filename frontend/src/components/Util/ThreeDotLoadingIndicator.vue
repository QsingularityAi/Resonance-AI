<script setup>
const props = defineProps({
  isLoading: {
    type: Boolean
  }
})
</script>

<template>
  <div v-if="props.isLoading" class="loader dot-flashing"></div>
</template>

<style scoped>
.loader {
  width: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  animation: l5 1s infinite linear alternate;
  margin: auto;
}

/**
 * ==============================================
 * Dot Flashing
 * ==============================================
 */
.dot-flashing {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #cdcdcd;
  color: #cdcdcd;
  animation: dot-flashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}

.dot-flashing::before,
.dot-flashing::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-flashing::before {
  left: -15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #cdcdcd;
  color: #cdcdcd;
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #cdcdcd;
  color: #cdcdcd;
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dot-flashing {
  0% {
    background-color: #cdcdcd;
  }
  50%,
  100% {
    background-color: #7c808a;
  }
}
</style>
