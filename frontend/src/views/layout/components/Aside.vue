<template>
  <div class="layout-cmp__aside app-sidebar">
    <div class="avatar">
      <router-link to="/">
        <app-avatar
          variant="sidebar"
          size="lg"
          :src="IMG_URL + userInfo.photo"
        />
      </router-link>
      <span class="app-sidebar__nickname">{{ userInfo.nickname }}</span>
    </div>

    <div class="app-sidebar__nav">
      <router-link to="/chat/add" tag="span" title="加好友">
        <span class="app-sidebar-icon-btn iconfont icon-icon-"></span>
      </router-link>
    </div>

    <div class="app-sidebar__footer operation">
      <oper-menu />
    </div>
  </div>
</template>

<script>
import operMenu from './operMenu'

export default {
  data() {
    return {
      IMG_URL: process.env.IMG_URL
    }
  },

  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },

  components: {
    operMenu
  }
}
</script>

<style lang="scss">
@import './../../../../static/iconfont/iconfont.css';

.layout-cmp__aside {
  .avatar {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
