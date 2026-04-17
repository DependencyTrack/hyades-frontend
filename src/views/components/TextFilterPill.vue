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
            {{ fieldLabel }} <em>{{ operatorAbbrev }}</em
            >&nbsp;<strong class="filter-pill-value"
              >"{{ value.value }}"</strong
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
  beforeDestroy() {
    this._destroying = true;
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
      this.$refs.dropdown.show();
    },
    onDropdownHide() {
      if (this.hasFilter) {
        this.tmpOperator = this.value.operator;
        this.tmpValue = this.value.value;
      } else {
        this.tmpOperator = this.operators[0];
        this.tmpValue = '';
        if (!this._destroying) {
          this.$emit('dismiss');
        }
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
      this.$refs.dropdown.hide();
    },
    clearFilter() {
      this.tmpOperator = this.operators[0];
      this.tmpValue = '';
      this.$refs.dropdown.hide();
      this.$emit('input', null);
    },
  },
};
</script>

<style scoped src="./filter-pill.css"></style>
