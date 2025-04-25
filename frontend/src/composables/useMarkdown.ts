import { marked } from "marked"
import { useI18n } from "@padcom/vue-i18n"

export function useMarkdown() {
  const { t } = useI18n()
  const renderer = new marked.Renderer()

  const linkRenderer = renderer.link
  renderer.link = (href, title, text) => {
    const html = linkRenderer.call(renderer, href, title, text)
    return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
  }

  const codeRenderer = renderer.code
  renderer.code = (text, lang) => {
    const html = codeRenderer.call(renderer, text, lang)
    return `<div style="position: relative;"> 
        ${html}
        <button
          type="button" 
          class="code-copy-btn"
          aria-label="${t("copySourceCodeAction")}"
          title="${t("copySourceCodeAction")}"
          onclick="(function (me) {
              const code = me.parentElement.getElementsByTagName('code')[0].textContent
              navigator.clipboard.writeText(code)
            })(this);"
        >
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIKICAgICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiCiAgICAgICAgICAgICAgIGNsYXNzPSJpY29uIGljb24tdGFibGVyIGljb25zLXRhYmxlci1vdXRsaW5lIGljb24tdGFibGVyLWNvcHkiPgogICAgICAgICAgICAgIDxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPgogICAgICAgICAgICAgIDxwYXRoIGQ9Ik03IDdtMCAyLjY2N2EyLjY2NyAyLjY2NyAwIDAgMSAyLjY2NyAtMi42NjdoOC42NjZhMi42NjcgMi42NjcgMCAwIDEgMi42NjcgMi42Njd2OC42NjZhMi42NjcgMi42NjcgMCAwIDEgLTIuNjY3IDIuNjY3aC04LjY2NmEyLjY2NyAyLjY2NyAwIDAgMSAtMi42NjcgLTIuNjY3eiIvPgogICAgICAgICAgICAgIDxwYXRoIGQ9Ik00LjAxMiAxNi43MzdhMi4wMDUgMi4wMDUgMCAwIDEgLTEuMDEyIC0xLjczN3YtMTBjMCAtMS4xIC45IC0yIDIgLTJoMTBjLjc1IDAgMS4xNTggLjM4NSAxLjUgMSIvPgogICAgICAgICAgPC9zdmc+" alt="${t("copySourceCodeActionIconAltText")}">
        </button>
      </div>
    `
  }

  function parseMarkdown(markdownString) {
    return marked(markdownString, { renderer })
  }

  return {
    renderer,
    parseMarkdown
  }
}
