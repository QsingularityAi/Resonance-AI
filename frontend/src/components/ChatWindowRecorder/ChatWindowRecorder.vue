<script setup>
import microphoneOutline from "@/assets/icons/microphone-outline.svg?component"
import microphoneFilled from "@/assets/icons/microphone-filled.svg?component"
import trashIconOutline from "@/assets/icons/trash-x-outline.svg?component"
import trashIconFilled from "@/assets/icons/trash-x-filled.svg?component"
import playIconOutline from "@/assets/icons/player-play.svg?component"
import playIconFilled from "@/assets/icons/player-play-filled.svg?component"
import pauseIconOutline from "@/assets/icons/player-pause.svg?component"
import pauseIconFilled from "@/assets/icons/player-pause-filled.svg?component"
import { computed, nextTick, onUnmounted, ref, useTemplateRef, watch } from "vue"
import { useI18n } from "@padcom/vue-i18n"
import { formatRecordTime, formatTime } from "@/util/format.js"
import HwButton from "@/components/Util/Button/HwButton.vue"

const { t } = useI18n()

const maxRecordTime = 30000

/* defineEmits */
const emit = defineEmits(["audioAvailable", "startedRecording", "finishedRecording", "deleteMedia"])

/* props */
const props = defineProps({
  primaryColor: {
    type: String
  },
  isLoading: {
    type: Boolean
  },
  isGlassVariant: {
    type: Boolean,
    default: false
  }
})

/* refs */
const isRecording = ref(false)
const countDownTimer = ref(null)
const recordTime = ref(0)
const mediaStream = ref()

const mediaRecorder = ref(null)
const audioChunks = ref([])
const audioUrl = ref(null)
const audio = ref(new Audio())
const isRecordPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const maxRecordingTimeReached = ref(false)

const stopRecordingButton = useTemplateRef("stopRecordingButton")
const playRecordingButton = useTemplateRef("playRecordingButton")
const pauseRecordingPlaybackButton = useTemplateRef("pauseRecordingPlaybackButton")
const deleteRecordingButton = useTemplateRef("deleteRecordingButton")
const startRecordingButton = useTemplateRef("startRecordingButton")

const hasMedia = computed(() => {
  return !!audioUrl.value
})

const showPlaybackButton = computed(() => {
  return hasMedia.value && !isRecordPlaying.value
})

/* lifecycle hooks */
onUnmounted(() => {})

/* methods */
const toggleRecord = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaStream.value = stream
    mediaRecorder.value = new MediaRecorder(stream)
    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data)
    }
    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { type: "audio/mpeg" })
      audioUrl.value = URL.createObjectURL(audioBlob)
      isRecording.value = false
      emit("audioAvailable", audioBlob)
      audio.value.src = audioUrl.value
      duration.value = await getBlobDuration(audioBlob)
    }
    mediaRecorder.value.start()
    emit("startedRecording")
    isRecording.value = true
    await nextTick(() => {
      stopRecordingButton.value.focus()
    })

    const startTime = new Date().getTime()

    countDownTimer.value = setInterval(() => {
      const now = new Date().getTime()
      recordTime.value = now - startTime

      if (recordTime.value >= maxRecordTime - 1800) {
        onMaxRecordTimeReached()
      }
      if (recordTime.value >= maxRecordTime) {
        stopRecording()
      }
    }, 1000)
  } catch (error) {
    console.error("Error accessing microphone:", error)
  }
}

const stopRecording = async () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    emit("finishedRecording")
    mediaStream.value?.getTracks().forEach((track) => track.stop()) // necessary to remove tab bubble
    // isRecording.value = false
    audioChunks.value = []
  }
  resetTimer()
}

const resetTimer = () => {
  clearInterval(countDownTimer.value)
  countDownTimer.value = null
  recordTime.value = 0
}

const deleteCurrentAudioRecord = () => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
    audioUrl.value = null
    mediaRecorder.value = null
    duration.value = 0
    currentTime.value = 0
  }

  emit("deleteMedia")
}

const startPlayback = () => {
  isRecordPlaying.value = true
  audio.value.play()
}

const pausePlayback = () => {
  isRecordPlaying.value = false
  audio.value.pause()
}

const onMaxRecordTimeReached = () => {
  maxRecordingTimeReached.value = true
  setInterval(() => {
    maxRecordingTimeReached.value = false
  }, 1000)
}

audio.value.ontimeupdate = () => {
  currentTime.value = audio.value.currentTime
}

audio.value.onended = () => {
  isRecordPlaying.value = false
}

const getBlobDuration = async (blob) => {
  const tempVideoEl = document.createElement("video")

  const durationP = new Promise((resolve, reject) => {
    tempVideoEl.addEventListener("loadedmetadata", () => {
      // Chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=642012
      if (tempVideoEl.duration === Infinity) {
        tempVideoEl.currentTime = Number.MAX_SAFE_INTEGER
        tempVideoEl.ontimeupdate = () => {
          tempVideoEl.ontimeupdate = null
          resolve(tempVideoEl.duration)
          tempVideoEl.currentTime = 0
        }
      }
      // Normal behavior
      else resolve(tempVideoEl.duration)
    })
    tempVideoEl.onerror = (event) => reject(event.target.error)
  })

  tempVideoEl.src =
    typeof blob === "string" || blob instanceof String ? blob : window.URL.createObjectURL(blob)

  return durationP
}

const showRecordButton = computed(() => {
  let condition = !isRecording.value && !hasMedia.value
  if (props.isGlassVariant) {
    condition = condition && !props.isLoading
  }
  return condition
})

watch(showPlaybackButton, () => {
  if (showPlaybackButton.value) {
    nextTick().then(() => {
      playRecordingButton.value.focus()
    })
  }
})

defineExpose({ deleteCurrentAudioRecord, stopRecording })
</script>

<template>
  <div
    class="chat-window-recorder"
    :class="{ 'chat-window-recorder--variant-glass': isGlassVariant }"
  >
    <div
      v-if="isRecording || hasMedia"
      class="record-progress"
      :class="{ 'record-progress--recording': isRecording, 'record-progress--player': hasMedia }"
    >
      <microphoneFilled
        style="width: 40px; height: 40px; padding: 1px 6px"
        :color="isRecording ? '#F13E6B' : hasMedia ? primaryColor : ''"
      />

      <span class="record-progress__info" v-if="isRecording">
        {{ t("recordingInProgress") }}
      </span>
      <span class="record-progress__info" v-if="hasMedia">
        {{ t("recording") }}
      </span>

      <span v-if="isRecording" class="recording-time">
        {{ formatRecordTime(recordTime) }} /
        <span :class="{ 'blink-1': maxRecordingTimeReached }"
          >{{ formatRecordTime(maxRecordTime) }}s</span
        ></span
      >

      <!-- stop recording btn -->
      <HwButton
        v-show="isRecording"
        ref="stopRecordingButton"
        @click="stopRecording"
        :icon="pauseIconOutline"
        :color="'#F13E6B'"
        :hover-icon="pauseIconFilled"
        :hover-color="'#F13E6B'"
        :aria-label="t('screenReader.stopRecordingAction')"
      ></HwButton>

      <span class="recorded-time" v-if="hasMedia">
        <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
      </span>

      <!-- play recording btn -->
      <HwButton
        v-show="showPlaybackButton"
        ref="playRecordingButton"
        @click="startPlayback"
        :icon="playIconOutline"
        :color="primaryColor"
        :hover-icon="playIconFilled"
        :hover-color="primaryColor"
        :aria-label="t('screenReader.stopRecordingAction')"
      ></HwButton>

      <!-- pause recording btn -->
      <HwButton
        v-show="hasMedia && isRecordPlaying"
        ref="pauseRecordingPlaybackButton"
        @click="pausePlayback"
        :icon="pauseIconOutline"
        :color="primaryColor"
        :hover-icon="pauseIconFilled"
        :hover-color="primaryColor"
        :aria-label="t('screenReader.stopRecordingAction')"
      ></HwButton>

      <!-- delete recording btn -->
      <HwButton
        v-show="!isRecording && hasMedia"
        ref="deleteRecordingButton"
        @click="deleteCurrentAudioRecord"
        :disabled="props.isLoading"
        :icon="trashIconOutline"
        :hover-icon="trashIconFilled"
        :color="primaryColor"
        :hover-color="primaryColor"
        :aria-label="t('screenReader.deleteRecordingAction')"
      ></HwButton>
    </div>

    <!-- start recording btn -->
    <HwButton
      v-show="showRecordButton"
      ref="startRecordingButton"
      class="default-action record-btn"
      :class="{ record: isRecording }"
      @click.prevent="toggleRecord"
      :disabled="props.isLoading"
      :icon="microphoneOutline"
      :hover-icon="microphoneFilled"
      :color="props.isGlassVariant ? '#0F1C2E' : 'var(--primary-color)'"
      :hover-color="props.isGlassVariant ? '#0F1C2E' : 'var(--primary-color)'"
      radius="16px"
      :size="props.isGlassVariant ? 'lg' : ''"
      :aria-label="t('screenReader.startRecordingAction')"
    ></HwButton>
  </div>
</template>

<style lang="scss" scoped>
@use "./ChatWindowRecorder.scss";
</style>
