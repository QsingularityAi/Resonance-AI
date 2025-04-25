class HwChatbotToggle extends HTMLElement {
  constructor() {
    super()

    this.loadChatbotEvent = new Event("loadChatbot")
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" })

    const mainButton = document.createElement("button")
    mainButton.setAttribute("class", "cb")
    mainButton.innerHTML = `
        Chat Assistent
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1"/></svg>
      `
    mainButton.addEventListener("pointerdown", (e) => {
      if (e instanceof MouseEvent && e.button !== 0) {
        return
      }
      this.dispatchEvent(this.loadChatbotEvent)
    })

    const deMessage = document.createElement("p")
    deMessage.setAttribute("class", "ct de a")
    deMessage.innerText = this.getAttribute("text-de")

    const enMessage = document.createElement("p")
    enMessage.setAttribute("class", "ct en")
    enMessage.innerText = this.getAttribute("text-en")

    const closeMessageButton = document.createElement("button")
    closeMessageButton.setAttribute("class", "cl")
    closeMessageButton.innerText = "×"
    closeMessageButton.addEventListener("pointerdown", () => {
      messageWrapper.classList.remove("a")
      mainButton.classList.remove("o")
      sessionStorage.setItem("hwToggleMessageClosed", true)
    })

    const messageWrapper = document.createElement("div")
    messageWrapper.setAttribute("class", "tm")
    messageWrapper.appendChild(deMessage)
    messageWrapper.appendChild(enMessage)
    messageWrapper.appendChild(closeMessageButton)

    const wrapper = document.createElement("span")
    wrapper.setAttribute("class", "toggle-btn-wrapper")
    wrapper.appendChild(mainButton)
    wrapper.appendChild(messageWrapper)

    const style = document.createElement("style")

    style.textContent = `
  .toggle-btn-wrapper{position:fixed;right:32px;bottom:32px;z-index:9999}
  .cb{background:var(--background-color, #0f1c2e);font-size:1.125rem;padding:12px 16px;color:#fff;border:none;border-radius:24px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.2);display:flex;align-items:center;gap:16px;white-space:nowrap;transition:border-radius .2s}
  .cb.o{border-radius:4px 24px 24px 24px}
  .tm{position:absolute;background:#fff;color:#000;width:312px;box-shadow:rgba(129,129,129,.35) 0 0 8px;right:0;bottom:calc(100% + 16px);border-radius:24px 24px 24px 4px;white-space:normal;text-align:left;padding:12px 16px;display:none;grid-template-columns:auto auto;align-items:flex-start}
  .tm.a{display:grid}
  .cl{width:40px;height:40px;border-radius:50%;background:none;border:none;font-size:18px;font-weight:600;cursor:pointer}
  .ct{display:none}.ct.a{display:block}
`

    // binding methods
    this.toggleMessage = this.toggleMessage.bind(this)

    shadow.appendChild(style)
    shadow.appendChild(wrapper)

    !sessionStorage.getItem("hwToggleMessageClosed") && setTimeout(this.toggleMessage, 3000)
  }

  toggleMessage() {
    const messageWrapper = this.shadowRoot.querySelector(".tm")
    const mainButton = this.shadowRoot.querySelector(".cb")
    const deMessage = this.shadowRoot.querySelector(".de")
    const enMessage = this.shadowRoot.querySelector(".en")

    messageWrapper.classList.add("a")
    mainButton.classList.add("o")
    setTimeout(() => deMessage.classList.remove("a") || enMessage.classList.add("a"), 6250)
    setTimeout(
      () => messageWrapper.classList.remove("a") || mainButton.classList.remove("o"),
      12500
    )
  }
}

customElements.define("hw-chatbot-toggle", HwChatbotToggle)
