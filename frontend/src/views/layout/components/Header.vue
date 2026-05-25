<template>
  <div class="layout-header__com">
    <el-header>
      <div class="logo">
        <router-link to="/" class="logo-link">
          Co-Messager
          <span class="logo-img"></span>
        </router-link>
      </div>

      <div class="operation">
        <span class="item">
          <router-link to="/add" tag="span">
            加好友 <i class="el-icon-plus"></i>
          </router-link>
        </span>

        <span class="item">
          <router-link to="/mzone" tag="span">
            发动态 <i class="el-icon-plus"></i>
          </router-link>
        </span>
      </div>

      <div class="user-info">
        <el-dropdown class="droplist">
          <span class="el-dropdown-link">
            <el-badge :is-dot="validateUnReadCount > 0" class="badge-item">
              <el-avatar
                size="large"
                class="avatar"
                :src="IMG_URL + userInfo.photo"
                @error="() => true">

                <img
                  src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                  alt="">
              </el-avatar>
            </el-badge>
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="user-menu-item">
              <router-link to="/setting" class="link">
                个人设置
              </router-link>
            </el-dropdown-item>

            <el-dropdown-item class="user-menu-item">
              <el-badge
                :value="validateUnReadCount"
                :hidden="validateUnReadCount === 0">

                <router-link to="/system" class="link">
                  系统消息
                </router-link>
              </el-badge>
            </el-dropdown-item>

            <el-dropdown-item class="user-menu-item">
              <router-link to="/setting" class="link">
                主题设置
              </router-link>
            </el-dropdown-item>

            <el-dropdown-item class="user-menu-item">
              <router-link to="/setting" class="link">
                反馈
              </router-link>
            </el-dropdown-item>

            <el-dropdown-item class="user-menu-item">
              <a class="link" @click="logout">
                退出
              </a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <div class="name-sigin">
          <span class="name">{{ userInfo.nickname }}</span>
          <span class="sigin">{{ userInfo.signature }}</span>
        </div>
      </div>
    </el-header>

    <!-- F：按文档要求移除白板功能 -->
    <!--
    <transition name="fade">
      <vue-draggable-resizable
        v-if="isToCoArtBoard"
        drag-cancel=".drawingarea">
        <div class="co-art-board">
          <co-art-board
            :currentconversation="currentConversation"
            :state="webRTCState"
            :web-rtc-type="WEB_RTC_MSG_TYPE.artBoard"/>
        </div>
      </vue-draggable-resizable>
    </transition>
    -->

    <!-- F：保留视频/语音通话 -->
    <transition name="fade">
      <vue-draggable-resizable
        v-if="isVideoing || isAudioing"
        :x="0"
        :y="500"
        drag-cancel=".drawingarea">

        <div class="co-art-board box-shadow1">
          <co-video
            :currentconversation="currentConversation"
            :state="webRTCState"
            :web-rtc-type="coVideoWebRtcType"/>
        </div>
      </vue-draggable-resizable>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import vueDraggableResizable from 'vue-draggable-resizable'

/* F：删除白板组件 */
// import CoArtBoard from '@/views/CoArtBoard'

import CoVideo from '@/views/CoVideo'

/* F：删除白板常量 */
// import { coArtBoardReplyTypes, WEB_RTC_MSG_TYPE } from '@/const'

import { WEB_RTC_MSG_TYPE } from '@/const'
import { removeCookie } from '@/utils/token'

const WEB_RTC_MSG_TYPE_TEXT = {
  video: '视频通话',
  audio: '语音通话'
}

let timer

export default {
  data() {
    return {
      webRTCState: 'apply',
      IMG_URL: process.env.IMG_URL,
      WEB_RTC_MSG_TYPE
    }
  },

  computed: {
    ...mapState('user', {
      userInfo: 'userInfo'
    }),

    ...mapState('news', {
      unreadNews: 'unreadNews'
    }),

    validateUnReadCount() {
      const validateSysUser =
        (this.$store.state.app.sysUsers || [])
          .find(item => item.code === '111111')

      const key =
        (validateSysUser || {}).sid + '-' +
        (this.userInfo || {}).uid

      return this.unreadNews[key]
    },

    ...mapState('app', {
      /* F：删除白板状态 */
      // isToCoArtBoard: 'isToCoArtBoard',

      isVideoing: 'isVideoing',
      isAudioing: 'isAudioing',
      currentConversation: 'currentConversation'
    }),

    coVideoWebRtcType() {
      let res = null

      if (this.isVideoing) {
        res = WEB_RTC_MSG_TYPE.video
      } else if (this.isAudioing) {
        res = WEB_RTC_MSG_TYPE.audio
      }

      return res
    }
  },

  methods: {
    logout() {
      this.$router.replace('/login')
      this.$socket.emit('leave')
      removeCookie()
    },

    webRtcMsgWatch(newVal) {
      if (newVal) {
        timer = setTimeout(() => {
          this.$alert(
            '对方没有答应，请先等待一段时间再尝试',
            '提示',
            {
              confirmButtonText: '确定',
              type: 'warning',
              callback: () => {
                /* 成员F：删除白板状态恢复 */
                // this.$store.dispatch('app/SET_ISTOCOARTBOARD', false)

                this.$store.dispatch(
                  'app/SET_IS_AUDIOING',
                  false
                )

                this.$store.dispatch(
                  'app/SET_IS_VIDEOING',
                  false
                )
              }
            }
          )
        }, 120000)
      }
    }
  },

  components: {
    /* F：删除白板组件注册 */
    // CoArtBoard,

    CoVideo,
    vueDraggableResizable
  },

  sockets: {
    apply(data) {
      const webRtcType = data.webRtcType

      /* F：移除白板判断 */
      if (this.isVideoing || this.isAudioing) {
        return
      }

      let text = ''

      if (webRtcType === WEB_RTC_MSG_TYPE.audio) {
        text = '语音通话'
      } else if (webRtcType === WEB_RTC_MSG_TYPE.video) {
        text = '视频通话'
      }

      this.$confirm(
        `您的好友${data.myNickname}请求与你进行${text}, 是否同意?`,
        '提示',
        {
          confirmButtonText: '同意',
          cancelButtonText: '拒绝',
          type: 'warning'
        }
      )
        .then(() => {
          this.webRTCState = 'reply'

          this.$store.dispatch(
            'app/SET_CURRENT_CONVERSATION',
            data
          )

          if (webRtcType === WEB_RTC_MSG_TYPE.audio) {
            this.$store.dispatch(
              'app/SET_IS_AUDIOING',
              true
            )
          } else if (
            webRtcType === WEB_RTC_MSG_TYPE.video
          ) {
            this.$store.dispatch(
              'app/SET_IS_VIDEOING',
              true
            )
          }
        })
        .catch(() => {})
    }
  }
}
</script>