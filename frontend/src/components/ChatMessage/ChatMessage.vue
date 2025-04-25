<script setup>
import avatarFallback from "@/assets/icons/avatar_fallback.svg?component"
import copyIcon from "@/assets/icons/clipboard.svg?component"
import pauseIcon from "@/assets/icons/player-pause.svg?component"
import pauseIconFilled from "@/assets/icons/player-pause-filled.svg?component"
import volumeIcon from "@/assets/icons/volume.svg?component"
import refreshIcon from "@/assets/icons/refresh.svg?component"
import tail from "@/assets/speech-bubble-tail.svg?component"
import { computed, ref, watch } from "vue"
import { useI18n } from "@padcom/vue-i18n"
import ChatMessageSource from "@/components/ChatMessageSource/ChatMessageSource.vue"
import ThreeDotLoadingIndicator from "@/components/Util/ThreeDotLoadingIndicator.vue"
import chatService from "@/services/chatService.js"
import LoadingIndicator from "@/components/Util/LoadingIndicator.vue"
import ChatMessageImage from "@/components/ChatMessageImage/ChatMessageImage.vue"
import IconHover from "@/components/Util/IconHover.vue"
import ChatMessageRenderer from "@/components/ChatMessageRenderer/ChatMessageRenderer.vue"
import ChatMessageWarning from "@/components/ChatMessageWarning/ChatMessageWarning.vue"
import ChatMessageAudio from "@/components/ChatMessageAudio/ChatMessageAudio.vue"

const emit = defineEmits([
  "getExtensiveAnswerClick",
  "updateMessage",
  "typingStarted",
  "typingFinished",
  "typingInProgress",
  "retry"
])

const props = defineProps({
  message: {
    type: Object
  },
  avatar: {
    type: String
  },
  isLoading: {
    type: Boolean
  },
  config: {
    type: Object
  },
  animate: {
    type: Boolean
  }
})

const { t, locale } = useI18n()

const isLoadingAudio = ref(false)
const audioUrl = ref("")
const isPlaying = ref(false)
const audioElement = ref(null)
const playButtonHovered = ref(false)
const pauseButtonHovered = ref(false)

const recordingBlob = ref()
const isTyping = ref(false)
const hasSources = ref(props.message?.sources?.length > 0)

const isAssistant = computed(() => {
  return (
    props.message.role === "first" ||
    props.message.role === "ignore" ||
    props.message.role === "assistant"
  )
})

const primaryColor = computed(() => {
  return props.config.primaryColor
})

const textColor = computed(() => {
  return props.config.textColor
})

const recordingUrl = computed(() => {
  if (!props.message?.recordingBlobBase64) {
    return null
  }

  const byteCharacters = atob(props.message?.recordingBlobBase64.split(",")[1])
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  recordingBlob.value = new Blob([byteArray], { type: "audio/mpeg" })
  return URL.createObjectURL(recordingBlob.value)
})

const showImage = computed(() => {
  return !isTyping.value && props.message.image
})

const showSources = computed(() => {
  return !isTyping.value && isAssistant.value && hasSources.value
})

const showAvatar = computed(() => {
  return isAssistant.value && props.config?.variant !== "glass"
})

const copyResponse = () => {
  navigator.clipboard.writeText(props.message.content)
}

const initAudioElement = () => {
  audioElement.value = new Audio()
  audioElement.value.onpause = () => {
    isPlaying.value = false
  }
  audioElement.value.onplay = () => {
    isPlaying.value = true
  }
  audioElement.value.onended = () => {
    isPlaying.value = false
  }
}

const playAudio = () => {
  if (!audioElement.value) {
    initAudioElement()
  }

  if (audioUrl.value) {
    audioElement.value.src = audioUrl.value

    audioElement.value
      .play()
      .then(() => {
        isPlaying.value = true
      })
      .catch((error) => console.error("Error playing audio:", error))
  } else {
    fetchAndPlayAudio()
  }
}

const pauseAudio = () => {
  audioElement.value.pause()
  isPlaying.value = false
}

const fetchAndPlayAudio = async () => {
  if (isLoadingAudio.value) return

  try {
    isLoadingAudio.value = true
    const response = await chatService.tts(props.message.content, locale.value)
    const audioBlob = new Blob([response.data], { type: "audio/mpeg" })
    audioUrl.value = URL.createObjectURL(audioBlob)
    playAudio()
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingAudio.value = false
  }
}

const onTypingStarted = () => {
  isTyping.value = true
  emit("typingStarted")
}

const onTypingFinished = () => {
  isTyping.value = false
  emit("typingFinished")
}

const retry = () => {
  emit("retry")
}

const uniqueSources = computed(() => {
  const _sources = props.message.sources
  const uniqueMap = new Map()
  const pages = new Map()

  for (const source of _sources) {
    const page = source.page
    if (page) {
      if (!pages.has(source.name)) {
        pages.set(source.name, [page])
      } else {
        pages.get(source.name).push(source.page)
      }
    }

    if (!uniqueMap.has(source.name)) {
      uniqueMap.set(source.name, source)
    }
  }

  for (const k of pages.keys()) {
    if (uniqueMap.has(k)) {
      const v = uniqueMap.get(k)
      // add page numbers to source - sort numerically instead of lexicographically
      v.pages = pages.get(k).sort((a, b) => parseInt(a) - parseInt(b))
      uniqueMap.set(k, v)
    }
  }
  return Array.from(uniqueMap.values())
})

const onTypingInProgress = () => {
  emit("typingInProgress")
}

const variant = computed(() => {
  return props.config?.variant ?? "default"
})

const BASE_CLASS = "chat-message"
const classes = computed(() => {
  return [
    BASE_CLASS,
    `${BASE_CLASS}--variant-${variant.value}`,
    `${BASE_CLASS}--${props.message.role}`,
    { [`${BASE_CLASS}--is-loading`]: props.isLoading }
  ]
})

const wrapperClass = computed(() => {
  return [
    "chat-message-wrapper",
    `chat-message-wrapper--variant-${variant.value}`,
    `chat-message-wrapper--${props.message.role}`
  ]
})

watch(showSources, (newValue) => {
  if (newValue) {
    emit("updateMessage")
  }
})

watch(showImage, (newValue) => {
  if (newValue) {
    emit("updateMessage")
  }
})

watch(
  props.message,
  (newValue) => {
    if (newValue.sources?.length > 0) {
      hasSources.value = true
    }
  },
  { deep: true }
)
</script>

<template>
  <ChatMessageWarning v-if="props.message.warning" :text="props.message.warning" />

  <div
    v-if="props.message"
    :class="wrapperClass"
    :aria-hidden="props.message?.srHidden === true ? 'true' : 'false'"
  >
    <div class="chat-avatar" v-if="showAvatar">
      <img v-if="props.avatar" :src="props.avatar" alt="Chatbot avatar" />
      <avatarFallback v-else></avatarFallback>
    </div>
    <section :class="classes" :aria-label="t('screenReader.messageSection')">
      <div v-if="config.variant === 'glass'" :class="`${BASE_CLASS}__tail`">
        <tail :color="isAssistant ? '#DADEEC' : 'var(--primary-color)'"></tail>
      </div>
      <div :class="[`${BASE_CLASS}__content`, { 'has-error': props.message.error }]">
        <p v-if="props.message.content" :class="{ 'sr-only': props.message.recordingBlobBase64 }">
          <span v-if="!isAssistant">
            {{ props.message.content }}
          </span>
          <ChatMessageRenderer
            :key="props.message.id"
            v-else
            :markdown="props.message.content"
            :typing-speed="props.animate ? 1 : 0"
            @typing-started="onTypingStarted"
            @typing-finished="onTypingFinished"
            @typing-in-progress="onTypingInProgress"
          ></ChatMessageRenderer>
        </p>

        <button v-if="props.message.error" @click="retry" class="retry-btn">
          <refreshIcon width="24" aria-hidden="true" />
          <span class="sr-only">
            {{ t("screenReader.repeatPrompt") }}
          </span>
        </button>

        <ChatMessageImage
          v-if="showImage && !isTyping"
          :src="props.message.image"
          :image-title="props.message.image_title"
          :image-description="props.message.image_description"
          :source="props.message.image_source"
        />

        <ChatMessageAudio
          v-if="!isAssistant && props.message.recordingBlobBase64"
          :audio-url="recordingUrl"
          :audio-blob="recordingBlob"
          :primary-color="primaryColor"
        />

        <div v-if="showSources" class="chat-message__sources">
          <hr class="source__space" />
          <span class="source__title">{{ t("sources") }}</span>
          <ol class="source__list">
            <li v-for="(source, index) in uniqueSources" :key="index">
              <ChatMessageSource
                :name="source.name"
                :source-type="source.type"
                :source="source"
                :index="index"
                :primary-color="primaryColor"
              ></ChatMessageSource>
            </li>
          </ol>
        </div>

        <!--<three-dot-loading-indicator :is-loading="props.isLoading" />-->
        <div v-if="props.isLoading" class="chat-message__loading-indicator">
          <three-dot-loading-indicator :is-loading="true" />
        </div>

      </div>

      <footer v-if="isAssistant" class="chat-message__footer" :aria-label="t('screenReader.messageFooter')">
        <div class="chat-message__assistant-name">
          {{ config.assistantName }}
        </div>
        <div class="chat-message__actions">
          <button
            v-if="!isPlaying"
            class="action-btn hover-fill"
            @click="playAudio"
            :disabled="isLoadingAudio || isLoading"
            @mouseenter="playButtonHovered = true"
            @mouseleave="playButtonHovered = false"
          >
            <span v-if="!isLoadingAudio">
              <volumeIcon aria-hidden="true" />
              <span class="sr-only">
                {{ t("screenReader.playAction") }}
              </span>
            </span>
            <span v-else>
              <loading-indicator size="20px" />
            </span>
          </button>

          <button
            v-else
            class="action-btn hover-fill"
            @click="pauseAudio"
            :disabled="isLoading"
            @mouseenter="pauseButtonHovered = true"
            @mouseleave="pauseButtonHovered = false"
          >
            <icon-hover
              :icon="pauseIcon"
              :icon-hover="pauseIconFilled"
              :hover-color="primaryColor"
              :default-color="'#4b4b4b'"
              :is-hovered="pauseButtonHovered"
            ></icon-hover>

            <span class="sr-only">
              {{ t("screenReader.pauseAction") }}
            </span>
          </button>

          <button class="action-btn" @click="copyResponse" :disabled="isLoading">
            <copyIcon aria-hidden="true" />
            <span class="sr-only">
              {{ t("screenReader.copyAction") }}
            </span>
          </button>
        </div>
      </footer >
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use "./ChatMessage.scss";
.chat-message {
  --user-text-color: v-bind(textColor);
}
</style>
