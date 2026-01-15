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
            {{ fieldLabel }}
            <span class="fa fa-filter"></span>
          </span>
          <span v-else>
            {{ fieldLabel }} <em>=</em>&nbsp;<code>{{ displayValue }}</code>
          </span>

          <b-button
            class="btn-filter-pill-clear"
            v-if="hasFilter"
            size="sm"
            :title="$t('message.clear')"
            @click.stop="clearFilter"
          >
            <span class="fa fa-remove"></span>
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
        { value: null, text: '-- Select --', disabled: true },
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
    onDropdownHide() {
      if (!this.hasFilter) {
        this.tmpValue = null;
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
      this.$emit('input', null);
    },
  },
};
</script>

<style scoped>
.filter-pill-wrapper {
  display: inline-block;
}

.filter-pill-wrapper >>> .btn-outline-primary {
  border-radius: 20px;
}

.filter-pill-form {
  min-width: 280px;
}

.btn-filter-pill-clear {
  line-height: 1;
  border: none !important;
  padding: 2px !important;
  margin-left: 8px !important;
  border-radius: 50%;
}

.btn-filter-pill-clear:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.btn-filter-pill-clear:focus {
  box-shadow: none !important;
}
</style>
