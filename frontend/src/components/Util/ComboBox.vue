<script setup>
import { ref, onMounted } from "vue"
import LangItem from "./LangItem.vue"
import caretDownIcon from "@/assets/icons/caret-down.svg?component"

const SelectActions = {
  Close: 0,
  CloseSelect: 1,
  First: 2,
  Last: 3,
  Next: 4,
  Open: 5,
  PageDown: 6,
  PageUp: 7,
  Previous: 8,
  Select: 9,
  Type: 10,
  CloseDefault: 11
}

const emit = defineEmits(["update:modelValue"])

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: "Select an option"
  },
  modelValue: {
    type: String,
    required: true
  },
  loading: Boolean
})

const comboEl = ref(null)
const listboxEl = ref(null)
const open = ref(false)
const activeIndex = ref(0)
const idBase = ref("combo")
const searchString = ref("")
const searchTimeout = ref(null)
const ignoreBlur = ref(false)

const selectedOption = ref(props.options[0])
const activeDescendant = ref("")

function init() {
  for (let i = 0; i < props.options.length; i++) {
    const item = props.options[i]
    if (item.id === props.modelValue) {
      selectedOption.value = item
      activeIndex.value = i
      break
    }
  }
}

function getSearchString(char) {
  if (typeof searchTimeout.value === "number") {
    window.clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = window.setTimeout(() => {
    searchString.value = ""
  }, 500)

  searchString.value += char
  return searchString.value
}

function onComboClick() {
  if (props.loading) return
  updateMenuState(!open.value, false)
}

function onComboKeyDown(event) {
  const { key } = event
  const max = props.options.length - 1

  const action = getActionFromKey(event, open.value)

  switch (action) {
    case SelectActions.Last:
    case SelectActions.First:
      updateMenuState(true)
    // intentional fallthrough
    case SelectActions.Next:
    case SelectActions.Previous:
    case SelectActions.PageUp:
    case SelectActions.PageDown:
      event.preventDefault()
      return onOptionChange(getUpdatedIndex(activeIndex.value, max, action))
    case SelectActions.CloseSelect:
      event.preventDefault()
      selectOption(activeIndex.value)
    // intentional fallthrough
    case SelectActions.Close:
      event.preventDefault()
      return updateMenuState(false)
    case SelectActions.Type:
      return onComboType(key)
    case SelectActions.Open:
      event.preventDefault()
      return updateMenuState(true)
    case SelectActions.CloseDefault:
      return updateMenuState(false)
  }
}

function onComboType(letter) {
  updateMenuState(true)

  const searchStr = getSearchString(letter)
  const searchIndex = getIndexByLetter(props.options, searchStr, activeIndex.value + 1)

  if (searchIndex >= 0) {
    onOptionChange(searchIndex)
  } else {
    window.clearTimeout(searchTimeout.value)
    searchString.value = ""
  }
}

function onOptionChange(index) {
  activeIndex.value = index
  activeDescendant.value = `${idBase.value}-${index}`

  const options = listboxEl.value.querySelectorAll("[role=option]")
  options.forEach((optionEl) => {
    optionEl.classList.remove("option-current")
  })
  options[index].classList.add("option-current")

  if (isScrollable(listboxEl.value)) {
    maintainScrollVisibility(options[index], listboxEl.value)
  }

  if (!isElementInView(options[index])) {
    options[index].scrollIntoView({ behavior: "smooth", block: "nearest" })
  }
}

function onOptionClick(index) {
  onOptionChange(index)
  selectOption(index)
  updateMenuState(false)
}

function onOptionMouseDown() {
  ignoreBlur.value = true
}

function selectOption(index) {
  activeIndex.value = index
  selectedOption.value = props.options[index]

  emit("update:modelValue", props.options[index].id)

  const options = listboxEl.value.querySelectorAll("[role=option]")
  options.forEach((optionEl) => {
    optionEl.setAttribute("aria-selected", "false")
  })
  options[index].setAttribute("aria-selected", "true")
}

function updateMenuState(isOpen, callFocus = true) {
  if (open.value === isOpen) return

  open.value = isOpen

  if (isOpen) {
    activeDescendant.value = `${idBase.value}-${activeIndex.value}`
  } else {
    activeDescendant.value = ""
  }

  if (activeDescendant.value === "" && !isElementInView(comboEl.value)) {
    comboEl.value.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  if (callFocus) comboEl.value.focus()
}

function filterOptions(options = [], filter, exclude = []) {
  return options.filter((option) => {
    const matches = option.toLowerCase().indexOf(filter.toLowerCase()) === 0
    return matches && exclude.indexOf(option) < 0
  })
}

function getIndexByLetter(options, filter, startIndex = 0) {
  const orderedOptions = [...options.slice(startIndex), ...options.slice(0, startIndex)]
  const firstMatch = filterOptions(orderedOptions, filter)[0]
  const allSameLetter = (array) => array.every((letter) => letter === array[0])

  // first check if there is an exact match for the typed string
  if (firstMatch) {
    return options.indexOf(firstMatch)
  }

  // if the same letter is being repeated, cycle through first-letter matches
  else if (allSameLetter(filter.split(""))) {
    const matches = filterOptions(orderedOptions, filter[0])
    return options.indexOf(matches[0])
  }

  // if no matches, return -1
  else {
    return -1
  }
}

function getActionFromKey(event, menuOpen) {
  const { key, altKey, ctrlKey, metaKey } = event
  const openKeys = ["ArrowDown", "ArrowUp", "Enter", " "]

  if (!menuOpen && openKeys.includes(key)) {
    return SelectActions.Open
  }

  if (key === "Home") {
    return SelectActions.First
  }
  if (key === "End") {
    return SelectActions.Last
  }

  if (
    key === "Backspace" ||
    key === "Clear" ||
    (key.length === 1 && key !== " " && !altKey && !ctrlKey && !metaKey)
  ) {
    return SelectActions.Type
  }

  if (menuOpen) {
    if (key === "ArrowUp" && altKey) {
      return SelectActions.CloseSelect
    } else if (key === "ArrowDown" && !altKey) {
      return SelectActions.Next
    } else if (key === "ArrowUp") {
      return SelectActions.Previous
    } else if (key === "PageUp") {
      return SelectActions.PageUp
    } else if (key === "PageDown") {
      return SelectActions.PageDown
    } else if (key === "Escape") {
      return SelectActions.Close
    } else if (key === "Enter" || key === " ") {
      return SelectActions.CloseSelect
    } else if (key === "Tab") {
      return SelectActions.CloseDefault
    }
  }
}

function getUpdatedIndex(currentIndex, maxIndex, action) {
  const pageSize = 10 // used for pageup/pagedown

  switch (action) {
    case SelectActions.First:
      return 0
    case SelectActions.Last:
      return maxIndex
    case SelectActions.Previous:
      return Math.max(0, currentIndex - 1)
    case SelectActions.Next:
      return Math.min(maxIndex, currentIndex + 1)
    case SelectActions.PageUp:
      return Math.max(0, currentIndex - pageSize)
    case SelectActions.PageDown:
      return Math.min(maxIndex, currentIndex + pageSize)
    default:
      return currentIndex
  }
}

function isScrollable(element) {
  return element && element.clientHeight < element.scrollHeight
}

function maintainScrollVisibility(activeElement, scrollParent) {
  const { offsetHeight, offsetTop } = activeElement
  const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent

  const isAbove = offsetTop < scrollTop
  const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight

  if (isAbove) {
    scrollParent.scrollTo(0, offsetTop)
  } else if (isBelow) {
    scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight)
  }
}

function isElementInView(element) {
  const bounding = element.getBoundingClientRect()

  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

onMounted(() => {
  init()
})
</script>

<template>
  <div :class="{ open: open }" class="language-dropdown-select">
    <div
      :id="idBase"
      role="combobox"
      :aria-expanded="open.toString()"
      :aria-activedescendant="activeDescendant"
      @click="onComboClick"
      @keydown="onComboKeyDown"
      tabindex="0"
      ref="comboEl"
      class="combo-box"
      :disabled="loading"
    >
      <lang-item
        :lang-flag-icon="selectedOption.icon"
        :label="selectedOption.id.toUpperCase()"
        :screenReader="selectedOption.screenReader"
      />
      <caretDownIcon class="caret" width="28px" height="28px" color="#787F89" />
    </div>
    <div role="listbox" class="combo-menu" ref="listboxEl">
      <div
        v-for="(option, index) in options"
        :key="index"
        :id="`${idBase}-${index}`"
        role="option"
        :class="{ 'combo-option': true, 'option-current': index === activeIndex }"
        :aria-selected="(index === activeIndex).toString()"
        @click="onOptionClick(index)"
        @mousedown="onOptionMouseDown"
      >
        <lang-item
          :lang-flag-icon="option.icon"
          :label="option.label"
          :screenReader="option.screenReader"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.combo-box {
  user-select: none;
  display: flex;
  gap: 8px;
  padding: 4px 2px;
  border-radius: 4px;
  cursor: pointer;

  &[disabled="true"] {
    opacity: 0.4;
    &:hover {
      cursor: not-allowed;
    }
  }
}

.combo-menu {
  display: none;
  top: 100%;
  right: 1rem;
  max-width: 300px;
  color: #000;
  border-radius: 8px;
  padding: 16px 24px;
  overflow: hidden;
  position: absolute;
  background-color: #fff;
  width: auto;
  grid-template-rows: auto;
  grid-gap: 16px;
  justify-content: flex-end;
  text-align: right;
  box-shadow: rgba(129, 129, 129, 0.35) 0 0 8px;
  z-index: 10;
}

.chat-window-wrapper--rtl {
  .combo-menu {
    right: unset;
    left: 1rem;
  }
}

.open .combo-menu {
  display: grid;
}

.combo-option {
  padding: 10px 12px 12px;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    background-color: var(--primary-color10);
  }

  &.option-current {
    outline: 3px dashed;
    outline-offset: -3px;
    border-radius: 8px;
  }

  &[aria-selected="true"] {
    padding-right: 38px;
    position: relative;

    &::after {
      border-bottom: 2px solid #000;
      border-right: 2px solid #000;
      content: "";
      height: 16px;
      position: absolute;
      right: 16px;
      top: 42%;
      transform: translate(0, -50%) rotate(45deg);
      width: 8px;
    }
  }
}

.caret {
  transform: rotate(0deg);
  transition: transform 0.2s ease-out;
}

.open .caret {
  transform: rotate(-180deg);
  transition: transform 0.2s ease-out;
}
</style>
