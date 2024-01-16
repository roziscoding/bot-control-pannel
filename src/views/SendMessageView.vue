<script setup lang="ts">
import { computed, defineAsyncComponent, ref, type DefineComponent } from 'vue'

const chatId = ref('')
const validatedChatId = computed({
  get() {
    return chatId.value
  },
  set(v) {
    chatId.value = v.replace(/[^0-9-]/g, '')
  }
})

const MESSAGE_TYPES = [
  'text'
  // 'audio',
  // 'document',
  // 'photo',
  // 'sticker',
  // 'video',
  // 'video_note',
  // 'voice',
  // 'location',
  // 'contact',
  // 'dice',
  // 'game',
  // 'poll',
  // 'venue',
  // 'invoice',
  // 'successful_payment',
  // 'connected_website',
  // 'passport_data'
] as const

const componentsByMessageType = {
  text: defineAsyncComponent(() => import('./send-message/TextParams.vue'))
  // audio: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // document: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // photo: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // sticker: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // video: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // video_note: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // voice: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // location: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // contact: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // dice: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // game: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // poll: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // venue: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // invoice: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // successful_payment: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // connected_website: defineAsyncComponent(() => import('./send-message/TextParams.vue')),
  // passport_data: defineAsyncComponent(() => import('./send-message/TextParams.vue'))
} satisfies Record<(typeof MESSAGE_TYPES)[number], DefineComponent<{ chatId: string }, any, any>>

const messageType = ref<(typeof MESSAGE_TYPES)[number]>('text')
const paramsComponent = computed(() => componentsByMessageType[messageType.value])
const result = ref<any>({})
</script>
<template>
  <h1 class="va-h6">Send Message</h1>
  <div class="flex">
    <div class="flex flex-col w-1/2">
      <div class="flex items-end">
        <VaInput class="mr-2" label="Chat ID" type="text" v-model="validatedChatId" />
        <VaSelect
          class="mr-2"
          label="Message type"
          :options="[...MESSAGE_TYPES]"
          placeholder="Select one"
          v-model="messageType"
        />
      </div>
      <div class="send-message-params my-3">
        <component :chat-id="chatId" :is="paramsComponent" @result="(v) => (result = v)"></component>
      </div>
    </div>
    <div class="send-message-result w-1/2 pl-3">
      <h2 class="va-title text-blue-500 mb-3">Result</h2>
      <pre lang="json" class="bg-gray-900 p-3">{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>
