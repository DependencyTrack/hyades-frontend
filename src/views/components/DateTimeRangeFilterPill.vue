<template>
  <div class="filter-pill-wrapper">
    <b-dropdown
      :id="`datetime-range-filter-pill-${fieldName}`"
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
            {{ fieldLabel }}&nbsp;<code>{{ displayValue }}</code>
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
              >
                <span class="fa fa-remove"></span>
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
              >
                <span class="fa fa-remove"></span>
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
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: 'DateTimeRangeFilterPill',
  props: {
    fieldName: {
      type: String,
      required: true,
    },
    fieldLabel: {
      type: String,
      required: true,
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
        const date = new Date(val);
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
        // val is a YYYY-MM-DD string
        return val;
      }
      // val is epoch millis
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
        // Emit as YYYY-MM-DD string directly
        return inputStr;
      }
      // Emit as epoch millis
      return new Date(inputStr).getTime();
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
      this.$refs.dropdown.hide();
    },
    clearFilter() {
      this.tmpFrom = '';
      this.tmpTo = '';
      this.$emit('input', null);
    },
  },
};
</script>

<style scoped src="./filter-pill.css"></style>
