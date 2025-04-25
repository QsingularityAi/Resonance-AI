<script setup>
const props = defineProps({
  icon: {
    type: Object
  },
  iconHover: {
    type: Object
  },
  isHovered: {
    type: Boolean
  },
  hoverColor: {
    type: String
  },
  defaultColor: {
    type: String,
    required: false
  }
})


</script>

<template>
  <Transition name="icon-hover" mode="out-in">
    <component
      :is="props.iconHover"
      v-if="props.isHovered"
      :color="props.hoverColor"
      aria-hidden="true"
    />
    <component :is="props.icon" :color="props.defaultColor" v-else aria-hidden="true" />
  </Transition>
</template>

<style scoped>
.icon-hover-enter-active {
  transition: opacity 0.2s ease-out;
}

.icon-hover-enter-from,
.icon-hover-leave-to {
  opacity: 0.5;
}
</style>
