import { VOICE_LINE } from './config.js'

function messageSwitcher(message) {
  if (!message) return 'no'

  return VOICE_LINE[message]
}

export { messageSwitcher }