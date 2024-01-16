<script setup lang="ts">
import { useTokenStore } from '@/stores/token'
import { useTelegramApi } from 'grammy-vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const tokenStore = useTokenStore()
const router = useRouter()

const { token, botInfo } = storeToRefs(tokenStore)
const { useApiMethod } = useTelegramApi(token)
const { data, error, state, refresh: getMe } = useApiMethod('getMe')

const message = computed(() => (state.value === 'success' ? 'Bot info loaded' : 'Obtained from @BotFather'))
const errorMessage = computed(() => String(error.value))
const buttonColor = computed(() => {
  const colorByStatus: Record<(typeof state)['value'], string> = {
    error: 'danger',
    loading: 'primary',
    success: 'success',
    idle: 'primary'
  }

  return colorByStatus[state.value]
})

async function loadBotinfo() {
  await getMe()
  if (state.value === 'success') {
    botInfo.value = data.value
    router.push({ name: 'info' })
  }
}

function reset() {
  tokenStore.reset()
  state.value = 'idle'
}
</script>
<template>
  <VaLayout class="h-dvh">
    <template #content>
      <div class="row justify-center items-center h-full">
        <VaCard :disabled="state === 'loading'" class="w-1/2" outlined>
          <VaCardContent class="flex flex-col items-center align-center w-full">
            <VaInput
              autofocus
              clearable
              label="Bot Token"
              id="username"
              v-model="token"
              :messages="message"
              :error-messages="[errorMessage]"
              :error="state === 'error'"
              :dirty="state === 'error'"
              :success="state === 'success'"
              @clear="reset"
              class="w-full"
              type="password"
            />
            <VaButton
              :color="buttonColor"
              :loading="state === 'loading'"
              :success="Boolean(message) && Boolean(token) && Boolean(data)"
              @click="loadBotinfo"
              class="ml-2 mb-1 self-end"
            >
              Load Bot Info
            </VaButton>
          </VaCardContent>
        </VaCard>
      </div>
    </template>
  </VaLayout>
</template>
