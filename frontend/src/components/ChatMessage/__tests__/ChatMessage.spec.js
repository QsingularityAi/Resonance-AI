import { describe, it, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import ChatMessage from "../ChatMessage.vue"

// Mock components and assets to avoid import errors
vi.mock("@/assets/icons/avatar_fallback.svg?component", () => ({
  default: {
    render: () => {}
  }
}))
vi.mock("@/assets/icons/clipboard.svg?component", () => ({
  default: {
    render: () => {}
  }
}))
vi.mock("@/assets/icons/player-pause.svg?component", () => ({
  default: {
    render: () => {}
  }
}))
vi.mock("@/assets/icons/player-pause-filled.svg?component", () => ({
  default: {
    render: () => {}
  }
}))
vi.mock("@/assets/icons/volume.svg?component", () => ({
  default: {
    render: () => {}
  }
}))
vi.mock("@/assets/icons/refresh.svg?component", () => ({
  default: {
    render: () => {}
  }
}))
vi.mock("@/assets/speech-bubble-tail.svg?component", () => ({
  default: {
    render: () => {}
  }
}))
vi.mock("@/components/ChatMessageSource/ChatMessageSource.vue", () => ({
  default: {
    props: ["name", "sourceType", "source", "index", "primaryColor"],
    template: "<div></div>"
  }
}))
vi.mock("@/components/Util/ThreeDotLoadingIndicator.vue", () => ({
  default: {
    props: ["isLoading"],
    template: "<div></div>"
  }
}))
vi.mock("@/services/chatService.js", () => ({
  default: {}
}))
vi.mock("@/components/Util/LoadingIndicator.vue", () => ({
  default: {
    props: ["size"],
    template: "<div></div>"
  }
}))
vi.mock("@/components/ChatMessageImage/ChatMessageImage.vue", () => ({
  default: {
    props: ["src", "imageTitle", "imageDescription", "source"],
    template: "<div></div>"
  }
}))
vi.mock("@/components/Util/IconHover.vue", () => ({
  default: {
    props: ["icon", "iconHover", "hoverColor", "defaultColor", "isHovered"],
    template: "<div></div>"
  }
}))
vi.mock("@/components/ChatMessageRenderer/ChatMessageRenderer.vue", () => ({
  default: {
    props: ["markdown", "typingSpeed"],
    template: "<div></div>"
  }
}))
vi.mock("@/components/ChatMessageWarning/ChatMessageWarning.vue", () => ({
  default: {
    props: ["text"],
    template: "<div></div>"
  }
}))
vi.mock("@/components/ChatMessageAudio/ChatMessageAudio.vue", () => ({
  default: {
    props: ["audioUrl", "audioBlob", "primaryColor"],
    template: "<div></div>"
  }
}))
vi.mock("@padcom/vue-i18n", () => ({
  useI18n: () => ({ t: (key) => key, locale: { value: "en" } })
}))

describe("ChatMessage.vue", () => {
  describe("uniqueSources computed property", () => {
    it("should sort page numbers numerically", async () => {
      // Create a message with sources that have page numbers
      const message = {
        role: "assistant",
        content: "Test message",
        sources: [
          { name: "Document1", page: "2", type: "pdf" },
          { name: "Document1", page: "10", type: "pdf" },
          { name: "Document1", page: "1", type: "pdf" },
          { name: "Document2", page: "5", type: "pdf" },
          { name: "Document2", page: "3", type: "pdf" }
        ]
      }

      // Mount the component with the necessary props
      const wrapper = mount(ChatMessage, {
        props: {
          message: message,
          config: {
            primaryColor: "#000000",
            textColor: "#ffffff",
            assistantName: "Test Assistant"
          }
        },
        global: {
          stubs: {
            ChatMessageSource: true,
            ThreeDotLoadingIndicator: true,
            LoadingIndicator: true,
            ChatMessageImage: true,
            IconHover: true,
            ChatMessageRenderer: true,
            ChatMessageWarning: true,
            ChatMessageAudio: true
          }
        }
      })

      // Access the component instance to check the computed property
      const vm = wrapper.vm

      // Verify the uniqueSources computed property
      expect(vm.uniqueSources).toHaveLength(2)

      // Verify Document1 has pages sorted numerically [1, 2, 10] not lexicographically [1, 10, 2]
      const doc1 = vm.uniqueSources.find((source) => source.name === "Document1")
      expect(doc1.pages).toEqual(["1", "2", "10"])

      // Verify Document2 has pages sorted numerically [3, 5]
      const doc2 = vm.uniqueSources.find((source) => source.name === "Document2")
      expect(doc2.pages).toEqual(["3", "5"])
    })

    it("should handle mixed numeric and non-numeric page values", async () => {
      // Create a message with sources that have mixed page values
      const message = {
        role: "assistant",
        content: "Test message",
        sources: [
          { name: "Document3", page: "a", type: "pdf" },
          { name: "Document3", page: "2", type: "pdf" },
          { name: "Document3", page: "10", type: "pdf" }
        ]
      }

      // Mount the component with the necessary props
      const wrapper = mount(ChatMessage, {
        props: {
          message: message,
          config: {
            primaryColor: "#000000",
            textColor: "#ffffff",
            assistantName: "Test Assistant"
          }
        },
        global: {
          stubs: {
            ChatMessageSource: true,
            ThreeDotLoadingIndicator: true,
            LoadingIndicator: true,
            ChatMessageImage: true,
            IconHover: true,
            ChatMessageRenderer: true,
            ChatMessageWarning: true,
            ChatMessageAudio: true
          }
        }
      })

      // Access the component instance to check the computed property
      const vm = wrapper.vm

      // Verify the document has pages sorted (note: the default String.sort() would give ['10', '2', 'a'])
      const doc3 = vm.uniqueSources.find((source) => source.name === "Document3")

      // Should be sorted in some manner, exact order depends on implementation
      // We mainly want to ensure '2' comes before '10' to confirm numerical sorting
      expect(doc3.pages.indexOf("2")).toBeLessThan(doc3.pages.indexOf("10"))
    })
  })
})
