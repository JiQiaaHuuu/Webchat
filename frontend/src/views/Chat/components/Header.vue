<template>
  <div class="chat-area__header app-chat-header">
    <transition name="roll">
      <div class="header-wrapper" v-if="currentConversation.roomId">
        <div class="header-title app-chat-header__title">
          <i
            v-if="device === 'Mobile'"
            class="el-icon-arrow-left back-icon app-chat-icon-btn"
            @click="setCurrentUI"
          ></i>

          <span>{{ headerTitle }}</span>
        </div>

        <div class="header-operation app-chat-header__actions">
          <!-- 私聊操作 -->
          <span v-if="!currentConversation.isGroup">

            <!-- 白板协作入口（已关闭，保留便于恢复） -->
            <!--
            <el-tooltip
              class="item"
              effect="dark"
              content="白板协作需要良好的网络环境"
              placement="top"
            >
              <i
                v-if="device !== 'Mobile'"
                class="operation-item app-chat-icon-btn iconfont icon-huaban"
                @click="enterArtBoard"
              ></i>
            </el-tooltip>
            -->

            <el-tooltip
              class="item"
              effect="dark"
              content="视频通话需要良好的网络环境"
              placement="top"
            >
              <i
                class="operation-item app-chat-icon-btn iconfont icon-shipin"
                @click="videoCall"
              ></i>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="语音通话需要良好的网络环境"
              placement="top"
            >
              <i
                class="operation-item app-chat-icon-btn el-icon-phone-outline"
                @click="audioCall"
              ></i>
            </el-tooltip>
          </span>

          <i
            class="operation-item app-chat-icon-btn el-icon-menu"
            title="设置"
            @click.stop="toggleShowSettingPanel"
          ></i>
        </div>
      </div>
    </transition>

    <transition name="roll">
      <div
        class="setting-panel app-chat-dropdown-panel"
        v-if="showSettingPanel"
        @click.stop
      >
        <setting-panel
          :current-conversation="currentConversation"
          @setCurrentConversation="setCurrentConversation"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import './../../../../static/iconfont/iconfont.css'
import settingPanel from './settingPanel'
import { WEB_RTC_MSG_TYPE } from '@/const'
import { mapState } from 'vuex'

export default {
  props: {
    currentConversation: Object,
    setCurrentConversation: Function
  },

  data() {
    return {
      showSettingPanel: false
    }
  },

  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },

    beiZhu() {
      return this.userInfo.friendBeiZhu || {}
    },

    headerTitle() {
      const c = this.currentConversation

      if (!c.roomId) return ''

      if (c.isGroup) {
        return `${c.groupInfo.title}（${c.groupInfo.userNum}）`
      }

      const remark = this.beiZhu[c.id]

      return remark
        ? `${remark}（${c.nickname}）`
        : c.nickname
    },

    ...mapState('app', {
      // 白板状态（入口已关闭）
      // isToCoArtBoard: 'isToCoArtBoard',
      isVideoing: 'isVideoing',
      isAudioing: 'isAudioing'
    }),

    device() {
      return this.$store.state.device.deviceType
    }
  },

  methods: {
    // 白板协作（入口已关闭）
    // enterArtBoard() {
    //   if (this.isToCoArtBoard || this.isVideoing || this.isAudioing) return
    //   this.$eventBus.$emit('web_rtc_msg', {
    //     type: WEB_RTC_MSG_TYPE.artBoard
    //   })
    // },

    videoCall() {
      if (this.isVideoing || this.isAudioing) return

      this.$store.dispatch('app/SET_IS_VIDEOING', true)

      this.$eventBus.$emit('web_rtc_msg', {
        type: WEB_RTC_MSG_TYPE.video
      })
    },

    audioCall() {
      if (this.isVideoing || this.isAudioing) return

      this.$store.dispatch('app/SET_IS_AUDIOING', true)

      this.$eventBus.$emit('web_rtc_msg', {
        type: WEB_RTC_MSG_TYPE.audio
      })
    },

    toggleShowSettingPanel() {
      this.showSettingPanel = !this.showSettingPanel
    },

    watchDocumentClick() {
      if (!this.showSettingPanel) return

      this.showSettingPanel = false
    },

    setCurrentUI() {
      this.$store.dispatch(
        'device/SET_CURRENT_UI',
        'conversation'
      )
    }
  },

  watch: {
    currentConversation: {
      handler() {
        this.showSettingPanel = false
      },
      immediate: true,
      deep: true
    }
  },

  components: {
    settingPanel
  },

  mounted() {
    document.addEventListener(
      'click',
      this.watchDocumentClick
    )
  },

  beforeDestroy() {
    document.removeEventListener(
      'click',
      this.watchDocumentClick
    )
  }
}
</script>

<style lang="scss">
@import './../../../../static/css/var.scss';

.chat-area__header {
  .header-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-title .back-icon {
    margin-right: 12px;
  }

  .setting-panel {
    position: absolute;
    top: 100%;
    right: 0;
    width: 320px;
    max-width: 90vw;
    height: 461px;
    z-index: 1005;
  }

  .iconfont::before {
    font-size: inherit;
  }

  .roll-enter {
    opacity: 0;
    transform: translateY(12px);
  }

  .roll-leave-to {
    opacity: 0;
    transform: translateY(-12px);
  }

  .roll-enter-active,
  .roll-leave-active {
    transition: all .25s ease;
  }
}

@media screen and (max-width: 768px) {
  .chat-area__header {
    padding: 0 15px;

    .header-title {
      font-size: 15px;
    }


    .setting-panel {
      width: 280px;
      right: 10px;
    }
  }
}
</style>