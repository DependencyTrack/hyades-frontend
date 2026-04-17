<template>
  <filter-pill-dropdown
    ref="pill"
    :field-name="fieldName"
    :field-label="fieldLabel"
    :icon="icon"
    :has-filter="hasFilter"
    @show="onDropdownShow"
    @hide="onDropdownHide"
    @clear="clearFilter"
    @dismiss="$emit('dismiss')"
  >
    <template #value>{{ operatorAbbrev }} "{{ value.value }}"</template>

    <b-input-group class="mb-2">
      <b-input-group-prepend>
        <b-form-select
          :id="`text-filter-pill-operator-${fieldName}`"
          v-model="tmpOperator"
          :options="operators"
          :disabled="operators.length < 2"
          size="sm"
        ></b-form-select>
      </b-input-group-prepend>
      <b-form-input
        :id="`text-filter-pill-value-${fieldName}`"
        ref="valueInput"
        v-model="tmpValue"
        :maxlength="maxLength"
        size="sm"
        @keyup.enter="applyFilter"
      ></b-form-input>
    </b-input-group>
    <div class="d-flex justify-content-end">
      <b-button
        variant="primary"
        size="sm"
        @click="applyFilter"
        :disabled="!tmpValue"
        >{{ $t('message.apply') }}
      </b-button>
    </div>
  </filter-pill-dropdown>
</template>

<script>
import FilterPillDropdown from '@/views/components/FilterPillDropdown.vue';

const supportedOperators = [
  {
    name: 'equals',
    symbol: '=',
  },
  {
    name: 'contains',
    symbol: '~',
  },
  {
    name: 'starts_with',
    symbol: '^',
  },
];

export default {
  name: 'TextFilterPill',
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
    operators: {
      type: Array,
      validator: (value) => {
        if (!value) {
          return false;
        }

        for (const operator of value) {
          if (!supportedOperators.find((op) => op.name === operator)) {
            console.error(`Unknown operator ${operator}`);
            return false;
          }
        }

        return true;
      },
      default: () => supportedOperators.map((op) => op.name),
    },
    maxLength: {
      type: Number,
      default: 255,
    },
    value: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      tmpOperator: this.operators[0],
      tmpValue: '',
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val && val.operator && val.value) {
          this.tmpOperator = val.operator;
          this.tmpValue = val.value;
        } else {
          this.tmpOperator = this.operators[0];
          this.tmpValue = '';
        }
      },
    },
  },
  computed: {
    hasFilter() {
      return this.value && this.value.operator && this.value.value;
    },
    operatorAbbrev() {
      return supportedOperators.find((op) => op.name === this.tmpOperator)
        .symbol;
    },
  },
  methods: {
    onDropdownShow() {
      this.$nextTick(() => {
        if (this.$refs.valueInput) {
          this.$refs.valueInput.focus();
        }
      });
    },
    open() {
      this.$refs.pill.open();
    },
    onDropdownHide() {
      if (this.hasFilter) {
        this.tmpOperator = this.value.operator;
        this.tmpValue = this.value.value;
      } else {
        this.tmpOperator = this.operators[0];
        this.tmpValue = '';
      }
    },
    applyFilter() {
      const trimmed = this.tmpValue ? this.tmpValue.trim() : '';
      if (!trimmed) {
        return;
      }

      this.$emit('input', {
        operator: this.tmpOperator,
        value: trimmed,
      });
      this.$refs.pill.hide();
    },
    clearFilter() {
      this.tmpOperator = this.operators[0];
      this.tmpValue = '';
      this.$refs.pill.hide();
      this.$emit('input', null);
    },
  },
};
</script>
