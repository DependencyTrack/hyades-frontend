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
      <b-input-group>
        <b-form-input
          :id="`datetime-range-filter-pill-from-${fieldName}`"
          v-model="tmpFrom"
          :type="dateOnly ? 'date' : 'datetime-local'"
          size="sm"
        ></b-form-input>
        <b-input-group-append>
          <b-button
            size="sm"
            variant="outline-secondary"
            :disabled="!tmpFrom"
            @click="tmpFrom = ''"
            :title="$t('message.clear')"
            :aria-label="$t('message.clear') + ' ' + $t('message.from')"
          >
            <span class="fa fa-times-circle" aria-hidden="true"></span>
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <b-form-group :label="$t('message.to')" label-size="sm" class="mb-2">
      <b-input-group>
        <b-form-input
          :id="`datetime-range-filter-pill-to-${fieldName}`"
          v-model="tmpTo"
          :type="dateOnly ? 'date' : 'datetime-local'"
          size="sm"
        ></b-form-input>
        <b-input-group-append>
          <b-button
            size="sm"
            variant="outline-secondary"
            :disabled="!tmpTo"
            @click="tmpTo = ''"
            :title="$t('message.clear')"
            :aria-label="$t('message.clear') + ' ' + $t('message.to')"
          >
            <span class="fa fa-times-circle" aria-hidden="true"></span>
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <div class="d-flex justify-content-end">
      <b-button
        variant="primary"
        size="sm"
        @click="applyFilter"
        :disabled="!tmpFrom && !tmpTo"
        >{{ $t('message.apply') }}
      </b-button>
    </div>
  </filter-pill-dropdown>
</template>

<script>
import FilterPillDropdown from '@/views/components/FilterPillDropdown.vue';

export default {
  name: 'DateTimeRangeFilterPill',
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
    dateOnly: {
      type: Boolean,
      default: false,
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
          this.tmpFrom = val.from ? this.toInputValue(val.from) : '';
          this.tmpTo = val.to ? this.toInputValue(val.to) : '';
        } else {
          this.tmpFrom = '';
          this.tmpTo = '';
        }
      },
    },
  },
  computed: {
    hasFilter() {
      return this.value && (this.value.from || this.value.to);
    },
    displayValue() {
      if (!this.value) return '';

      const from = this.value.from
        ? this.formatDisplayValue(this.value.from)
        : '';
      const to = this.value.to ? this.formatDisplayValue(this.value.to) : '';

      if (from && to) {
        return `${from} - ${to}`;
      } else if (from) {
        return `≥ ${from}`;
      } else if (to) {
        return `< ${to}`;
      }
      return '';
    },
  },
  methods: {
    formatDisplayValue(val) {
      if (!val) return '';
      if (this.dateOnly) {
        const [y, m, d] = val.split('-');
        const date = new Date(y, m - 1, d);
        return date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
      const date = new Date(val);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    toInputValue(val) {
      if (!val) return '';
      if (this.dateOnly) {
        return val;
      }
      const date = new Date(val);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    toEmitValue(inputStr) {
      if (!inputStr) return null;
      if (this.dateOnly) {
        return inputStr;
      }
      return new Date(inputStr).getTime();
    },
    open() {
      this.$refs.pill.open();
    },
    onDropdownHide() {
      if (this.hasFilter) {
        this.tmpFrom = this.value.from
          ? this.toInputValue(this.value.from)
          : '';
        this.tmpTo = this.value.to ? this.toInputValue(this.value.to) : '';
      } else {
        this.tmpFrom = '';
        this.tmpTo = '';
      }
    },
    applyFilter() {
      if (!this.tmpFrom && !this.tmpTo) {
        return;
      }

      this.$emit('input', {
        from: this.toEmitValue(this.tmpFrom),
        to: this.toEmitValue(this.tmpTo),
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
