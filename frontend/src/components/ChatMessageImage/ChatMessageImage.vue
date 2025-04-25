<script setup>
import { getCurrentInstance, ref } from "vue"
import openIconOutline from "@/assets/icons/open.svg?component"
import { useI18n } from "@padcom/vue-i18n"

const { t } = useI18n()

const props = defineProps({
  src: {
    type: String
  },
  imageTitle: {
    type: String
  },
  imageDescription: {
    type: String
  },
  source: {
    type: String
  }
})

const instance = getCurrentInstance()
const uuid = ref(instance.uid)
</script>

<template>
  <div class="chat-message-image">
    <a v-if="source" :href="source" :title="props.imageTitle" target="_blank">
      <img
        :src="props.src"
        :alt="props.imageTitle"
        :aria-describedby="props.imageDescription ? uuid : ''"
      />
    </a>
    <img
      v-else
      :src="props.src"
      :alt="props.imageTitle"
      :aria-describedby="props.imageDescription ? uuid : ''"
    />
    <p v-if="props.imageDescription" class="sr-only" :id="uuid">
      {{ props.imageDescription }}
    </p>
    <footer class="chat-message-image__footer">
      <div>
        <p>{{ props.imageTitle }}</p>
      </div>

      <div class="chat-message-image__actions">
        <a v-if="source" :href="source" class="chat-message-image__source" target="_blank">
          <openIconOutline height="24" aria-hidden="true" />
          <span class="sr-only">
            {{ t("openImageInNewTab") }}
          </span>
        </a>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@use "./ChatMessageImage.scss";
</style>
