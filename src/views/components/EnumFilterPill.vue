<template>
  <div class="filter-pill-wrapper">
    <b-dropdown
      :id="`enum-filter-pill-${fieldName}`"
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
        <b-form-group class="mb-2">
          <b-form-select
            :id="`enum-filter-pill-value-${fieldName}`"
            v-model="tmpValue"
            :options="selectOptions"
            size="sm"
          ></b-form-select>
        </b-form-group>
        <div class="d-flex justify-content-end">
          <b-button
            variant="primary"
            size="sm"
            @click="applyFilter"
            :disabled="!tmpValue"
            >{{ $t('message.apply') }}
          </b-button>
        </div>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: 'EnumFilterPill',
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
      validator: (value) => {
        if (!value || value.length === 0) {
          return false;
        }
        return true;
      },
    },
    value: {
      type: String,
      default: null,
    },
  },
  beforeDestroy() {
    this._destroying = true;
  },
  data() {
    return {
      tmpValue: null,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.tmpValue = val || null;
      },
    },
  },
  computed: {
    hasFilter() {
      return this.value !== null && this.value !== '';
    },
    displayValue() {
      if (!this.value) return '';
      const option = this.options.find(
        (opt) => (typeof opt === 'object' ? opt.value : opt) === this.value,
      );
      if (option && typeof option === 'object') {
        return option.text;
      }
      return this.value;
    },
    selectOptions() {
      return [
        {
          value: null,
          text: `-- ${this.$t('message.select')} --`,
          disabled: true,
        },
        ...this.options.map((opt) => {
          if (typeof opt === 'object') {
            return opt;
          }
          return { value: opt, text: opt };
        }),
      ];
    },
  },
  methods: {
    open() {
      this.$refs.dropdown.show();
    },
    onDropdownHide() {
      if (this.hasFilter) {
        this.tmpValue = this.value;
      } else {
        this.tmpValue = null;
        if (!this._destroying) {
          this.$emit('dismiss');
        }
      }
    },
    applyFilter() {
      if (!this.tmpValue) {
        return;
      }

      this.$emit('input', this.tmpValue);
      this.$refs.dropdown.hide();
    },
    clearFilter() {
      this.tmpValue = null;
      this.$refs.dropdown.hide();
      this.$emit('input', null);
    },
  },
};
</script>

<style scoped src="./filter-pill.css"></style>
