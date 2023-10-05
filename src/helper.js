import { VOICE_LINE, VOICE_LINE_DURATION } from './config.js'

function getReplyMessage(message) {
  if (!message) return 'no'

  return VOICE_LINE[message]
}


function getReplyDuration(message) {
  if (!message) return 'no'

  return VOICE_LINE_DURATION[message]
}

export { getReplyMessage, getReplyDuration }