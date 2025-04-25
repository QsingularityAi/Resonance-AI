# Usage

```html
...
<script 
  type="module"
  src="path/to/chatbot.js"
  data-chatbot-id="<INSERT CHATBOT ID HERE>"
  data-fullscreen="<INSERT true or false>"
  data-toggle-text-de="<INSERT GERMAN INFO TEXT HERE>"
  data-toggle-text-en="<INSERT ENGLISH INFO TEXT HERE>"
  data-api-url="<INSERT API URL HERE>"
  data-element-id="INSERT ID OF HTML ELEMENT"
  async
  defer
></script>
...
```

## Alternative usage
```html
<script type="module">
  import {init} from "/path/to/chatbot.js"

  init(
    "cd2ed281-42ac-4a70-9b55-4c778f922938",
    "http://backend-hw-chatbot.localhost/api/",
    "Hello, I'm your AI assistant. I am available for questions about club life.",
    "Hallo, ich bin dein KI-Assistent. Für Fragen des Vereinslebens stehe ich zur Verfügung.",
    false,
  )
</script>
```

## Usage in Vue

```vue
<script lang="ts" setup>
const props = defineProps<{
  chatbotId: string;
  src: string;
  apiUrl: string;
  textDe: string;
  textEn: string;
  elementId?: string;
  fullscreen?: boolean;
}>();

onMounted(async () => {
  try {
    const {
      init,
    }: {
      init: (
        chatbotId: string,
        apiUrl: string,
        textEn: string,
        textDE: string,
        fullscreen: boolean,
      ) => void;
    } = await import(props.src);

    init(
      props.chatbotId,
      props.apiUrl,
      props.textEn,
      props.textDe,
      props.fullscreen,
    );
  } catch (e) {
    console.error(e);
  }
});

onBeforeUnmount(() => {
  const chatbots = document.getElementsByTagName("hw-chatbot");
  const toggleBtns = document.getElementsByTagName("hw-chatbot-toggle");

  [...chatbots].map((i) => i.remove());
  [...toggleBtns].map((i) => i.remove());
});
</script>

<template></template>

```

## Usage inline

DON'T use with `fullscreen`

```html
<body>
...

<div class="container ">
  ...
  
  <!-- limit height (minimal setup)  -->
  <div style="height: 500px;" id="chatbot-element"></div>
  
  ...
</div>

...

<script
  type="module"
  src="..."
  data-toggle-text-de="..."
  data-toggle-text-en="..."
  data-chatbot-id="..."
  data-api-url="..."
  data-element-id="chatbot-element"
><script>
</body>

```

# Customization

| Attribute      | Description                                                                                                                                                                                                                                                            | 
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| chatbot-id     | Id of chatbot. Needed to fetch chatbot configuration. Replace `<INSERT CHATBOT ID HERE>` placeholder                                                                                                                                                                   |
| fullscreen     | If true, chatbot will be attached to end of document body and will be displayed full width and height. Else chatbot will be displayed fixed in a smaller window at the bottom right corner. Replace `<INSERT true or false>` with true or false                        | 
| toggle-text-de | German information text that is displayed after a time above the chat button. Not needed if fullscreen is set. Replace `<INSERT GERMAN INFO TEXT HERE>` placeholder. eg: Hallo, ich bin dein KI-Assistent. F\xfcr Fragen des Vereinslebens stehe ich zur Verf\xfcgung. | 
| toggle-text-en | German information text that is displayed after a time above the chat button. Not needed if fullscreen is set. Replace `<INSERT ENGLISH INFO TEXT HERE>` placeholder. eg: Hello, I'm your AI assistant. I am available for questions about club life.                  |
| api-url        | Url to chatbot api. Replace `<INSERT API URL HERE>` placeholder.                                                                                                                                                                                                       |
| element-id     | Id of an html element on the page. Chatbot is hooked into this element                                                                                                                                                         |

### Styling the Toggle Button
```css
hw-chatbot-toggle {
    --background-color: tomato;
}
```
