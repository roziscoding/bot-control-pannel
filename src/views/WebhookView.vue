<script setup lang="ts">
import { useTokenStore } from '@/stores/token'
import { API_CONSTANTS } from 'grammy'
import { useTelegramApi } from 'grammy-vue'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, ref } from 'vue'
import { useForm } from 'vuestic-ui'

const tokenStore = useTokenStore()
const { token } = storeToRefs(tokenStore)
const { useApiMethod } = useTelegramApi(token)
const { data: webhookInfo, refresh: getWebhookInfo, state, error } = useApiMethod('getWebhookInfo')

const formatDate = (date?: number) =>
  date &&
  new Date(date * 1000).toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

const infoPanelItems = computed(() => [
  {
    icon: 'link',
    title: 'URL',
    value: state.value !== 'loading' ? webhookInfo.value?.url : 'Loading...'
  },
  {
    icon: 'approval',
    title: 'Has Custom Certificate',
    value: state.value !== 'loading' ? (webhookInfo.value?.has_custom_certificate ? 'Yes' : 'No') : 'Loading...'
  },
  {
    icon: 'pending_actions',
    title: 'Pending Update Count',
    value: state.value !== 'loading' ? webhookInfo.value?.pending_update_count : 'Loading...'
  },
  {
    icon: 'sync_alt',
    title: 'Allowed Updates',
    value: state.value !== 'loading' ? webhookInfo.value?.allowed_updates?.join(', ') : 'Loading...'
  },
  {
    icon: 'event_busy',
    title: 'Last Error Date',
    value: state.value !== 'loading' ? formatDate(webhookInfo.value?.last_error_date) : 'Loading...'
  },
  {
    icon: 'error',
    title: 'Last Error Message',
    value: state.value !== 'loading' ? webhookInfo.value?.last_error_message : 'Loading...'
  }
])

onBeforeMount(() => {
  getWebhookInfo()
})

const newWebhookUrl = ref('')
const newWebhookSecret = ref('')
const newWebhookAllowedUpdates = ref([...(webhookInfo.value?.allowed_updates ?? API_CONSTANTS.DEFAULT_UPDATE_TYPES)])

const RULES = {
  required: (val: unknown) => !!val || 'Required',
  https: (val: string) => val.startsWith('https://') || 'Must be an HTTPS URL',
  minOne: (val: Array<unknown>) => val.length > 0 || 'Must select at least one'
}

const { isValid, validate, resetValidation } = useForm('formRef')
const { refresh: setWebhook, state: setWebhookState, error: setWebhookError } = useApiMethod('setWebhook', 10000)
const {
  refresh: deleteWebhook,
  state: deleteWebhookState,
  error: deleteWebhookError
} = useApiMethod('deleteWebhook', 1000)

const isSomethingLoading = computed(
  () => state.value === 'loading' || setWebhookState.value === 'loading' || deleteWebhookState.value === 'loading'
)

const callSetWebhook = async () => {
  validate()
  if (!isValid.value) return

  await setWebhook(newWebhookUrl.value, {
    secret_token: newWebhookSecret.value,
    allowed_updates: newWebhookAllowedUpdates.value
  })

  resetValidation()
  await getWebhookInfo()
}

const callDeleteWebhook = async () => {
  await deleteWebhook()
  await getWebhookInfo()
  resetValidation()
}
</script>
<template>
  <VaCard outlined :disabled="isSomethingLoading">
    <VaCardTitle>Webhook Info</VaCardTitle>
    <VaCardContent>
      <div class="text-center mt-2 mx-4 flex flex-col items-center" color="primary" v-if="!webhookInfo?.url">
        <span class="va-h6">Webhook not set</span>
        <VaButton preset="secondary" @click="getWebhookInfo" :loading="state === 'loading'">Reload</VaButton>
      </div>
      <VaList v-if="webhookInfo?.url">
        <VaListItem class="mb-2" v-for="{ icon, title, value } in infoPanelItems" :id="title">
          <VaListItemSection icon>
            <VaIcon :name="icon" />
          </VaListItemSection>
          <VaListItemSection>
            <VaListItemLabel>
              <div class="text-white">{{ title }}</div>
            </VaListItemLabel>
            <VaListItemLabel caption :lines="2">
              <div class="text-lg">{{ value ?? 'Loading...' }}</div>
            </VaListItemLabel>
          </VaListItemSection>
        </VaListItem>
      </VaList>
    </VaCardContent>
    <VaCardActions align="right" v-if="webhookInfo?.url">
      <VaButton preset="secondary" :loading="state === 'loading'" @click="getWebhookInfo">Reload</VaButton>
    </VaCardActions>
  </VaCard>
  <VaCard outlined class="mt-3" :disabled="isSomethingLoading">
    <VaCardTitle>Webhook Settings</VaCardTitle>
    <VaAlert
      icon="error"
      class="mt-2 mx-4"
      v-if="setWebhookState === 'error' || deleteWebhookState === 'error'"
      color="danger"
    >
      {{ (setWebhookError ?? deleteWebhookError)?.message }}
    </VaAlert>
    <VaCardContent>
      <VaForm ref="formRef">
        <VaInput
          v-model="newWebhookUrl"
          label="Webhook URL"
          class="w-1/2 pr-2"
          messages="Must be an HTTPs URL"
          :rules="[RULES.required, RULES.https]"
        ></VaInput>
        <VaInput
          v-model="newWebhookSecret"
          label="Webhook Secret"
          class="w-1/2"
          messages="Optional"
          type="password"
        ></VaInput>
        <div class="mt-2">
          <span class="va-input-label" style="color: var(--va-primary)">Allowed Updates</span>
          <VaOptionList
            v-model="newWebhookAllowedUpdates"
            :options="[...API_CONSTANTS.ALL_UPDATE_TYPES]"
            :rules="[RULES.required, RULES.minOne]"
          />
          <VaButton
            preset="secondary"
            class="mr-1"
            @click="newWebhookAllowedUpdates = [...API_CONSTANTS.ALL_UPDATE_TYPES]"
          >
            All
          </VaButton>
          <VaButton
            preset="secondary"
            class="mr-1"
            @click="newWebhookAllowedUpdates = [...API_CONSTANTS.DEFAULT_UPDATE_TYPES]"
          >
            Default
          </VaButton>
          <VaButton preset="secondary" class="mr-1" @click="newWebhookAllowedUpdates = []">None</VaButton>
        </div>
      </VaForm>
      <VaCardActions align="right">
        <VaButton
          preset="secondary"
          :loading="setWebhookState === 'loading'"
          @click="callSetWebhook"
          :disabled="!isValid"
        >
          Set Webhook
        </VaButton>
        <VaButton
          preset="secondary"
          color="danger"
          :loading="deleteWebhookState === 'loading'"
          @click="callDeleteWebhook"
        >
          Delete Webhook
        </VaButton>
      </VaCardActions>
    </VaCardContent>
  </VaCard>
</template>
