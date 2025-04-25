<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch, computed } from "vue"
import menuIcon from "@/assets/icons/dots-three-vertical.svg?component"
import userIcon from "@/assets/icons/user.svg?component"
import resetIcon from "@/assets/icons/reset.svg?component"
import textSizeIconFilled from "@/assets/icons/text-size.svg?component"
import contrastIconFilled from "@/assets/icons/contrast.svg?component"
// eslint-disable-next-line no-unused-vars
import flaskIcon from "@/assets/icons/flask.svg?component"

import { useI18n } from "@padcom/vue-i18n"

const { t } = useI18n()

const emit = defineEmits([
  "select",
  "exportHistory",
  "clickResetChat",
  "changeTextSize",
  "changeHighContrast",
  "showContactInfo"
])

const props = defineProps({
  chatbotConfig: {
    type: Object
  },
  loading: Boolean
})

const isOpen = ref(false)
const isContactInfoVisible = ref(false)
const menuId = `menu-${Math.random().toString(36).substr(2, 9)}`
const triggerRef = ref(null)
const menuRef = ref(null)
const menuItemRefs = ref([])
const currentTextSize = ref(16)
const isHigherTextSize = ref(false)
const isHighContrast = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => focusFirstItem())
  }
}

const openMenu = () => {
  if (!isOpen.value) {
    isOpen.value = true
    nextTick(() => focusFirstItem())
  }
}

const closeMenu = (focus = true) => {
  if (!isOpen.value) return

  isOpen.value = false
  if (focus) {
    triggerRef.value.focus()
  }
}

const focusItem = (index) => {
  const el = menuItemRefs.value[index]
  if (el) {
    el.focus()
  }
}

const focusFirstItem = () => focusItem(0)
const focusLastItem = () => focusItem(menuItemRefs.value.length - 1)

const focusPreviousItem = () => {
  activeMenuIndex.value--
  if (activeMenuIndex.value < 0) {
    activeMenuIndex.value = menuItemRefs.value.length - 1
  }
  focusItem(activeMenuIndex.value)
}

const focusNextItem = () => {
  activeMenuIndex.value++
  if (activeMenuIndex.value >= menuItemRefs.value.length) {
    activeMenuIndex.value = 0
  }
  focusItem(activeMenuIndex.value)
}

const selectItem = (item) => {
  if (item.setting.action) {
    item.setting.action()
    if (
      item.setting.type &&
      item.setting.type !== "switch" &&
      item.setting.type !== "textsize" &&
      item.setting.type !== "contact"
    ) {
      closeMenu()
    }
  }
}

const handleClickOutside = (event) => {
  nextTick().then(() => {
    const closeCondition =
      isOpen.value &&
      menuRef.value &&
      !menuRef.value.contains(event.target) &&
      !triggerRef.value.contains(event.target)
    if (closeCondition) {
      closeMenu(false)
    }
  })
}

const resetChat = () => {
  closeMenu()
  emit("clickResetChat")
}

const showContactInfo = () => {
  emit("showContactInfo")
}

const toggleTextSize = () => {
  if (currentTextSize.value === 22) {
    isHigherTextSize.value = false
    currentTextSize.value = 16
    return
  }
  if (!isHigherTextSize.value) {
    isHigherTextSize.value = true
  }
  currentTextSize.value = parseInt(currentTextSize.value) + 2
}

const prevTextSize = () => {
  if (currentTextSize.value === 16) {
    currentTextSize.value = 22
    isHigherTextSize.value = true
    return
  }
  if (currentTextSize.value === 18) {
    currentTextSize.value = 16
    isHigherTextSize.value = false
    return
  }

  if (!isHigherTextSize.value) {
    isHigherTextSize.value = true
  }

  currentTextSize.value = parseInt(currentTextSize.value) - 2
}

const toggleContrast = () => {
  isHighContrast.value = !isHighContrast.value
}

// eslint-disable-next-line no-unused-vars
const exportHistory = () => {
  emit("exportHistory")
}

const menuItems = computed(() => {
  return [
    {
      label: t("chatReset"),
      icon: resetIcon,
      setting: { action: resetChat }
    },
    {
      label: t("contact.buttonLabel"),
      icon: userIcon,
      setting: {
        action: showContactInfo,
        type: "contact",
        config: props.chatbotConfig
      }
    },
    {
      label: t("chatDisplay")
    },
    {
      label: t("textSize"),
      icon: textSizeIconFilled,
      setting: {
        action: toggleTextSize,
        nextAction: toggleTextSize,
        prevAction: prevTextSize,
        type: "textsize"
      }
    },
    {
      label: t("contrast"),
      icon: contrastIconFilled,
      setting: {
        action: toggleContrast,
        type: "switch"
      }
    }
    // {
    //   label: "Export History",
    //   icon: flaskIcon,
    //   setting: {
    //     action: exportHistory
    //   }
    // }
  ]
})

const activeMenuIndex = ref(0)

const saveTextSizeSetting = () => {
  if (!currentTextSize.value) {
    return
  }

  sessionStorage.setItem("textSize", currentTextSize.value)
}

const loadTextSizeSetting = () => {
  const savedTextSize = sessionStorage.getItem("textSize")
  if (!savedTextSize) return
  currentTextSize.value = parseInt(savedTextSize) ?? 16
}

const handleNextAction = (item) => {
  if (!item.setting.nextAction) {
    return
  }
  item.setting.nextAction()
}

const handlePrevAction = (item) => {
  if (!item.setting.nextAction) {
    return
  }
  item.setting.prevAction()
}

const saveHighContrastSetting = () => {
  sessionStorage.setItem("isHighContrast", isHighContrast.value)
}

const loadHighContrastSetting = () => {
  isHighContrast.value = sessionStorage.getItem("isHighContrast") === "true" ?? false
}

const BASE_CLASS = "chatbot-menu"
const classes = computed(() => {
  const variant = props.chatbotConfig?.variant ?? "default"
  return [
    BASE_CLASS,
    `${BASE_CLASS}--variant-${variant}`,
    { "chat-window--high-contrast": isHighContrast.value }
  ]
})

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
  loadTextSizeSetting()
  loadHighContrastSetting()
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})

watch(currentTextSize, () => {
  emit("changeTextSize", currentTextSize.value)
  saveTextSizeSetting()
})

watch(isHighContrast, () => {
  emit("changeHighContrast", isHighContrast.value)
  saveHighContrastSetting()
})
</script>

<template>
  <div :class="classes">
    <button
      @click.stop="toggleMenu"
      @keydown.up.prevent="openMenu"
      @keydown.down.prevent="openMenu"
      @keydown.enter.prevent="toggleMenu"
      @keydown.space.prevent="toggleMenu"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
      ref="triggerRef"
      class="menu-btn"
      :disabled="props.loading"
    >
      <menuIcon :class="`${BASE_CLASS}__icon`" aria-hidden="true" />
      <span class="sr-only">
        {{ t("screenReader.menuAction") }}
      </span>
    </button>

    <ul
      v-show="isOpen"
      class="chat-window__menu chatbot-menu__list"
      :id="menuId"
      role="menu"
      @keydown.esc="closeMenu"
      @keydown.up.prevent="focusPreviousItem"
      @keydown.down.prevent="focusNextItem"
      @keydown.home.prevent="focusFirstItem"
      @keydown.end.prevent="focusLastItem"
      @keydown.tab.prevent="closeMenu"
      ref="menuRef"
    >
      <template v-for="(item, index) in menuItems" :key="index">
        <li
          v-if="item.setting"
          role="menuitem"
          tabindex="-1"
          class="menu__item"
          @click.stop="selectItem(item)"
          @keydown.enter.prevent="selectItem(item)"
          @keydown.space.prevent="selectItem(item)"
          @keydown.right.prevent="handleNextAction(item)"
          @keydown.left.prevent="handlePrevAction(item)"
          ref="menuItemRefs"
        >
          <component
            v-if="item.icon"
            width="24px"
            height="24px"
            :is="item.icon"
            aria-hidden="true"
          />
          {{ item.label }}

          <Transition name="fade" mode="out-in">
            <div
              v-show="item.setting.type && item.setting.type === 'contact' && isContactInfoVisible"
              aria-live="polite"
            >
              <p>
                <span class="bold">{{ t("label.contactName") }}</span>
                &nbsp;
                {{ props.chatbotConfig?.contact?.name }}
              </p>
              <p>
                <span class="bold">{{ t("label.email") }}</span>
                &nbsp;
                <a :href="`mailto:${props.chatbotConfig?.contact?.email}`">
                  {{ props.chatbotConfig?.contact?.email }}
                </a>
              </p>
            </div>
          </Transition>

          <ul
            v-if="item.setting.type && item.setting.type === 'textsize'"
            role="group"
            data-option="font-color"
            aria-label="Text Color"
            class="text-size__options"
            tabindex="0"
          >
            <li
              class="text-size18 text-size__step"
              :class="{ active: currentTextSize === 18 }"
              role="menuitemradio"
              :aria-checked="currentTextSize === 18"
            >
              A
            </li>
            <li
              class="text-size20 text-size__step"
              :class="{ active: currentTextSize === 20 }"
              role="menuitemradio"
              :aria-checked="currentTextSize === 20"
            >
              A
            </li>
            <li
              class="text-size22 text-size__step"
              :class="{ active: currentTextSize === 22 }"
              role="menuitemradio"
              :aria-checked="currentTextSize === 22"
            >
              A
            </li>
          </ul>

          <span v-if="item.setting.type && item.setting.type === 'switch'">
            <input
              id="contrast"
              class="menu-item-btn sr-only"
              type="checkbox"
              v-model="isHighContrast"
              role="switch"
              aria-label="t('contrast')"
            />
            <span class="switch" :class="{ active: isHighContrast }">
              <span class="switch-indicator"></span>
            </span>
          </span>
        </li>

        <li class="menu-group-header" v-else>
          {{ item.label }}
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@use "./ChatbotMenu.scss";
</style>
