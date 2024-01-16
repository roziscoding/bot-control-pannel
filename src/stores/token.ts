import type { UserFromGetMe } from 'grammy/types'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useTokenStore = defineStore('token', () => {
  const token = ref(localStorage.getItem('token') ?? '')
  const botInfo = ref<UserFromGetMe>()

  watch(token, (newToken) => {
    if (newToken) return localStorage.setItem('token', newToken)
    localStorage.removeItem('token')
  })

  const reset = () => {
    token.value = ''
    botInfo.value = undefined
  }

  return { token, botInfo, reset }
})
