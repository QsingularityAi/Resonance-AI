<script setup>
import alertTriangleIcon from "@/assets/icons/alert-triangle.svg?component"
import { computed } from "vue"
import { marked } from "marked"

const props = defineProps({
  text: {
    type: String
  }
})

const hintText = computed(() => {
  return marked(props.text)
})
</script>

<template>
  <div class="chatbot-hint">
    <alertTriangleIcon aria-hidden="true" width="18" />
    <span v-html="hintText"></span>
  </div>
</template>

<style lang="scss" scoped>
@use "./ChatMessageWarning.scss";
</style>
