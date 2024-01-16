<script setup lang="ts">
import { useTokenStore } from '@/stores/token'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref, watchEffect } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useBreakpoint } from 'vuestic-ui'

const router = useRouter()
const route = useRoute()

const breakpoints = useBreakpoint()
const isSidebarVisible = ref(breakpoints.smUp)
watchEffect(() => {
  isSidebarVisible.value = breakpoints.smUp
})
const menu = [
  { icon: 'info', title: 'Info', to: 'info' },
  { icon: 'link', title: 'Webhook', to: 'webhook' },
  { icon: 'message', title: 'Send Messages', to: 'sendmessage' }
]

const tokenStore = useTokenStore()
const { botInfo } = storeToRefs(tokenStore)
onBeforeMount(() => botInfo.value ?? router.push({ name: 'login' }))
</script>
<template>
  <VaLayout
    :top="{ fixed: true, order: 1 }"
    :left="{ fixed: true, absolute: breakpoints.smDown, order: 2, overlay: breakpoints.smDown && isSidebarVisible }"
    @left-overlay-click="isSidebarVisible = false"
  >
    <template #top>
      <VaNavbar class="h-12" style="padding: 0; padding-left: 10px">
        <template #left>
          <VaButton
            preset="secondary"
            :icon="isSidebarVisible ? 'menu_open' : 'menu'"
            @click="isSidebarVisible = !isSidebarVisible"
          />
          <div class="va-h4">{{ [botInfo?.first_name, botInfo?.last_name].join(' ') }}</div>
        </template>
        <template #right>
          <VaMenu
            class="mr-3"
            preset="secondary"
            close-on-content-click
            :options="['Logout']"
            @selected="$router.push({ name: 'login' })"
          >
            <template #anchor>
              <span class="va-h6">@{{ botInfo?.username }}</span>
            </template>
          </VaMenu>
        </template>
      </VaNavbar>
      <VaDivider style="margin: 0" />
    </template>

    <template #left>
      <VaSidebar v-model="isSidebarVisible">
        <VaSidebarItem v-for="{ icon, title, to } in menu" :key="icon" :to="{ name: to }" :active="route.name === to">
          <VaSidebarItemContent>
            <VaIcon :name="icon" />
            <VaSidebarItemTitle>
              {{ title }}
            </VaSidebarItemTitle>
          </VaSidebarItemContent>
        </VaSidebarItem>
      </VaSidebar>
    </template>

    <template #content>
      <div class="px-10 py-3">
        <RouterView />
      </div>
    </template>
  </VaLayout>
</template>
