import { MSG_TYPES } from '@/const'
import messageVideo from './video'
// 白板消息展示（非功能入口，用于历史记录渲染）
import messageArtBoard from './artBoard'
import messageAudio from './audio'
import messageFile from './file'
import messageSys from './sys'
import messageText from './text'
import messageImg from './img'

export default {
  messageVideo,
  messageArtBoard,
  messageAudio,
  messageFile,
  messageSys,
  messageText,
  messageImg
}

export const messageTypesCmp = {
  [MSG_TYPES.text+'cmp']: messageText,
  [MSG_TYPES.img+'cmp']: messageImg,
  [MSG_TYPES.sys+'cmp']: messageSys,
  [MSG_TYPES.file+'cmp']: messageFile,
  [MSG_TYPES.artBoard+'cmp']: messageArtBoard,
  [MSG_TYPES.video+'cmp']: messageVideo,
  [MSG_TYPES.audio+'cmp']: messageAudio,
}

export const mixins = {
  props: {
    message: {
      type: Object
    }
  }
}
