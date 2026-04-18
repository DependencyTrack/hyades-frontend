<template>
  <filter-pill-dropdown
    ref="pill"
    :field-name="fieldName"
    :field-label="fieldLabel"
    :icon="icon"
    :has-filter="hasFilter"
    @hide="onDropdownHide"
    @clear="clearFilter"
    @dismiss="$emit('dismiss')"
  >
    <template #value>{{ displayValue }}</template>

    <b-form-group :label="$t('message.from')" label-size="sm" class="mb-2">
      <b-form-input
        :id="`numeric-range-filter-pill-from-${fieldName}`"
        v-model="tmpFrom"
        type="number"
        :min="min"
        :max="tmpTo || max"
        :step="step"
        :state="fromState"
        size="sm"
      ></b-form-input>
    </b-form-group>
    <b-form-group :label="$t('message.to')" label-size="sm" class="mb-2">
      <b-form-input
        :id="`numeric-range-filter-pill-to-${fieldName}`"
        v-model="tmpTo"
        type="number"
        :min="tmpFrom || min"
        :max="max"
        :step="step"
        :state="toState"
        size="sm"
      ></b-form-input>
    </b-form-group>
    <div class="d-flex justify-content-end">
      <b-button
        variant="primary"
        size="sm"
        @click="applyFilter"
        :disabled="
          (!tmpFrom && !tmpTo) || fromState === false || toState === false
        "
        >{{ $t('message.apply') }}
      </b-button>
    </div>
  </filter-pill-dropdown>
</template>

<script>
import FilterPillDropdown from '@/views/components/FilterPillDropdown.vue';

export default {
  name: 'NumericRangeFilterPill',
  components: { FilterPillDropdown },
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
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: null,
    },
    step: {
      type: Number,
      default: 0.1,
    },
    value: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      tmpFrom: '',
      tmpTo: '',
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          this.tmpFrom =
            val.from !== null && val.from !== undefined ? String(val.from) : '';
          this.tmpTo =
            val.to !== null && val.to !== undefined ? String(val.to) : '';
        } else {
          this.tmpFrom = '';
          this.tmpTo = '';
        }
      },
    },
  },
  computed: {
    hasFilter() {
      return this.value && (this.value.from !== null || this.value.to !== null);
    },
    displayValue() {
      if (!this.value) return '';
      const from = this.value.from;
      const to = this.value.to;
      if (from !== null && to !== null) {
        return `${from} – ${to}`;
      } else if (from !== null) {
        return `≥ ${from}`;
      } else if (to !== null) {
        return `≤ ${to}`;
      }
      return '';
    },
    fromState() {
      if (!this.tmpFrom) return null;
      const val = Number(this.tmpFrom);
      if (isNaN(val)) return false;
      if (this.min !== null && val < this.min) return false;
      if (this.max !== null && val > this.max) return false;
      if (this.tmpTo && !isNaN(Number(this.tmpTo)) && val > Number(this.tmpTo))
        return false;
      return true;
    },
    toState() {
      if (!this.tmpTo) return null;
      const val = Number(this.tmpTo);
      if (isNaN(val)) return false;
      if (this.min !== null && val < this.min) return false;
      if (this.max !== null && val > this.max) return false;
      if (
        this.tmpFrom &&
        !isNaN(Number(this.tmpFrom)) &&
        val < Number(this.tmpFrom)
      )
        return false;
      return true;
    },
  },
  methods: {
    open() {
      this.$refs.pill.open();
    },
    onDropdownHide() {
      if (this.hasFilter) {
        this.tmpFrom =
          this.value.from !== null && this.value.from !== undefined
            ? String(this.value.from)
            : '';
        this.tmpTo =
          this.value.to !== null && this.value.to !== undefined
            ? String(this.value.to)
            : '';
      } else {
        this.tmpFrom = '';
        this.tmpTo = '';
      }
    },
    applyFilter() {
      if (!this.tmpFrom && !this.tmpTo) return;
      if (this.fromState === false || this.toState === false) return;
      this.$emit('input', {
        from: this.tmpFrom ? Number(this.tmpFrom) : null,
        to: this.tmpTo ? Number(this.tmpTo) : null,
      });
      this.$refs.pill.hide();
    },
    clearFilter() {
      this.tmpFrom = '';
      this.tmpTo = '';
      this.$refs.pill.hide();
      this.$emit('input', null);
    },
  },
};
</script>
