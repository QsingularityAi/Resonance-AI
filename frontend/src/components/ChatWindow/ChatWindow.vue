<script setup>
import { computed, inject, nextTick, onMounted, ref, useTemplateRef, watch } from "vue"
import { useI18n } from "@padcom/vue-i18n"
import sendIcon from "@/assets/icons/send.svg?component"
import trashIconOutline from "@/assets/icons/trash-x-outline.svg?component"
import trashIconFilled from "@/assets/icons/trash-x-filled.svg?component"
import ChatMessage from "@/components/ChatMessage/ChatMessage.vue"
import chatService from "@/services/chatService.js"
import LoadingIndicator from "@/components/Util/LoadingIndicator.vue"
import ChatWindowRecorder from "@/components/ChatWindowRecorder/ChatWindowRecorder.vue"
import ChatMessageWelcome from "@/components/ChatMessageWelcome/ChatMessageWelcome.vue"
import ChatWindowMoreAction from "@/components/ChatWindowMoreAction/ChatWindowMoreAction.vue"
import { blendWithWhite, valueToHex } from "@/util/color.js"

import { uuid } from "vue-uuid"
import ChatWindowHeader from "@/components/ChatWindowHeader/ChatWindowHeader.vue"
import SponsoredBy from "@/components/SponsoredBy/SponsoredBy.vue"
import HwButton from "@/components/Util/Button/HwButton.vue"

const LOCAL_STORAGE_KEY = "hwChatbotMessages"
const LOCAL_STORAGE_KEY_CONVERSATION_ID = "hwConversationId"
const BASE_CLASS = "chat-window"

const { t, locale } = useI18n()

const props = defineProps({
  show: {
    type: Boolean
  },
  chatbotConfig: {
    type: Object
  },
  chatbotId: {
    type: String
  }
})

const messages = ref([])
const messageInput = ref("")
const isLoading = ref(false)

const isWaitingForResponse = ref(false)
const openAnswer = ref(-1)
const isRecording = ref(false)
const currentRecord = ref(null)
const recordingBlobBase64 = ref(null)

const isLoadingMessagesFromLocalStorage = ref(false)

const isFullscreen = inject("isFullscreen")

const isHighContrast = ref(false)
const highContrastLightBackgroundColor = ref("#fff")
const highContrastOnLightTextColor = ref("#000")
const highContrastDarkBackgroundColor = ref("#000")
const highContrastOnDarkTextColor = ref("#fff")
const currentTextSize = ref(16)

const conversationId = ref(uuid.v1())
const isTyping = ref(false)
const ratingDisabled = ref(false)

const promptInput = useTemplateRef("promptInput")
const messageContainer = useTemplateRef("chatContentContainer")
const chatbotRecorder = useTemplateRef("chatbotRecorder")
const moreActionElement = useTemplateRef("moreActionElement")
const chatWindowRef = useTemplateRef("chatWindowRef")
const chatbotMessageRefs = ref([])

const sendImmediately = ref(false)
const hasAudioToSend = computed(() => {
  return !!currentRecord.value
})

const canSendMessage = computed(() => {
  return (
    (!isWaitingForResponse.value && (!!messageInput.value || hasAudioToSend.value)) ||
    isRecording.value
  )
})

const primaryColor = computed(() => {
  return props.chatbotConfig.primaryColor
})

const primaryColor10 = computed(() => {
  return blendWithWhite(props.chatbotConfig.primaryColor + valueToHex(10))
})

const primaryColor20 = computed(() => {
  return blendWithWhite(props.chatbotConfig.primaryColor + valueToHex(20))
})

const primaryColor80 = computed(() => {
  return blendWithWhite(props.chatbotConfig.primaryColor + valueToHex(80))
})

const fontSize = computed(() => {
  return `${currentTextSize.value}px`
})

const direction = computed(() => {
  return locale.value === "ar" ? "rtl" : "ltr"
})

const showRatingActions = computed(() => {
  const notWaitingAndNotTyping = !isWaitingForResponse.value // && !isTyping.value
  if (notWaitingAndNotTyping) {
    scrollToBottom()
  }
  return notWaitingAndNotTyping
})

const toggleChatWindow = () => {
  document.querySelector("hw-chatbot").removeAttribute("show")
  document.querySelector("hw-chatbot-toggle").style.display = "block"
}

const firstMessageContent = computed(() => {
  return props.chatbotConfig.firstMessage[locale.value]
})

const variant = computed(() => {
  return props.chatbotConfig.variant ?? "default"
})

const isGlassVariant = computed(() => {
  return variant.value === "glass" || variant.value === "default"
})

const classes = computed(() => {
  return [
    BASE_CLASS,
    `${BASE_CLASS}--variant-${variant.value}`,
    { "chat-window--high-contrast": isHighContrast.value }
  ]
})

/**
 * @param {Object} messageContent
 * @param {String} messageContent.content
 * @param {Blob} messageContent.recording
 * @param {("user"|"assistant"|"first"|"ignore")} role
 * @param {Boolean} srHidden
 * @param animate
 * @param index
 */
const addMessage = (
  messageContent,
  role = "user",
  srHidden = false,
  animate = false,
  index = -1
) => {
  const now = new Date().getTime()
  const message = {
    id: now.toString(),
    role: role,
    timestamp: now,
    srHidden: srHidden,
    ...messageContent,
    animate
  }

  if (index > 0) {
    messages.value.splice(index, 0, message)
  } else {
    messages.value.push(message)
  }

  scrollToBottom()
}

const scrollThreshold = 768
const doNotScrollToBottom = ref(false)
const chatWindowRefWidth = computed(() => {
  if (!chatWindowRef.value) return 0
  const boundingBox = chatWindowRef.value.getBoundingClientRect()
  return boundingBox.width
})

const isMobile = computed(() => {
  return chatWindowRefWidth.value < scrollThreshold
})

const beforeSend = () => {
  sendImmediately.value = false
  doNotScrollToBottom.value = isMobile.value
}

// fixme: refactor sendMessage + sendAudio
/**
 *
 * @param additionalData
 * @param index position where question and answer has to be placed. -1 means end of list
 * @returns {Promise<void>}
 */
const sendMessage = async (additionalData, index = -1) => {
  if (isWaitingForResponse.value) return
  beforeSend()

  if (isRecording.value) {
    await chatbotRecorder.value.stopRecording()
    sendImmediately.value = true
    return
  }

  if (currentRecord.value) {
    await sendAudio()
    return
  }

  isWaitingForResponse.value = true
  let history = getHistory(index)
  const message = messageInput.value
  messageInput.value = ""

  addMessage({ content: message }, "user", 0, false, index)
  try {
    createTempMessage(index)

    const data = {
      text_input: message,
      ...additionalData
    }
    await chatService.sendMessage(
      props.chatbotId,
      data,
      history,
      locale.value,
      onUpdated,
      conversationId.value
    )
  } catch (e) {
    console.error("error sendMessage", e)
    addErrorMessage(e)
  } finally {
    afterSend()
  }
}

const getHistory = (index) => {
  let history = messages.value
    .filter((chatMessage) => {
      return chatMessage.role === "user" || chatMessage.role === "assistant"
    })
    .map((chatMessage) => {
      return {
        role: chatMessage.role,
        content: chatMessage.content
      }
    })

  if (index > 0) {
    // cut history
    history = history.splice(0, index - 1)
  }

  return history
}

function createTempMessage(index) {
  openAnswer.value = messages.value.length
  let nextIndex = index
  if (index >= 0) {
    nextIndex = index + 1
    openAnswer.value = nextIndex
  }
  addMessage({ content: "" }, "assistant", false, true, nextIndex)
}

const sendAudio = async (index = -1) => {
  if (isWaitingForResponse.value) return
  beforeSend()

  const _currentRecord = currentRecord.value
  let history = getHistory(index)

  const messageContent = {
    recording: _currentRecord,
    recordingBlobBase64: recordingBlobBase64.value
  }
  addMessage(messageContent, "user", 0, true, index)

  isWaitingForResponse.value = true

  try {
    // index of current writing message -> will be added to until response finished
    createTempMessage(index)

    chatbotRecorder.value.deleteCurrentAudioRecord()

    const data = {
      audio_input: _currentRecord
    }
    await chatService.sendMessage(
      props.chatbotId,
      data,
      history,
      locale.value,
      onUpdated,
      conversationId.value
    )
  } catch (e) {
    console.error("sendAudio error: ", { e })
    addErrorMessage()
  } finally {
    afterSend()
  }
}

const afterSend = () => {
  scrollToBottom()
  resetAfterSend()
  focusInput()
  addMessagesToLocalStorage()
}

/**
 *
 * @param {AxiosError} e
 */
const addErrorMessage = (e) => {
  let errorMessage = t("error.generic")

  const isNetworkError = e.code === "ERR_NETWORK"
  if (isNetworkError) {
    errorMessage = t("error.network")
    messages.value[openAnswer.value].offer_human_contact = true
  }

  if (messages.value[openAnswer.value - 1].recordingBlobBase64) {
    // error while sending audio -> no transcription/content -> sending new messages would throw error
    messages.value[openAnswer.value - 1].content = errorMessage
  }
  messages.value[openAnswer.value].content = errorMessage
  messages.value[openAnswer.value].error = true
}

const checkWarningExist = (warning) => {
  return messages.value.some((message) => {
    if (!message.warning) return false
    return message.warning === warning
  })
}

const onUpdated = (data) => {
  if (data.answer_text) {
    messages.value[openAnswer.value].content = data.answer_text
    messages.value[openAnswer.value].id = new Date().getTime().toString()
  }
  if (data.sources) {
    messages.value[openAnswer.value].sources = data.sources
  }
  if (data.image) {
    messages.value[openAnswer.value].image = data.image
    messages.value[openAnswer.value].image_title = data.image_title
    messages.value[openAnswer.value].image_description = data.image_description
    messages.value[openAnswer.value].image_source = data.image_source
  }
  if (data.related_questions) {
    messages.value[openAnswer.value].related_questions = data.related_questions
  }
  if (data.faq_questions) {
    messages.value[openAnswer.value].faq_questions = data.faq_questions
  }
  if (data.transcribed_audio) {
    if (!messages.value[openAnswer.value - 1].content) {
      messages.value[openAnswer.value - 1].content = data.transcribed_audio
    }
  }
  if (data.user_dissatisfaction_detected) {
    moreActionElement.value.displayContactInfo()
  }
  if (data.warning) {
    const trimmedWaring = data.warning.trim()
    const hasWarning = checkWarningExist(trimmedWaring)
    if (!hasWarning) {
      messages.value[openAnswer.value].warning = trimmedWaring
    }
  }
  if (data.offer_human_contact) {
    // stop further streaming?
    messages.value[openAnswer.value].offer_human_contact = data.offer_human_contact
  }
}

const focusInput = () => {
  nextTick().then(() => {
    if (promptInput.value) {
      promptInput.value.focus()
    } else {
      console.warn("input not found")
    }
  })
}

const lastMessageScrollPosition = ref(0)
const lastMessageScrollPositionReached = ref(false)

const scrollToBottom = (behavior = "smooth") => {
  if (initialState.value === true) return

  if (!messageContainer.value) {
    console.warn("messageContainer not found")
    return
  }
  nextTick(() => {
    if (doNotScrollToBottom.value) {
      const lastMessageEl = chatbotMessageRefs.value[chatbotMessageRefs.value.length - 1]
      const offsetTop = lastMessageEl.offsetTop - 180
      if (lastMessageScrollPosition.value === offsetTop && lastMessageScrollPositionReached.value) {
        return
      }
      lastMessageScrollPosition.value = offsetTop
      // small delay needed here, bc not enough content on page to reach offsetTop
      lastMessageScrollPositionReached.value = messageContainer.value.scrollTop >= offsetTop

      setTimeout(() => {
        messageContainer.value.scrollTo({
          top: lastMessageScrollPosition.value,
          behavior: behavior
        })
      }, 50)
    } else {
      messageContainer.value.scrollTo({
        top: messageContainer.value.scrollHeight,
        behavior: behavior
      })
    }
  })
}

const initialState = ref(false)
watch(initialState, (newValue) => {
  if (newValue === true) {
    setTimeout(() => {
      initialState.value = false
    }, 1000)
  }
})

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const updateThemeColor = () => {
  // If color is not dark enough, default browser color will be used (tested with chrome)
  const color = props.chatbotConfig.primaryColor
  const el = document.querySelector('meta[name="theme-color"]')
  if (el) {
    el.remove()
  }

  const meta = document.createElement("meta")
  meta.name = "theme-color"
  meta.content = color
  document.head.appendChild(meta)
}

const getContactInfo = (userAction = true) => {
  let text = t("contact.intro", { sign: userAction ? "." : "?" })
  text += "\n\n"

  if (props.chatbotConfig.contact.name && props.chatbotConfig.contact.email) {
    text += "\n\n"
    text += `_${t("contact.contactPerson.content")}_`
    text += "\n\n"
    const c1 = `- **${t("label.contactName")}** ${props.chatbotConfig.contact.name} \n- **${t("label.email")}** ${props.chatbotConfig.contact.email}`
    text += c1
  }

  if (props.chatbotConfig.tech_contact.name && props.chatbotConfig.tech_contact.email) {
    text += "\n\n"
    text += `_${t("contact.contactPerson.technical")}_`
    text += "\n\n"
    const c2 = `- **${t("label.contactName")}** ${props.chatbotConfig.tech_contact.name} \n- **${t("label.email")}** ${props.chatbotConfig.tech_contact.email}`
    text += c2
  }
  return text
}

const showContactInfo = () => {
  addMessage({ content: getContactInfo() }, "ignore", false, true)
}

const getStoredMessages = () => {
  if (isLoadingMessagesFromLocalStorage.value) return

  isLoadingMessagesFromLocalStorage.value = true
  const jsonString = sessionStorage.getItem(LOCAL_STORAGE_KEY)
  if (!jsonString) {
    isLoadingMessagesFromLocalStorage.value = false
    return
  }

  try {
    messages.value = JSON.parse(jsonString)
  } catch (e) {
    console.error("Error parsing json string from local storage (getStoredMessages)")
  } finally {
    isLoadingMessagesFromLocalStorage.value = false
  }
}

const addMessagesToLocalStorage = () => {
  if (messages.value.length === 0) {
    sessionStorage.setItem(LOCAL_STORAGE_KEY, "")
    return
  }
  for (let i = 0; i < messages.value.length; i++) {
    if (messages.value[i].animate) {
      messages.value[i].animate = false
    }
    messages.value[i].srHidden = false
  }

  const jsonString = JSON.stringify(messages.value)
  sessionStorage.setItem(LOCAL_STORAGE_KEY, jsonString)
}

const onRelatedQuestionClicked = (question) => {
  messageInput.value = question.question
  sendMessage({ faqId: question.faqId })
}

const onAudioAvailable = (file) => {
  currentRecord.value = file

  const reader = new FileReader()
  reader.onloadend = () => {
    recordingBlobBase64.value = reader.result
    if (sendImmediately.value) {
      sendAudio()
    }
  }
  reader.readAsDataURL(currentRecord.value)
}

const onStartRecording = () => {
  isRecording.value = true
}

const onFinishedRecording = () => {
  isRecording.value = false
}

const onDeleteMedia = () => {
  currentRecord.value = null
}

const onMessageUpdate = () => {
  scrollToBottom()
}

const onRatePositive = () => {
  rateConversation("up")
}

const onRateNegative = () => {
  rateConversation("down")
}

/**
 *
 * @param {("up"|"down")} action
 */
const rateConversation = async (action) => {
  try {
    await chatService.voteConversation(conversationId.value, action)
    ratingDisabled.value = true
  } catch (e) {
    console.error(e)
  }
}

const clearInput = () => {
  messageInput.value = ""
  promptInput.value.textContent = ""
}

const onResetChat = () => {
  messages.value = []
  addMessagesToLocalStorage()
  createNewConversationId()
}

const onChangeTextSize = (v) => {
  currentTextSize.value = v
}

const onChangeHighContrast = (v) => {
  isHighContrast.value = v
}

const onTypingStarted = () => {
  isTyping.value = true
}

const onTypingFinished = () => {
  isTyping.value = false
}

const onExportHistory = () => {
  const fileName = `${props.chatbotId}_${new Date().getTime()}.json`
  const data = messages.value.map((chatMessage) => {
    return {
      content: chatMessage.content,
      role: chatMessage.role,
      sources: chatMessage.sources
    }
  })
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)

  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 *
 * @param index index of answer user wants to retry
 */
const onRetry = (index) => {
  const lastUserMessage = messages.value[index - 1]

  messageInput.value = lastUserMessage.content

  // remove 2 error question and response
  messages.value.splice(index - 1, 2)

  // what if audio?
  if (lastUserMessage.recordingBlobBase64) {
    // is audio
    const byteCharacters = atob(lastUserMessage.recordingBlobBase64.split(",")[1])
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    currentRecord.value = new Blob([byteArray], { type: "audio/mpeg" })
    recordingBlobBase64.value = lastUserMessage.recordingBlobBase64
    sendAudio(index - 1)
  } else {
    // add user and assistant message at previous position
    sendMessage({}, index - 1)
  }
}

const resetAfterSend = () => {
  isWaitingForResponse.value = false
  openAnswer.value = -1
  currentRecord.value = null
  recordingBlobBase64.value = null
  messageInput.value = ""
  promptInput.value.textContent = ""
  moreActionElement.value.resetInputs()
  ratingDisabled.value = false
}

const saveConversationId = () => {
  sessionStorage.setItem(LOCAL_STORAGE_KEY_CONVERSATION_ID, conversationId.value)
}

const loadConversationId = () => {
  const _conversationId = sessionStorage.getItem(LOCAL_STORAGE_KEY_CONVERSATION_ID)
  if (_conversationId === null) {
    saveConversationId()
  } else {
    conversationId.value = _conversationId
  }
}

const createNewConversationId = () => {
  conversationId.value = uuid.v1()
  saveConversationId()
}

const onTypingInProgress = () => {
  scrollToBottom("instant")
}

const inputEditable = computed(() => {
  return !isRecording.value && !isWaitingForResponse.value && !hasAudioToSend.value
})

const pasteContent = (event) => {
  const text = event.clipboardData?.getData("text/plain")
  if (text) document.execCommand?.("insertText", false, text)
}

const updateMessageInput = () => {
  messageInput.value = promptInput.value.textContent
}

onMounted(() => {
  getStoredMessages()
  loadConversationId()
  updateThemeColor()

  if (isFullscreen.value) {
    disableBodyScroll()
  }
})

watch(isWaitingForResponse, (isWaiting) => {
  document.body.style.cursor = isWaiting ? "wait" : "auto"
})
</script>

<template>
  <div class="chat-window-wrapper" :class="{ [`chat-window-wrapper--${direction}`]: true }">
    <div :class="classes" ref="chatWindowRef" :lang="locale">
      <div v-if="isLoading" class="loading-window">
        <loading-indicator></loading-indicator>
      </div>
      <div class="chat-window__inner" v-if="!isLoading">
        <ChatWindowHeader
          :config="chatbotConfig"
          :loading="isWaitingForResponse"
          @click-reset-chat="onResetChat"
          @change-text-size="onChangeTextSize"
          @change-high-contrast="onChangeHighContrast"
          @export-history="onExportHistory"
          @show-contact-info="showContactInfo"
          @toggle-chat-window="toggleChatWindow"
        />
        <section
          ref="chatContentContainer"
          class="chat-content"
          aria-live="polite"
          :aria-label="t('screenReader.label.history')"
        >
          <!-- todo: control via config -->
          <SponsoredBy v-if="!isGlassVariant" />

          <TransitionGroup tag="ul" name="list" class="chat-content__inner">
            <li>
              <ChatMessageWelcome
                v-if="chatbotConfig.welcome && chatbotConfig.welcome[locale]"
                :chatbot-config="chatbotConfig"
                :welcome-title="chatbotConfig.welcome[locale].title"
                :welcome-text="chatbotConfig.welcome[locale].text"
                :welcome-additional-text="chatbotConfig.welcome[locale].additionalText"
              />
            </li>
            <li v-if="isGlassVariant">
              <span class="divider"></span>
            </li>

            <!-- initial message -->
            <li>
              <ChatMessage
                :message="{
                  content: firstMessageContent,
                  role: 'first'
                }"
                :avatar="chatbotConfig?.avatar"
                :config="chatbotConfig"
                :animate="true"
                @update-message="onMessageUpdate"
                @typing-started="onTypingStarted"
                @typing-finished="onTypingFinished"
                @typing-in-progress="onTypingInProgress"
              ></ChatMessage>
            </li>
            <li v-for="(message, index) in messages" :key="message.id" ref="chatbotMessageRefs">
              <ChatMessage
                :message="message"
                :avatar="chatbotConfig?.avatar"
                :is-loading="index === openAnswer && isWaitingForResponse"
                :config="chatbotConfig"
                :animate="message.animate"
                :key="message.id"
                @update-message="onMessageUpdate"
                @typing-started="onTypingStarted"
                @typing-finished="onTypingFinished"
                @typing-in-progress="onTypingInProgress"
                @retry="onRetry(index)"
              ></ChatMessage>
            </li>
            <li>
              <ChatWindowMoreAction
                ref="moreActionElement"
                :data="messages[messages.length - 1]"
                :showRatingActions="showRatingActions"
                :ratingDisabled="ratingDisabled"
                @related-question-clicked="onRelatedQuestionClicked"
                @contact-support-clicked="showContactInfo"
                @rate-positive="onRatePositive"
                @rate-negative="onRateNegative"
              />
            </li>
          </TransitionGroup>
        </section>

        <footer class="chat-window__footer">
          <form class="input-wrapper" autocomplete="off">
            <div
              role="textbox"
              :aria-label="t('sendPlaceholder')"
              :placeholder="inputEditable ? t('sendPlaceholder') : ''"
              @input="updateMessageInput"
              ref="promptInput"
              id="promptInput"
              class="chatInput"
              :class="{ disabled: isWaitingForResponse }"
              @keydown.enter.prevent="sendMessage"
              :contenteditable="inputEditable"
              @paste.prevent="pasteContent"
            ></div>

            <div class="prompt-actions">
              <ChatWindowRecorder
                v-show="!messageInput"
                ref="chatbotRecorder"
                :is-loading="isWaitingForResponse"
                :primary-color="primaryColor"
                @audio-available="onAudioAvailable"
                @startedRecording="onStartRecording"
                @finished-recording="onFinishedRecording"
                @delete-media="onDeleteMedia"
                :is-glass-variant="isGlassVariant"
              ></ChatWindowRecorder>

              <HwButton
                v-if="messageInput"
                class="clear-btn"
                @click="clearInput"
                :icon="trashIconOutline"
                :color="primaryColor"
                :hover-icon="trashIconFilled"
                :hover-color="primaryColor"
                :aria-label="t('screenReader.clearAction')"
              ></HwButton>

              <HwButton
                type="submit"
                class="send-btn prompt-action"
                @click.prevent="sendMessage"
                :disabled="!canSendMessage"
                :icon="sendIcon"
                :color="isGlassVariant ? '#0F1C2E' : 'var(--primary-color)'"
                :hover-color="isGlassVariant ? '#0F1C2E' : 'var(--primary-color)'"
                :radius="isGlassVariant ? '16px' : '0'"
                :size="isGlassVariant ? 'lg' : ''"
                :aria-label="t('screenReader.sendAction')"
              ></HwButton>
            </div>
          </form>
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./ChatWindow.scss";

.chat-window-wrapper {
  --primary-color: v-bind(primaryColor);
  --primary-color10: v-bind(primaryColor10);
  --primary-color20: v-bind(primaryColor20);
  --primary-color80: v-bind(primaryColor80);
  --high-contrast-light-background-color: v-bind(highContrastLightBackgroundColor);
  --high-contrast-on-light-text-color: v-bind(highContrastOnLightTextColor);
  --high-contrast-dark-background-color: v-bind(highContrastDarkBackgroundColor);
  --high-contrast-on-dark-text-color: v-bind(highContrastOnDarkTextColor);

  font-size: v-bind(fontSize);
  direction: v-bind(direction);
}
</style>
