<script setup>
const props = defineProps({
  size: {
    type: String,
    default: "50px"
  }
})
</script>

<template>
  <div
    class="loader"
    :style="{
      width: props.size,
      height: props.size
    }"
  ></div>
</template>

<style scoped>
.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
