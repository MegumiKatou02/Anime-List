import { ref } from 'vue'
import { defaultSettings } from './constants'

const savedSettings = JSON.parse(localStorage.getItem('setting') || JSON.stringify(defaultSettings))
const isDarkTheme = savedSettings.theme == '0' ? true : false

export const isDarkMode = ref(isDarkTheme)
