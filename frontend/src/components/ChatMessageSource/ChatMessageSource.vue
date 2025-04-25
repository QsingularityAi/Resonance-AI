<script setup>
import { computed } from "vue"
import { useI18n } from "@padcom/vue-i18n"

const { t } = useI18n()

const props = defineProps({
  name: {
    type: String
  },
  sourceType: {
    type: String
  },
  index: {
    type: Number
  },
  primaryColor: {
    type: String
  },
  source: {
    type: Object
  }
})

const pages = computed(() => {
  if (!props.source.pages) return ""
  return `${t("page")} ${props.source.pages.join(", ")}`
})

const sourceLink = computed(() => {
  if (props.source.page) {
    return `${props.source.link}#page=${props.source.page}`
  }
  return props.source.link
})
</script>

<template>
  <a :href="sourceLink" target="_blank" class="source">
    <span class="source__name">{{ index + 1 }}. {{ props.name }} {{ pages }}</span>
    <span class="source__type"> {{ props.sourceType }}</span>
  </a>
</template>

<style lang="scss" scoped>
@use "./ChatMessageSource.scss";
</style>
