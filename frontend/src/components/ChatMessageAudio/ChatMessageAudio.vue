<script setup>
import { ref } from "vue"
import playIconOutline from "@/assets/icons/player-play.svg?component"
import playIconFilled from "@/assets/icons/player-play-filled.svg?component"
import pauseIconOutline from "@/assets/icons/player-pause.svg?component"
import pauseIconFilled from "@/assets/icons/player-pause-filled.svg?component"
import { useI18n } from "@padcom/vue-i18n"
import { getBlobDuration } from "@/util/audio.js"
import { formatTime } from "@/util/format.js"
import HwButton from "@/components/Util/Button/HwButton.vue"

const { t } = useI18n()

const props = defineProps({
  audioUrl: {
    type: String
  },
  audioBlob: {
    type: Blob
  },
  primaryColor: {
    type: String
  }
})

const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const audio = ref(new Audio(props.audioUrl))

audio.value.onloadedmetadata = async () => {
  if (audio.value.duration === Infinity) {
    duration.value = await getBlobDuration(props.audioBlob)
  } else {
    duration.value = audio.value.duration
  }
}

audio.value.ontimeupdate = () => {
  currentTime.value = audio.value.currentTime
}

audio.value.onended = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const startPlayback = () => {
  isPlaying.value = true
  audio.value.play()
}

const pausePlayback = () => {
  isPlaying.value = false
  audio.value.pause()
}
</script>

<template>
  <div class="audio-player">
    <!-- play recording btn -->
    <HwButton
      v-if="!isPlaying"
      @click="startPlayback"
      :icon="playIconOutline"
      :hover-icon="playIconFilled"
      :color="primaryColor"
      :hover-color="primaryColor"
      :aria-label="t('screenReader.playAction')"
    ></HwButton>

    <HwButton
      v-if="isPlaying"
      @click="pausePlayback"
      :icon="pauseIconOutline"
      :hover-icon="pauseIconFilled"
      :color="primaryColor"
      :hover-color="primaryColor"
      :aria-label="t('screenReader.pauseAction')"
    ></HwButton>

    <span
      :style="{
        color: primaryColor
      }"
      class="audio-player__time"
      >{{ formatTime(currentTime) }} / {{ formatTime(duration) }}s</span
    >
  </div>
</template>

<style lang="scss" scoped>
@use "./ChatMessageAudio.scss";
</style>
