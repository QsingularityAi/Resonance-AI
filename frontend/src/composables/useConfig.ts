import { ref, toValue, watchEffect } from "vue"
import chatService from "@/services/chatService"

export function useConfig(chatbotId) {
  const config = ref()

  watchEffect(() => {
    config.value = null

    chatService
      .loadConfig(toValue(chatbotId))
      .then((response) => {
        config.value = response
      })
      .catch((err) => {
        console.error({ err })
      })
  })

  return {
    config
  }
}
