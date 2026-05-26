<template>
  <span
    class="app-logo"
    :class="[`app-logo--${size}`]"
    :aria-label="APP_NAME"
    role="img"
  >
    <svg
      class="app-logo__mark"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="gradId" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#66b1ff" />
          <stop offset="100%" stop-color="#409EFF" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" :fill="'url(#' + gradId + ')'" />
      <path
        d="M12 14h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-10l-5 4v-4h-1a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"
        fill="#fff"
        fill-opacity="0.95"
      />
      <circle cx="17" cy="20" r="1.5" fill="#409EFF" />
      <circle cx="22" cy="20" r="1.5" fill="#409EFF" />
      <circle cx="27" cy="20" r="1.5" fill="#409EFF" />
    </svg>
    <span v-if="showText" class="app-logo__text">{{ APP_NAME }}</span>
  </span>
</template>

<script>
import { APP_NAME } from '@/const'

export default {
  name: 'AppLogo',
  props: {
    size: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md', 'lg'].includes(v)
    },
    showText: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return { APP_NAME }
  },
  computed: {
    gradId() {
      return `app-logo-grad-${this._uid}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../static/css/var.scss';

.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  line-height: 1;

  &__mark {
    flex-shrink: 0;
    display: block;
  }

  &__text {
    font-weight: 700;
    letter-spacing: 0.02em;
    color: inherit;
    white-space: nowrap;
  }

  &--sm .app-logo__mark {
    width: 28px;
    height: 28px;
  }

  &--sm .app-logo__text {
    font-size: 16px;
  }

  &--md .app-logo__mark {
    width: 36px;
    height: 36px;
  }

  &--md .app-logo__text {
    font-size: 20px;
  }

  &--lg .app-logo__mark {
    width: 52px;
    height: 52px;
  }

  &--lg .app-logo__text {
    font-size: 28px;
  }
}
</style>
