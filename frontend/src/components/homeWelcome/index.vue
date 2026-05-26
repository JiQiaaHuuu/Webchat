<template>
  <div class="home-welcome hor-ver-center">
    <div class="home-welcome__card">
      <div class="home-welcome__glow" aria-hidden="true" />
      <app-logo size="lg" :show-text="false" class="home-welcome__logo" />
      <h2 class="home-welcome__title">{{ APP_NAME }}</h2>
      <p class="home-welcome__tagline">{{ APP_TAGLINE }}</p>
      <p class="home-welcome__hint">{{ APP_HOME_HINT }}</p>
      <ul class="home-welcome__features" aria-hidden="true">
        <li><i class="el-icon-chat-dot-round" /> 文字与文件</li>
        <li><i class="el-icon-video-camera" /> 音视频通话</li>
        <li><i class="el-icon-user" /> 好友与群聊</li>
      </ul>
    </div>
  </div>
</template>

<script>
import AppLogo from '@/components/appLogo'
import { APP_NAME, APP_TAGLINE, APP_HOME_HINT } from '@/const'

export default {
  name: 'HomeWelcome',
  components: { AppLogo },
  data() {
    return {
      APP_NAME,
      APP_TAGLINE,
      APP_HOME_HINT
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../static/css/var.scss';

.home-welcome {
  width: 100%;
  height: 100%;
  min-height: 320px;
  padding: 24px;
  box-sizing: border-box;

  &__card {
    position: relative;
    max-width: 420px;
    padding: 48px 40px 40px;
    text-align: center;
    border-radius: 20px;
    background: linear-gradient(165deg, #ffffff 0%, $seatbg 100%);
    border: 1px solid $border2;
    box-shadow: 0 12px 40px rgba($primarycolor-rgb, 0.12);
    overflow: hidden;
  }

  &__glow {
    position: absolute;
    top: -60px;
    left: 50%;
    width: 200px;
    height: 200px;
    margin-left: -100px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba($primarycolor-rgb, 0.25) 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  &__logo {
    position: relative;
    margin-bottom: 16px;
  }

  &__title {
    position: relative;
    margin: 0 0 8px;
    font-size: 26px;
    font-weight: 700;
    color: $primaryfont;
    letter-spacing: 0.04em;
  }

  &__tagline {
    position: relative;
    margin: 0 0 12px;
    font-size: 15px;
    color: $primarycolor;
    font-weight: 500;
  }

  &__hint {
    position: relative;
    margin: 0 0 28px;
    font-size: 14px;
    line-height: 1.6;
    color: $secondaryfont;
  }

  &__features {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px 20px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 13px;
    color: $normalfont;

    li {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba($primarycolor-rgb, 0.08);

      i {
        color: $primarycolor;
        font-size: 16px;
      }
    }
  }
}
</style>
