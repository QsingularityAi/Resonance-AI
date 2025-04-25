import "vite/modulepreload-polyfill"
import "./HwChatbotToggle.js"

const $ = document.querySelector.bind(document)

const $$ = (el, props) => Object.assign(document.createElement(el), props)

function addChatbotToggle(
  chatbotId: string,
  apiUrl: string,
  textEn: string,
  textDe: string,
  elementId?: string
) {
  if ($("hw-chatbot")) return

  const el = $$("hw-chatbot-toggle")

  el.setAttribute("text-en", textEn)
  el.setAttribute("text-de", textDe)
  el.addEventListener("loadChatbot", () => loadChatbot(chatbotId, apiUrl, false, elementId))

  document.body.append(el)
}

async function loadChatbot(
  chatbotId: string,
  apiUrl: string,
  fullscreen: boolean,
  elementId?: string
) {
  const hwChatbot = $("hw-chatbot")
  const hwChatbotToggle = $("hw-chatbot-toggle")

  if (hwChatbot) {
    $("hw-chatbot").setAttribute("show", true)
  } else {
    await import("./HwChatbotCe.js")

    const el = $$("hw-chatbot", {
      isFullscreen: fullscreen ? "is-fullscreen" : undefined,
      chatbotId,
      apiUrl,
      elementId
    })

    const chatbotParent = document.getElementById(elementId)

    if (chatbotParent) {
      chatbotParent.append(el)
    } else {
      document.body.append(el)
    }

    el.setAttribute("show", true)
  }

  if (hwChatbotToggle) {
    hwChatbotToggle.style.display = "none"
  }
}

export function init(
  chatbotId: string,
  apiUrl: string,
  textEn: string,
  textDE: string,
  fullscreen: boolean,
  elementId?: string
) {
  if (fullscreen || elementId) {
    loadChatbot(chatbotId, apiUrl, !elementId, elementId)
  } else {
    addChatbotToggle(chatbotId, apiUrl, textEn, textDE, elementId)
  }
}

const scriptElement = document.getElementById("hw-chatbot-widget")
if (scriptElement) {
  const falsy = /^(?:f(?:alse)?|no?|0+)$/i
  let isFullscreen =
    !falsy.test(scriptElement.dataset.fullscreen) && !!scriptElement.dataset.fullscreen

  init(
    scriptElement.dataset.chatbotId,
    scriptElement.dataset.apiUrl,
    scriptElement.dataset.toggleTextEn,
    scriptElement.dataset.toggleTextDe,
    isFullscreen,
    scriptElement.dataset.elementId
  )
}
