<script setup>
import { computed, ref, watch } from "vue"
import { useI18n } from "@padcom/vue-i18n"
import langDEIcon from "@/assets/icons/langDE.svg?component"
import langGBIcon from "@/assets/icons/langGB.svg?component"
import langRUIcon from "@/assets/icons/langRU.svg?component"
import langARIcon from "@/assets/icons/langAR.svg?component"
import langTRIcon from "@/assets/icons/langTR.svg?component"
import LangItem from "@/components/Util/LangItem.vue"
import ComboBox from "./ComboBox.vue"

const { t, locale } = useI18n()

const props = defineProps({
  config: Object,
  loading: Boolean
})

const activeLanguages = computed(() => {
  if (!props.config.firstMessage || !props.config.welcome) {
    return []
  }

  const firstMessageLanguages = []
  for (const fmKey in props.config.firstMessage) {
    if (props.config.firstMessage[fmKey]) {
      firstMessageLanguages.push(fmKey)
    }
  }

  const welcomeLanguages = []
  for (const wKey in props.config.welcome) {
    // check if at least one of the three welcome properties are set
    if (
      props.config.welcome[wKey].title !== "" ||
      props.config.welcome[wKey].text !== "" ||
      props.config.welcome[wKey].additionalText !== ""
    ) {
      welcomeLanguages.push(wKey)
    }
  }

  const welcomeLanguagesSet = new Set(welcomeLanguages)

  // only provide translation if welcome and firstMessage has same translations
  return firstMessageLanguages.filter((key) => welcomeLanguagesSet.has(key))
})

const availableLanguages = [
  { id: "de", label: "Deutsch", icon: langDEIcon, screenReader: "Deutsche Sprache auswählen" },
  { id: "en", label: "English", icon: langGBIcon, screenReader: "Select English language" },
  { id: "tr", label: "Türkçe", icon: langTRIcon, screenReader: "Türkçe dilini seçin" },
  {
    id: "ar",
    label: "العربية",
    icon: langARIcon,
    screenReader: "اختر اللغة العربية (Select Arabic language)"
  },
  {
    id: "ru",
    label: "Русский",
    icon: langRUIcon,
    screenReader: "Выберите русский язык (Select russian language)"
  }
]

const languages = computed(() => {
  if (!activeLanguages.value) {
    return []
  }

  return availableLanguages.filter((l) => {
    return activeLanguages.value.includes(l.id)
  })
})

const selectedLang = ref(locale) // Default language

const emit = defineEmits(["language-changed"])

const onChangeLang = async (lang) => {
  if (props.loading === true) return
  selectedLang.value = lang.id
  emit("language-changed", selectedLang.value)
}

const selectedLanguage = computed(() => {
  return languages.value.filter((l) => {
    return l.id === selectedLang.value
  })[0]
})

const saveSelectedLanguage = () => {
  sessionStorage.setItem("selectedLanguage", selectedLanguage.value.id)
}

const selectNextLanguage = () => {
  let i = languages.value.findIndex((item) => {
    return item.id === selectedLang.value
  })
  i++

  if (i >= languages.value.length) {
    i = 0
  }

  selectedLang.value = languages.value[i].id
}

const selectPrevLanguage = () => {
  let i = languages.value.findIndex((item) => {
    return item.id === selectedLang.value
  })
  i--

  if (i < 0) {
    i = languages.value.length - 1
  }

  selectedLang.value = languages.value[i].id
}

const handleKeyDown = (event) => {
  let flag = false
  switch (event.key) {
    case " ":
      flag = true
      break

    case "Up":
    case "ArrowUp":
    case "Left":
    case "ArrowLeft":
      flag = true
      selectPrevLanguage()
      break

    case "Down":
    case "ArrowDown":
    case "Right":
    case "ArrowRight":
      flag = true
      selectNextLanguage()
      break

    default:
      break
  }

  if (flag) {
    event.stopPropagation()
    event.preventDefault()
  }
}

watch(selectedLang, (lang) => {
  locale.value = lang
  saveSelectedLanguage()
})
</script>

<template>
  <!-- https://www.w3.org/WAI/ARIA/apg/patterns/radio/examples/radio-activedescendant/ -->
  <div class="language-radio-select" v-if="languages.length > 1">
    <span id="lang-switch-title" class="lang-switch__title">{{ t("langSwitch") }}</span>
    <ul
      class="languages radiogroup-activedescendant"
      role="radiogroup"
      tabindex="0"
      :aria-activedescendant="languages[0].id"
      @keydown="handleKeyDown"
      aria-labelledby="lang-switch-title"
    >
      <li
        v-for="language in languages"
        :key="language.id"
        :aria-checked="selectedLang === language.id"
        role="radio"
        :id="language.id"
        @click="onChangeLang(language)"
        :disabled="loading"
        class="language-switch-radio-item"
      >
        <lang-item
          class="radio-input"
          :lang-flag-icon="language.icon"
          :label="language.id.toUpperCase()"
          :screenReader="language.screenReader"
        />
      </li>
    </ul>
  </div>
  <combo-box v-if="languages.length > 1" :options="languages" v-model="selectedLang" :loading="loading"></combo-box>
</template>

<style lang="scss" scoped>
label {
  cursor: pointer;
}

.lang-switch__title {
  white-space: nowrap;
}

.languages {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 2px 2px 4px;
  font-weight: bold;
  font-size: 0.875em;
  border: 2px solid transparent;
}

[role="radiogroup"] {
  padding: 0;
  margin: 0;
  list-style: none;
}

.language-switch-radio-item {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 30px;

  &:hover:not([disabled="true"]),
  &[aria-checked="true"] {
    border-color: var(--primary-color);
  }

  &[disabled="true"] {
    opacity: 0.4;
    &:hover {
      cursor: not-allowed;
    }
  }
}

.lang-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
  line-height: 0;
}

</style>
