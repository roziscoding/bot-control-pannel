<script setup lang="ts">
import { useTokenStore } from '@/stores/token'
import { useTelegramApi } from 'grammy-vue'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

const emit = defineEmits(['result'])

const PARSE_MODES = ['None', 'Markdown', 'HTML'] as const

const tokenStore = useTokenStore()
const { token } = storeToRefs(tokenStore)

const { useApiMethod } = useTelegramApi(token)
const { data, error, refresh: sendMessage, state } = useApiMethod('sendMessage')

const props = defineProps<{ chatId: string }>()

/** General options */
const messageText = ref('')
const parseMode = ref<(typeof PARSE_MODES)[number]>('None')
const disableNotification = ref(false)
const messageThreadId = ref<number>()
const validatedMThreadId = computed({
  get() {
    return messageThreadId.value?.toString() ?? ''
  },
  set(v: string) {
    if (!v) return (messageThreadId.value = undefined)
    const parsed = parseInt(v)
    if (!isNaN(parsed)) messageThreadId.value = parsed
  }
})

/** Link preview options */
const disableLinkPreview = ref(false)
const preferLargeMedia = ref(false)
const preferSmallMedia = ref(false)
const showAboveText = ref(false)
const linkPreviewUrl = ref('')

watch(preferLargeMedia, (v) => {
  if (v) preferSmallMedia.value = false
})
watch(preferSmallMedia, (v) => {
  if (v) preferLargeMedia.value = false
})

/* Reply options */
const replyMessageId = ref<number>()
const validatedRMessageId = computed({
  get() {
    return replyMessageId.value?.toString() ?? ''
  },
  set(v: string) {
    if (!v) return (replyMessageId.value = undefined)
    const parsed = parseInt(v)
    if (!isNaN(parsed)) replyMessageId.value = parsed
  }
})
const allowSendingWithoutReply = ref(false)
const replyChatId = ref<number>()
const validatedRChatId = computed({
  get() {
    return replyChatId.value?.toString() ?? ''
  },
  set(v: string) {
    if (!v) return (replyChatId.value = undefined)
    const parsed = parseInt(v)
    if (!isNaN(parsed)) replyChatId.value = parsed
  }
})

/** Methods */
const callSendMessage = async () => {
  await sendMessage(props.chatId, messageText.value, {
    parse_mode: parseMode.value === 'None' ? undefined : parseMode.value,
    disable_notification: disableNotification.value,
    link_preview_options: {
      is_disabled: disableLinkPreview.value,
      prefer_large_media: preferLargeMedia.value,
      prefer_small_media: preferSmallMedia.value,
      show_above_text: showAboveText.value,
      url: linkPreviewUrl.value
    },
    message_thread_id: messageThreadId.value,
    reply_parameters: replyMessageId.value
      ? {
          message_id: replyMessageId.value,
          allow_sending_without_reply: allowSendingWithoutReply.value,
          chat_id: replyChatId.value
        }
      : undefined
  })

  emit('result', state.value === 'success' ? data.value : error.value)
}
</script>
<template>
  <div class="flex flex-col gap-3">
    <div class="row items-end gap-3">
      <VaTextarea label="Message text" type="text" v-model="messageText"></VaTextarea>
      <VaSelect label="Parse mode" v-model="parseMode" :options="[...PARSE_MODES]" />
      <VaInput clearable label="Message thread ID" v-model="validatedMThreadId" />
      <VaCheckbox label="Disable notification" v-model="disableNotification" />
    </div>
    <div>
      <VaDivider />
      <div class="va-title text-blue-500">Link preview options</div>
      <VaCheckbox class="mt-3" label="Disable link preview" v-model="disableLinkPreview" />
      <div class="row mt-2 gap-3 items-end">
        <VaInput :disabled="disableLinkPreview" label="URL" type="text" v-model="linkPreviewUrl" />
        <VaCheckbox :disabled="disableLinkPreview" label="Prefer large media" v-model="preferLargeMedia" />
        <VaCheckbox :disabled="disableLinkPreview" label="Prefer small media" v-model="preferSmallMedia" />
        <VaCheckbox :disabled="disableLinkPreview" label="Show above text" v-model="showAboveText" />
      </div>
    </div>
    <div>
      <VaDivider />
      <div class="va-title text-blue-500">Reply options</div>
      <div class="row mt-3 gap-3 items-end">
        <VaInput clearable label="Message ID" type="text" v-model="validatedRMessageId" />
        <VaInput clearable :disabled="!replyMessageId" label="Chat ID" type="text" v-model="validatedRChatId" />
        <VaCheckbox
          :disabled="!replyMessageId"
          label="Allow sending without reply"
          v-model="allowSendingWithoutReply"
        />
      </div>
    </div>
    <div class="row self-end gap-3">
      <VaButton :loading="state === 'loading'" @click="callSendMessage">Send</VaButton>
    </div>
  </div>
</template>
