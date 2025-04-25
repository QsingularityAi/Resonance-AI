<script setup>
import { computed, ref, useTemplateRef } from "vue"
import { blendWithWhite, valueToHex } from "@/util/color.js"
import chevronDownIcon from "@/assets/icons/chevron-down.svg?component"
import { useI18n } from "@padcom/vue-i18n"
import { marked } from "marked"

const { t } = useI18n()

/** min height before show more btn is shown  */
const READ_MORE_THRESHOLD = 260

const props = defineProps({
  chatbotConfig: {
    type: Object
  },
  welcomeTitle: {
    type: String
  },
  welcomeText: {
    type: String
  },
  welcomeAdditionalText: {
    type: String
  }
})

const innerContainer = useTemplateRef("innerContainer")
const innerHeight = computed(() => {
  return innerContainer.value?.clientHeight ?? 0
})

const renderer = new marked.Renderer()
const linkRenderer = renderer.link
renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text)
  return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
}

const readMore = ref(false)

const backgroundColor = computed(() => {
  return blendWithWhite(props.chatbotConfig.primaryColor + valueToHex(10))
})

const welcomeTitle = computed(() => {
  const title = props.welcomeTitle
  if (!title) {
    return ""
  }
  return marked(title, { renderer })
})

const welcomeText = computed(() => {
  const _welcomeText = props.welcomeText
  if (!_welcomeText) {
    return ""
  }
  return marked(_welcomeText, { renderer })
})

const welcomeAdditionalText = computed(() => {
  const _welcomeAdditionalText = props.welcomeAdditionalText
  if (!_welcomeAdditionalText) {
    return ""
  }
  return marked(_welcomeAdditionalText, { renderer })
})

const toggleReadMore = () => {
  readMore.value = !readMore.value
}

const BASE_CLASS = "welcome-message"
const classes = computed(() => {
  const variant = props.chatbotConfig.variant ?? "default"
  return [BASE_CLASS, `${BASE_CLASS}--variant-${variant}`]
})
</script>

<template>
  <section :class="classes" :aria-label="t('screenReader.messageWelcome')">
    <div :class="`${BASE_CLASS}__inner`" ref="innerContainer">
      <div :class="[`${BASE_CLASS}__read-more`, { expanded: readMore, collapsed: !readMore }]">
        <header :class="`${BASE_CLASS}__header`">
          <div :class="`${BASE_CLASS}__title`" v-html="welcomeTitle"></div>
        </header>

        <div v-if="welcomeText" v-html="welcomeText"></div>
        <div v-if="welcomeAdditionalText" v-html="welcomeAdditionalText"></div>
      </div>

      <button
        v-if="innerHeight > READ_MORE_THRESHOLD"
        @click="toggleReadMore"
        type="button"
        class="read-more-btn"
        :class="{ expanded: readMore }"
      >
        <span v-if="readMore">
          {{ t("readLess") }}
        </span>
        <span v-else>
          {{ t("readMore") }}
        </span>

        <chevronDownIcon class="chevron" width="16px" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "./ChatMessageWelcome.scss";

.welcome-message {
  --welcome-background-color: v-bind(backgroundColor);
}
</style>
