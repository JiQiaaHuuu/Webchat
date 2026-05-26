<template>
  <el-button
    class="app-btn"
    :class="{ 'app-btn--block': block }"
    :type="elType"
    :size="elSize"
    :plain="plain"
    :round="round"
    :icon="icon"
    :loading="loading"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </el-button>
</template>

<script>
import { BUTTON_SIZE } from '@/const'

const VARIANT_TYPE = {
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  text: 'text',
  default: ''
}

export default {
  name: 'AppButton',
  inheritAttrs: false,
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: (value) =>
        ['primary', 'default', 'success', 'danger', 'warning', 'info', 'text'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    elType() {
      return VARIANT_TYPE[this.variant]
    },
    elSize() {
      return BUTTON_SIZE[this.size] || BUTTON_SIZE.md
    }
  }
}
</script>
