<template>
  <div class="chat-area__com">
    <chat-header
      :currentConversation="currentConversation"
      :set-current-conversation="setCurrentConversation"
    />

    <!-- 历史记录 -->
    <transition name="slide-up">
      <div
        class="history-msg-container"
        v-if="showHistoryMsg"
      >
        <history-msg
          :current-conversation="currentConversation"
        />
      </div>
    </transition>

    <!-- 主区域 -->
    <div
      :class="
        currentConversation.conversationType !== 'GROUP'
          ? 'main no-group'
          : 'main'
      "
    >
      <!-- 消息 -->
      <div class="message-list-container">
        <message-list
          ref="messagelist"
          @load-message="loadmessage"
          :messagelist="messagesOutcome"
          :scrollbottom="scrollBottom"
          :hasmore="hasMore"
          :isloading="isLoading"
          :useanimation="useAnimation"
          :currentConversation="currentConversation"
          :last-enter-time="lastEnterTime"
          :set-last-enter-time="setLastEnterTime"
        />
      </div>

      <!-- 群信息 -->
      <div
        class="group-desc"
        v-if="
          device !== 'Mobile' &&
          currentConversation.conversationType === 'GROUP'
        "
      >
        <group-desc
          :currentConversation="currentConversation"
          :key="datetamp"
        />
      </div>
    </div>

    <!-- 编辑区 -->
    <div class="message-edit-container">
      <div class="tool">

        <!-- emoji -->
        <span class="tool-item">
          <i
            class="item iconfont icon-emoji"
            @click.stop="
              showEmojiCom = !showEmojiCom
            "
          ></i>
        </span>

        <!-- 图片 -->
        <span class="tool-item">
          <label for="upImg">
            <i class="item el-icon-picture">
              <input
                id="upImg"
                class="img-inp"
                type="file"
                title="选择图片"
                accept="image/png,image/jpeg,image/gif,image/jpg"
                @change="uploadImg"
              />
            </i>
          </label>
        </span>

        <!-- 文件 -->
        <span class="tool-item">
          <i
            class="item el-icon-folder"
            @click.stop="
              showUpFileCom =
                !showUpFileCom
            "
          />

          <transition name="fade">
            <up-file
              :visible="showUpFileCom"
              v-watchMouse="showUpFileCom"
              class="upFileComponent"
              @handleSuccess="
                uploadFileSuccess
              "
              @getStatus="
                getUploadResult
              "
              @getLocalUrl="
                getLocalUrl
              "
              :get-status="
                getUploadResult
              "
              :get-local-url="
                getLocalUrl
              "
            />
          </transition>
        </span>

        <!-- ======================== -->
        <!-- 原白板按钮：保留注释 -->
        <!--
        <span class="tool-item">
          <i class="item iconfont icon-huaban"/>
        </span>
        -->
        <!-- ======================== -->

        <!-- 原视频按钮 -->
        <!--
        <span class="tool-item">
          <i class="item iconfont icon-shipin"/>
        </span>
        -->

        <!-- 原语音按钮 -->
        <!--
        <span class="tool-item">
          <i class="item el-icon-phone-outline"/>
        </span>
        -->

        <!-- 历史记录 -->
        <span
          class="tool-item history-btn"
          :class="
            showHistoryMsg
              ? 'el-icon-caret-bottom'
              : 'el-icon-caret-top'
          "
          @click="setShowHistoryMsg"
        >
          历史记录
        </span>
      </div>

      <!-- 操作 -->
      <div class="operation">
        <el-button
          @click="send"
          type="success"
          size="small"
          round
        >
          发送
        </el-button>

        <el-button
          @click="clean"
          type="danger"
          size="small"
          round
        >
          清空
        </el-button>
      </div>

      <!-- 输入框 -->
      <textarea
        ref="chatInp"
        class="textarea"
        v-model="messageText"
        maxlength="200"
        @input="scrollBottom = true"
        @keydown.enter="send($event)"
      ></textarea>

      <!-- emoji -->
      <transition name="fade">
        <custom-emoji
          v-if="showEmojiCom"
          class="emoji-component"
          @addemoji="addEmoji"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { cloneDeep } from "lodash"

import chatHeader from "./components/Header"
import messageList from "./components/MessageList"

import {
  SET_UNREAD_NEWS_TYPE_MAP
} from "@/store/constants"

import {
  conversationTypes,
  uploadStatusMap
} from "@/const"

import customEmoji from "@/components/customEmoji"
import upFile from "@/components/customUploadFile"
import groupDesc from "./components/GroupDesc"
import historyMsg from "./components/HistoryMsg"

import xss from "@/utils/xss"
import {
  genGuid,
  fromatTime
} from "@/utils"

export default {
  props: {
    currentConversation: Object,
    setLoading: Function,
    setCurrentConversation: Function
  },

  data() {
    return {
      messageText: "",
      messages: [],

      showEmojiCom: false,
      showUpFileCom: false,

      pageIndex: 0,
      pageSize: 15,
      hasMore: true,

      showTopOperation: false,
      scrollBottom: true,
      isLoading: false,
      useAnimation: false,

      lastEnterTime: Date.now(),

      showHistoryMsg: false,

      datetamp: Date.now()
    }
  },

  computed: {
    ...mapState("user", {
      userInfo: "userInfo"
    }),

    messagesOutcome() {
      return this.messages.filter(
        item =>
          item.roomId ===
          this.currentConversation.roomId
      )
    },

    device() {
      return this.$store.state.device.deviceType
    }
  }
}
</script>

<style lang="scss">
@import './../../../static/css/var.scss';

.chat-area__com {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $primarybg;
}

.main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.no-group {
  .message-list-container {
    width: 100%;
  }
}

.message-list-container {
  flex: 1;
  overflow: hidden;
}

.group-desc {
  width: 280px;
  border-left: 1px solid $border3;
  background: $primarybg;
}

.message-edit-container {
  position: relative;
  padding: 12px 16px;
  border-top: 1px solid $border3;
  background: $primarybg;
}

.tool {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.tool-item {
  display: inline-flex;
  align-items: center;
  margin-right: 14px;
  cursor: pointer;
}

.item {
  font-size: 20px;
  color: $normalfont;
  transition: .2s;
}

.item:hover {
  color: $primarycolor;
}

.history-btn {
  margin-left: auto;
  font-size: 14px;
  color: $normalfont;
  cursor: pointer;
}

.history-btn:hover {
  color: $primarycolor;
}

.operation {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.textarea {
  width: 100%;
  min-height: 110px;
  resize: none;
  padding: 10px 12px;
  border: 1px solid $border1;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  line-height: 1.6;
}

.textarea:focus {
  border-color: $primarycolor;
}

.img-inp {
  display: none;
}

.emoji-component {
  position: absolute;
  left: 12px;
  bottom: 170px;
  z-index: 1002;
}

.upFileComponent {
  position: absolute;
  left: 70px;
  bottom: 170px;
  z-index: 1002;
}

.history-msg-container {
  position: absolute;
  right: 0;
  top: 60px;
  width: 360px;
  height: calc(100% - 60px);
  background: $primarybg;
  border-left: 1px solid $border3;
  z-index: 1001;
}

.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all .25s ease;
}

.slide-up-enter,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media screen and (max-width: 768px) {
  .group-desc {
    display: none;
  }

  .history-msg-container {
    width: 100%;
  }

  .message-edit-container {
    padding: 10px;
  }

  .textarea {
    min-height: 90px;
  }
}
</style>