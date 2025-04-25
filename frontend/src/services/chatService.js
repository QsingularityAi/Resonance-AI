import api from "@/services/api"
import { uuid } from "vue-uuid"

export default {
  /**
   *
   * @param {{
   *   text_input: ?String,
   *   audio_input: ?Blob,
   *   faq_id: ?Number
   * }} data
   * @param {Array} messages
   * @param {String} lang
   * @param updateHandler
   * @returns {Promise<void>}
   */
  async sendMessage(chatbotId, data, messages, lang, updateHandler, conversationId) {
    const url = "/chat/"
    const formData = new FormData()

    formData.append("chatbot_id", chatbotId)
    formData.append("conversation_id", conversationId)

    if ("text_input" in data) {
      formData.append("text_input", data.text_input)
    }

    if ("audio_input" in data) {
      formData.append("audio_input", data.audio_input)
    }

    if ("faqId" in data && data.faqId) {
      formData.append("faq_id", parseInt(data.faqId))
    }

    if (messages && messages.length > 0) {
      for (let i = 0; i < messages.length; i++) {
        formData.append("messages[]", JSON.stringify(messages[i]))
      }
    }

    const response = await api.post(url, formData, {
      headers: {
        "Accept-Language": lang,
        "Content-Type": "multipart/form-data"
      },
      responseType: "stream",
      adapter: "fetch"
    })

    const reader = response.data.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk
      const lines = buffer.split("\n").filter(Boolean)

      for (const line of lines) {
        try {
          const update = JSON.parse(line)
          updateHandler(update)
          // json parse success -> reset buffer
          buffer = ""
        } catch (error) {
          // "no complete json chunk. -> next"
        }
      }
    }
  },

  async tts(text, lang) {
    const url = "/tts/"

    try {
      return await api.post(
        url,
        {
          text: text,
          language: lang
        },
        {
          responseType: "arraybuffer"
        }
      )
    } catch (e) {
      console.error(e)
    }
  },

  /**
   *
   * @returns {Promise<{borderRadius: string, contact: {name: string, email: string}, primaryColor: string, logo: string, avatar: string, textColor: string}>}
   */
  async loadConfig(chatbotId) {
    const url = `/chatbot-config/${chatbotId}/`

    const response = await api.get(url)
    return response.data
  },

  /**
   *
   * @param conversationId
   * @param {('up'|'down')} action
   * @returns {Promise<*>}
   */
  async voteConversation(conversationId, action) {
    const url = `/thumb/${conversationId}/${action}/`

    try {
      const response = await api.post(url, {})
      return response.data
    } catch (e) {
      console.error(e)
    }
  }
}
