<script setup>
import { computed, ref, useTemplateRef } from "vue"
import IconHover from "../IconHover.vue"

const BASE_CLASS = "hw-btn"

/**
 *
 * @type {import("vue").PropType<{
 *   icon: Object,
 *   size?: "lg" | "sm" | "xl"
 * }>}
 */
const props = defineProps({
  label: { type: String },
  icon: { type: Object },
  hoverIcon: { type: Object },
  size: {
    type: String
  },
  elevation: {
    type: Number
  },
  color: {
    type: String,
    default: "#4b4b4b"
  },
  hoverColor: {
    type: String,
    default: "var(--primary-color)"
  },
  backgroundColor: {
    type: String
  },
  radius: {
    type: String,
    default: "8px"
  }
})

const mouseOver = ref(false)

const clazz = computed(() => {
  return [
    BASE_CLASS,
    {
      [`${BASE_CLASS}--icon`]: !!props.icon,
      [`${BASE_CLASS}--has-hover-icon`]: !!props.hoverIcon,
      [`${BASE_CLASS}--${props.size}`]: !!props.size
    }
  ]
})

const styles = [{ borderRadius: props.radius ? props.radius : props.icon ? "50%" : "none" }]

const buttonRef = useTemplateRef("hwButton")

const focus = () => {
  buttonRef.value.focus()
}

defineExpose({
  focus
})
</script>

<template>
  <button
    type="button"
    ref="hwButton"
    v-bind="$attrs"
    :class="clazz"
    :style="[
      ...styles,
      {
        backgroundColor: props.backgroundColor,
        color: props.color
      }
    ]"
    @mouseenter="mouseOver = true"
    @mouseleave="mouseOver = false"
  >
    <slot name="btn-prepend"></slot>
    <slot>
      <IconHover
        :class="`${BASE_CLASS}__icon`"
        v-if="!!props.hoverIcon"
        :icon="props.icon"
        :icon-hover="props.hoverIcon"
        :is-hovered="mouseOver"
      ></IconHover>
      <component v-else :class="`${BASE_CLASS}__icon`" :is="props.icon" :aria-label="props.label" />
      <span class="hw-btn__label" :class="{ 'sr-only': !!props.icon }">
        {{ props.label }}
      </span>
    </slot>
    <slot name="btn-append"></slot>
  </button>
</template>

<style lang="scss" scoped>
.hw-btn {
  --icon-color: v-bind(props.color);
  --icon-hover-color: v-bind(hoverColor);

  border: none;
  padding: 10px;
  transition: background-color 0.36s ease-out;
  width: 40px;
  height: 40px;

  &--sm {
    &.hw-btn--icon {
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  &--lg {
    width: 48px;
    height: 48px;

    &.hw-btn--icon {
      svg {
        width: 24px;
        height: 24px;
      }
    }
  }

  &--icon {
    display: grid;
    justify-content: center;
    align-content: center;
    margin: auto;

    svg {
      width: 28px;
      height: 28px;
    }

    &:not(.hw-btn--has-hover-icon) {
      svg {
        transition:
          color 0.24s ease-out,
          transform 0.2s ease-out;
      }

      &:hover {
        svg {
          color: var(--icon-hover-color);
        }
      }
    }
  }
}
</style>
