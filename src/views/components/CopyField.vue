<template>
  <div
    class="copy-row"
    v-b-tooltip.hover
    :title="$t('message.copy_to_clipboard')"
    @click="copyToClipboard"
    style=""
  >
    <div
      class="prepend"
      :style="labelWidth ? { width: labelWidth } : undefined"
    >
      {{ label }}
    </div>
    <div class="text-area">{{ value }}</div>
    <div class="append">
      <span class="h-100">
        <i class="fa fa-clipboard" aria-hidden="true"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: String, required: true },
    label: { type: String, default: 'label' },
    labelWidth: { type: String, default: null },
  },
  methods: {
    copyToClipboard() {
      if (!this.value) return;
      navigator.clipboard
        .writeText(this.value)
        .then(() => this.$toastr.s(this.$t('message.copy_success')))
        .catch(() => this.$toastr.e(this.$t('message.copy_failed')));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.copy-row {
  display: flex;
  align-items: stretch;
  cursor: pointer;
  // margin-bottom: 1rem;
  transition: background 0.2s;

  &:hover {
    background: $grey-800;
  }

  > div {
    display: flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    height: 100%;
    border: 1px solid black;
    border-radius: 0.25rem;
  }

  .prepend,
  .append {
    background-color: $grey-750;
  }

  .prepend {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .append {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .text-area {
    flex-grow: 1;
    font-family: 'Courier New', Courier, monospace;
    border-radius: 0;
    user-select: all;
    overflow-wrap: anywhere;
  }

  .text-area:empty::before {
    content: '\00a0';
    display: inline-block;
  }
}
</style>
