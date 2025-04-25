<script setup>
import { computed, ref } from "vue"
import { useI18n } from "@padcom/vue-i18n"
import questionIcon from "@/assets/icons/question.svg?component"
import thumbsUpOutlineIcon from "@/assets/icons/thumb-up-outline.svg?component"
import thumbsUpFilledIcon from "@/assets/icons/thumb-up-filled.svg?component"
import thumbsDownIconOutline from "@/assets/icons/thumb-down-outline.svg?component"
import thumbsDownIconFilled from "@/assets/icons/thumb-down-filled.svg?component"
import userIcon from "@/assets/icons/user.svg?component"
import IconHover from "@/components/Util/IconHover.vue"

const { t } = useI18n()

const emit = defineEmits([
  "relatedQuestionClicked",
  "contactSupportClicked",
  "ratePositive",
  "rateNegative"
])

const props = defineProps({
  data: {
    type: Object
  },
  showRatingActions: {
    type: Boolean
  },
  ratingDisabled: {
    type: Boolean,
    default: false
  }
})

const positiveActive = ref(false)
const negativeActive = ref(false)
const showContactAction = ref(false)
const positiveButtonHovered = ref(false)
const negativeButtonHovered = ref(false)

const hasMoreActions = computed(() => {
  return !!props.data?.related_questions
})

const isOfferHumanContact = computed(() => {
  return props.data?.offer_human_contact === true
})

const pressRelatedQuestion = (question, faqId = null) => {
  emit("relatedQuestionClicked", {
    question: question,
    faqId: faqId
  })
}

const ratePositive = () => {
  positiveActive.value = !positiveActive.value
  if (positiveActive.value) {
    negativeActive.value = false
    showContactAction.value = false
    emit("ratePositive")
  }
}

const rateNegative = () => {
  negativeActive.value = !negativeActive.value
  showContactAction.value = negativeActive.value
  if (negativeActive.value) {
    positiveActive.value = false
    emit("rateNegative")
  }
}

const contactSupport = () => {
  emit("contactSupportClicked")
}

const displayContactInfo = () => {
  showContactAction.value = true
}

const resetInputs = () => {
  positiveActive.value = false
  negativeActive.value = false
  showContactAction.value = false
}

defineExpose({ displayContactInfo, resetInputs })
</script>

<template>
  <div class="more-actions">
    <div v-if="hasMoreActions && props.showRatingActions">
      <span class="more-actions__title">{{ t("moreActions") }}</span>

      <div class="questions">
        <button
          class="question-btn"
          v-for="question in props.data.related_questions"
          :key="question"
          @click="pressRelatedQuestion(question)"
        >
          <questionIcon aria-hidden="true" />
          <span class="question-btn__text">{{ question }}</span>
        </button>

        <button
          class="question-btn"
          v-for="faq in props.data.faq_questions"
          :key="faq.id"
          @click="pressRelatedQuestion(faq.text, faq.id)"
        >
          <questionIcon aria-hidden="true" />
          <span>{{ faq.text }}</span>
        </button>
      </div>
    </div>

    <div class="rating-container" v-show="props.showRatingActions">
      <div class="chat-rating">
        <span class="chat-rating__label">{{ t("chatRating") }}</span>
        <button
          @click="ratePositive"
          class="chat-rating__action chat-rating__action--positive"
          @mouseenter="positiveButtonHovered = true"
          @mouseleave="positiveButtonHovered = false"
          :disabled="props.ratingDisabled"
        >
          <icon-hover
            v-if="!positiveActive"
            :icon="thumbsUpOutlineIcon"
            :icon-hover="thumbsUpFilledIcon"
            :hover-color="'#50ca88'"
            :default-color="'#50ca88'"
            :is-hovered="positiveButtonHovered"
            aria-hidden="true"
          ></icon-hover>
          <thumbsUpFilledIcon aria-hidden="true" color="#50ca88" v-else />
          <!--          </Transition>-->
          <span class="sr-only">
            {{ t("screenReader.ratePositiveAction") }}
          </span>
        </button>
        <button
          @click="rateNegative"
          class="default-btn chat-rating__action chat-rating__action--negative"
          :class="{ active: negativeActive }"
          @mouseenter="negativeButtonHovered = true"
          @mouseleave="negativeButtonHovered = false"
          :disabled="props.ratingDisabled"
        >
          <icon-hover
            v-if="!negativeActive"
            :icon="thumbsDownIconOutline"
            :icon-hover="thumbsDownIconFilled"
            :hover-color="'#f13e6b'"
            :default-color="'#f13e6b'"
            :is-hovered="negativeButtonHovered"
            aria-hidden="true"
          ></icon-hover>
          <thumbsDownIconFilled aria-hidden="true" color="#f13e6b" v-else />

          <span class="sr-only">
            {{ t("screenReader.rateNegativeAction") }}
          </span>
        </button>
      </div>

      <Transition>
        <div v-if="showContactAction || isOfferHumanContact" class="chat-contact">
          <button @click="contactSupport" class="contact__action">
            {{ t("contactSupport") }}
            <userIcon class="user-icon" aria-hidden="true" width="24px" />
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./ChatWindowMoreAction.scss";
</style>
