<template>
  <div class="filter-pill-wrapper">
    <b-dropdown
      :id="`text-filter-pill-${fieldName}`"
      class="filter-pill"
      ref="dropdown"
      size="sm"
      variant="outline-primary"
      no-caret
      boundary="viewport"
      @show="onDropdownShow"
      @hide="onDropdownHide"
    >
      <template #button-content>
        <div class="d-flex align-items-center">
          <span v-if="!hasFilter">
            {{ fieldLabel }}
            <span class="fa fa-filter"></span>
          </span>
          <span v-else>
            {{ fieldLabel }} <em>{{ operatorAbbrev }}</em
            >&nbsp;<code>"{{ value.value }}"</code>
          </span>

          <b-button
            class="btn-filter-pill-clear"
            v-if="hasFilter"
            size="sm"
            :title="`Clear ${fieldLabel} filter`"
            @click.stop="clearFilter"
          >
            <span class="fa fa-remove"></span>
          </b-button>
        </div>
      </template>
      <b-dropdown-form class="filter-pill-form pt-2 pb-2" @submit.stop.prevent>
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
            >Apply
          </b-button>
        </div>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
const supportedOperators = [
  {
    name: 'equals',
    symbol: '=',
  },
  {
    name: 'contains',
    symbol: '~',
  },
];

export default {
  name: 'TextFilterPill',
  props: {
    fieldName: {
      type: String,
      required: true,
    },
    fieldLabel: {
      type: String,
      required: true,
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
      return supportedOperators.find((op) => op.name === this.tmpOperator).name;
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
    onDropdownHide() {
      if (!this.hasFilter) {
        this.tmpOperator = this.operators[0];
        this.tmpValue = '';
      }
    },
    applyFilter() {
      if (!this.tmpValue) {
        return;
      }

      this.$emit('input', {
        operator: this.tmpOperator,
        value: this.tmpValue,
      });
      this.$refs.dropdown.hide();
    },
    clearFilter() {
      this.tmpOperator = this.operators[0];
      this.tmpValue = '';
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
