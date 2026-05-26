<template>
  <el-avatar
    class="app-avatar"
    :class="variantClass"
    shape="square"
    :size="resolvedSize"
    :src="displaySrc"
    v-bind="$attrs"
    v-on="$listeners"
    @error="handleError"
  >
    <slot>
      <img :src="fallbackSrc" alt="">
    </slot>
  </el-avatar>
</template>

<script>
import { AVATAR_FALLBACK, AVATAR_SIZE } from '@/const'

export default {
  name: 'AppAvatar',
  inheritAttrs: false,
  props: {
    src: {
      type: String,
      default: ''
    },
    size: {
      type: [String, Number],
      default: 'md'
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'sidebar', 'pick'].includes(value)
    }
  },
  data() {
    return {
      errored: false,
      fallbackSrc: AVATAR_FALLBACK
    }
  },
  computed: {
    resolvedSize() {
      if (typeof this.size === 'number') {
        return this.size
      }
      return AVATAR_SIZE[this.size] || AVATAR_SIZE.md
    },
    displaySrc() {
      return this.errored ? undefined : (this.src || undefined)
    },
    variantClass() {
      if (this.variant === 'default') {
        return ''
      }
      return `app-avatar--${this.variant}`
    }
  },
  watch: {
    src() {
      this.errored = false
    }
  },
  methods: {
    handleError() {
      this.errored = true
      return true
    }
  }
}
</script>
