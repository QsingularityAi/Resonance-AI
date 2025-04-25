import { defineCustomElement } from "vue"

import HwChatbot from "@/HwChatbot.vue"
const HwChatbotCe = defineCustomElement(HwChatbot)

customElements.get("hw-chatbot") || customElements.define("hw-chatbot", HwChatbotCe)
