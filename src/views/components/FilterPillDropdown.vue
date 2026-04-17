<template>
  <div :class="['filter-pill-wrapper', { 'filter-pill-active': hasFilter }]">
    <b-dropdown
      :id="`filter-pill-${fieldName}`"
      class="filter-pill"
      ref="dropdown"
      size="sm"
      variant="outline-primary"
      no-caret
      boundary="viewport"
      @show="$emit('show', $event)"
      @hide="onDropdownHide"
    >
      <template #button-content>
        <div class="d-flex align-items-center" v-if="!hasFilter">
          <span
            v-if="icon"
            :class="['fa', icon, 'mr-1']"
            aria-hidden="true"
          ></span>
          {{ fieldLabel }}
        </div>
        <div class="filter-pill-segments" v-else>
          <span class="filter-pill-segment filter-pill-segment-field">
            <span
              v-if="icon"
              :class="['fa', icon, 'mr-1']"
              aria-hidden="true"
            ></span>
            {{ fieldLabel }}
          </span>
          <span class="filter-pill-segment filter-pill-segment-value">
            <slot name="value"></slot>
          </span>
        </div>
      </template>
      <b-dropdown-form class="filter-pill-form pt-2 pb-2" @submit.stop.prevent>
        <slot></slot>
      </b-dropdown-form>
    </b-dropdown>
    <button
      v-if="hasFilter"
      class="filter-pill-clear"
      type="button"
      :title="$t('message.clear')"
      :aria-label="$t('message.clear') + ' ' + fieldLabel"
      @click="$emit('clear')"
    >
      <span class="fa fa-times-circle" aria-hidden="true"></span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'FilterPillDropdown',
  props: {
    fieldName: {
      type: String,
      required: true,
    },
    fieldLabel: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: null,
    },
    hasFilter: {
      type: Boolean,
      required: true,
    },
  },
  beforeDestroy() {
    this._destroying = true;
  },
  methods: {
    open() {
      this.$refs.dropdown.show();
    },
    hide() {
      this.$refs.dropdown.hide();
    },
    onDropdownHide() {
      if (!this.hasFilter && !this._destroying) {
        this.$emit('dismiss');
      }
      this.$emit('hide');
    },
  },
};
</script>

<style scoped src="./filter-pill.css"></style>
