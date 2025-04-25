<script setup>
import { onMounted, ref, watch } from "vue"
import { useMarkdown } from "@/composables/useMarkdown.ts"

const emit = defineEmits(["typingStarted", "typingFinished", "typingInProgress"])

const props = defineProps({
  markdown: {
    type: String,
    required: true
  },
  typingSpeed: {
    type: Number,
    default: 50
  }
})

const typingContainer = ref(null)
const formattedText = ref("")
const typedText = ref("")
const isTyping = ref(false)

const { parseMarkdown } = useMarkdown()

async function typeText(html) {
  if (props.typingSpeed === 0) {
    typedText.value = html
    return
  }

  isTyping.value = true
  emit("typingStarted")
  const words = html.split(/(<[^>]+>|\s+)/).filter((word) => word.length > 0)
  let currentText = ""

  for (const word of words) {
    currentText += word
    typedText.value = currentText
    if (!/^<[^>]+>$/.test(word)) {
      // If it's not just an HTML tag
      await new Promise((resolve) => setTimeout(resolve, props.typingSpeed * word.length))
    }
    emit("typingInProgress")
  }
  emit("typingFinished")
  isTyping.value = false
}

watch(
  () => props.markdown,
  (newValue) => {
    const parsedHtml = parseMarkdown(newValue)
    formattedText.value = parsedHtml
    typeText(parsedHtml)
  },
  { immediate: true }
)

onMounted(() => {
  if (props.markdown) {
    const parsedHtml = parseMarkdown(props.markdown)
    formattedText.value = parsedHtml
    typeText(parsedHtml)
  }
})
</script>

<template>
  <div class="markdown-typer" aria-live="polite">
    <div :aria-hidden="isTyping" ref="typingContainer" v-html="typedText"></div>
  </div>
</template>

<style lang="scss" scoped>
@use "./ChatMessageRenderer.scss";
</style>
