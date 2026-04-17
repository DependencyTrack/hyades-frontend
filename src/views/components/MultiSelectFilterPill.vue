<template>
  <div class="filter-pill-wrapper">
    <b-dropdown
      :id="`multi-select-filter-pill-${fieldName}`"
      class="filter-pill"
      ref="dropdown"
      size="sm"
      variant="outline-primary"
      no-caret
      boundary="viewport"
      @hide="onDropdownHide"
    >
      <template #button-content>
        <div class="d-flex align-items-center">
          <span v-if="!hasFilter">
            <span
              v-if="icon"
              :class="['fa', icon, 'mr-1']"
              aria-hidden="true"
            ></span>
            {{ fieldLabel }}
          </span>
          <span v-else>
            <span
              v-if="icon"
              :class="['fa', icon, 'mr-1']"
              aria-hidden="true"
            ></span>
            {{ fieldLabel }} <em>=</em>&nbsp;<strong
              class="filter-pill-value"
              >{{ displayValue }}</strong
            >
          </span>

          <b-button
            class="btn-filter-pill-clear"
            v-if="hasFilter"
            size="sm"
            :title="$t('message.clear')"
            :aria-label="$t('message.clear') + ' ' + fieldLabel"
            @click.stop="clearFilter"
          >
            <span class="fa fa-times-circle" aria-hidden="true"></span>
          </b-button>
        </div>
      </template>
      <b-dropdown-form class="filter-pill-form pt-2 pb-2" @submit.stop.prevent>
        <div class="mb-2 d-flex justify-content-between">
          <b-link size="sm" @click="selectAll">{{
            $t('message.select_all')
          }}</b-link>
          <b-link size="sm" @click="deselectAll">{{
            $t('message.clear_all')
          }}</b-link>
        </div>
        <b-form-checkbox-group
          v-model="tmpValue"
          :options="options"
          stacked
          class="mb-2"
        ></b-form-checkbox-group>
        <div class="d-flex justify-content-end">
          <b-button
            variant="primary"
            size="sm"
            @click="applyFilter"
            :disabled="tmpValue.length === 0"
            >{{ $t('message.apply') }}
          </b-button>
        </div>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: 'MultiSelectFilterPill',
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
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  beforeDestroy() {
    this._destroying = true;
  },
  data() {
    return {
      tmpValue: [],
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.tmpValue = val && val.length > 0 ? [...val] : [];
      },
    },
  },
  computed: {
    hasFilter() {
      return this.value && this.value.length > 0;
    },
    displayValue() {
      if (!this.value || this.value.length === 0) return '';
      return this.value
        .map((v) => {
          const option = this.options.find(
            (opt) => (typeof opt === 'object' ? opt.value : opt) === v,
          );
          return option && typeof option === 'object' ? option.text : v;
        })
        .join(', ');
    },
  },
  methods: {
    selectAll() {
      this.tmpValue = this.options.map((opt) =>
        typeof opt === 'object' ? opt.value : opt,
      );
    },
    deselectAll() {
      this.tmpValue = [];
    },
    open() {
      this.$refs.dropdown.show();
    },
    onDropdownHide() {
      if (this.hasFilter) {
        this.tmpValue = [...this.value];
      } else {
        this.tmpValue = [];
        if (!this._destroying) {
          this.$emit('dismiss');
        }
      }
    },
    applyFilter() {
      if (this.tmpValue.length === 0) {
        return;
      }
      this.$emit('input', [...this.tmpValue]);
      this.$refs.dropdown.hide();
    },
    clearFilter() {
      this.tmpValue = [];
      this.$refs.dropdown.hide();
      this.$emit('input', null);
    },
  },
};
</script>

<style scoped src="./filter-pill.css"></style>
