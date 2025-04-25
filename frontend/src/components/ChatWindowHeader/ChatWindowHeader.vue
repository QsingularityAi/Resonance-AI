<script setup>
import ChatWindowMenu from "@/components/ChatbotMenu/ChatbotMenu.vue"
import LanguageSwitch from "@/components/Util/LanguageSwitch.vue"
import { useI18n } from "@padcom/vue-i18n"
import closeIcon from "@/assets/icons/close.svg?component"
import chevronDownIcon from "@/assets/icons/chevron-down.svg?component"
import { computed, inject, ref } from "vue"
import HwButton from "@/components/Util/Button/HwButton.vue"

const { t } = useI18n()

const props = defineProps({
  config: Object,
  loading: Boolean
})

const isFullscreen = ref(inject("isFullscreen"))
const isInline = ref(inject("isInline"))

const BASE_CLASS = "chatbot-header"
const classes = computed(() => {
  const variant = props.config?.variant
  return [BASE_CLASS, `${BASE_CLASS}--variant-${variant}`]
})

const variant = computed(() => {
  return props.config?.variant ?? "default"
})
</script>

<template>
  <header :class="classes">
    <div :class="`${BASE_CLASS}__inner`">
      <div class="chatbot-header__logo">
        <slot name="logo">
          <img :src="config?.logo" alt="Chatbot Logo" />
        </slot>
      </div>

      <div class="chatbot-header__title">
        <slot name="title">
          {{ config?.headerTitle }}
        </slot>
      </div>

      <div class="chatbot-header__lang-switch">
        <LanguageSwitch :config="props.config" :loading="props.loading" />
      </div>

      <ChatWindowMenu
        class="chatbot-header__menu"
        :chatbotConfig="props.config"
        @click-reset-chat="$emit('clickResetChat')"
        @change-text-size="$emit('changeTextSize', $event)"
        @change-high-contrast="$emit('changeHighContrast', $event)"
        @export-history="$emit('exportHistory')"
        @show-contact-info="$emit('showContactInfo')"
        :loading="props.loading"
      />

      <!-- todo: better variant query -->
      <HwButton
        v-if="!isFullscreen && !isInline"
        class="chat-window__action close-btn chatbot-header__close"
        @click="$emit('toggleChatWindow')"
        :icon="variant === 'glass' ? chevronDownIcon : closeIcon"
        :color="variant === 'glass' ? '#757575' : ''"
        :aria-label="t('screenReader.closeAction')"
        :disabled="props.loading"
      ></HwButton>
    </div>
  </header>
</template>

<style lang="scss">
@use "./ChatWindowHeader.scss";
</style>
