<template>
  <b-button :pressed="value" :variant="variant" @click="$emit('input', !value)">
    <i :class="iconClass"></i> {{ label }}
  </b-button>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    variant: String,
    label: String,
  },
  computed: {
    iconClass() {
      return this.value ? 'fa fa-chevron-up' : 'fa fa-chevron-down';
    },
  },
};
</script>
