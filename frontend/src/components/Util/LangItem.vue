<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
    default() {
      return "de"
    }
  },
  langFlagIcon: {
    type: String,
    required: true,
    default() {
      return "langDEIcon"
    }
  },
  screenReader: {
    type: String,
    required: false
  }
})
</script>

<template>
  <div class="lang-switch__label">
    <span class="lang-locale">{{ props.label }}</span>
    <span class="lang-icon">
      <component aria-hidden="true" :is="langFlagIcon" />
    </span>
    <span class="sr-only">
      {{ props.screenReader }}
    </span>
  </div>
</template>

<style scoped>
.lang-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
  line-height: 0;
}

.lang-switch__label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 2px 2px 2px 4px;
  font-weight: bold;
  font-size: 0.875em;
  border: 2px solid transparent;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
