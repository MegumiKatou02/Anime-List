import { ref } from 'vue'

const savedSettings = JSON.parse(localStorage.getItem('setting') || `{"lang":"0","theme":"0"}`)
const isDarkTheme = savedSettings.theme == '0' ? true : false

export const isDarkMode = ref(isDarkTheme)
