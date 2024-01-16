<script setup lang="ts">
import { useTokenStore } from '@/stores/token'
import { storeToRefs } from 'pinia'

const tokenStore = useTokenStore()

const { botInfo } = storeToRefs(tokenStore)

const infoPanelItems = [
  {
    icon: 'fingerprint',
    title: 'ID',
    value: botInfo.value?.id
  },
  {
    icon: 'badge',
    title: 'Name',
    value: [botInfo.value?.first_name, botInfo.value?.last_name].join(' ')
  },
  {
    icon: 'alternate_email',
    title: 'Username',
    value: botInfo.value?.username
  }
]
</script>
<template>
  <VaCard outlined>
    <VaCardTitle>Basic Bot info</VaCardTitle>
    <VaCardContent>
      <VaList>
        <template v-for="{ icon, title, value } in infoPanelItems" :id="title">
          <VaListItem class="mb-2">
            <VaListItemSection icon>
              <VaIcon :name="icon" />
            </VaListItemSection>
            <VaListItemSection>
              <VaListItemLabel>
                <div class="text-white">{{ title }}</div>
              </VaListItemLabel>
              <VaListItemLabel caption>
                <div class="text-lg">{{ value }}</div>
              </VaListItemLabel>
            </VaListItemSection>
          </VaListItem>
        </template>
        <VaListItem>
          <VaListItemSection icon>
            <VaIcon name="check_circle" />
          </VaListItemSection>
          <VaListItemSection>
            <VaListItemLabel>
              <div class="text-white">Enabled Features</div>
            </VaListItemLabel>
            <VaListItemLabel caption>
              <div class="mt-2 flex flex-col gap-2">
                <VaCheckbox readonly label="Can Join Groups" v-model="botInfo!.can_join_groups" />
                <VaCheckbox
                  readonly
                  label="Can Read All Group Messages"
                  v-model="botInfo!.can_read_all_group_messages"
                />
                <VaCheckbox readonly label="Supports Inline Queries" v-model="botInfo!.can_join_groups" />
              </div>
            </VaListItemLabel>
          </VaListItemSection>
        </VaListItem>
      </VaList>
    </VaCardContent>
  </VaCard>
</template>
