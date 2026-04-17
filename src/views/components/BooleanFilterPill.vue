<template>
  <div class="filter-pill-wrapper">
    <span class="boolean-filter-pill">
      <span v-if="icon" :class="['fa', icon, 'mr-1']" aria-hidden="true"></span>
      {{ fieldLabel }}
      <b-button
        class="btn-filter-pill-clear"
        size="sm"
        :title="$t('message.clear')"
        :aria-label="$t('message.clear') + ' ' + fieldLabel"
        @click="clearFilter"
      >
        <span class="fa fa-times-circle" aria-hidden="true"></span>
      </b-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'BooleanFilterPill',
  props: {
    fieldLabel: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: null,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clearFilter() {
      this.$emit('input', false);
    },
  },
};
</script>

<style scoped src="./filter-pill.css"></style>
