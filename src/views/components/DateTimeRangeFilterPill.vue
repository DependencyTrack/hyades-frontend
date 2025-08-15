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
            :title="`Clear ${fieldLabel} filter`"
            @click.stop="clearFilter"
          >
            <span class="fa fa-remove"></span>
          </b-button>
        </div>
      </template>
      <b-dropdown-form class="filter-pill-form pt-2 pb-2" @submit.stop.prevent>
        <b-form-group label="From (inclusive)" label-size="sm" class="mb-2">
          <b-input-group>
            <b-form-input
              :id="`datetime-range-filter-pill-from-${fieldName}`"
              v-model="tmpFrom"
              type="datetime-local"
              size="sm"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                size="sm"
                variant="outline-secondary"
                :disabled="!tmpFrom"
                @click="tmpFrom = ''"
                title="Clear"
              >
                <span class="fa fa-remove"></span>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <b-form-group label="To (exclusive)" label-size="sm" class="mb-2">
          <b-input-group>
            <b-form-input
              :id="`datetime-range-filter-pill-to-${fieldName}`"
              v-model="tmpTo"
              type="datetime-local"
              size="sm"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                size="sm"
                variant="outline-secondary"
                :disabled="!tmpTo"
                @click="tmpTo = ''"
                title="Clear"
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
            >Apply
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
          this.tmpFrom = val.from
            ? this.epochMillisToDateTimeLocal(val.from)
            : '';
          this.tmpTo = val.to ? this.epochMillisToDateTimeLocal(val.to) : '';
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
        ? this.formatDisplayDateTime(this.value.from)
        : '';
      const to = this.value.to ? this.formatDisplayDateTime(this.value.to) : '';

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
    formatDisplayDateTime(epochMillis) {
      if (!epochMillis) return '';
      const date = new Date(epochMillis);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    epochMillisToDateTimeLocal(epochMillis) {
      if (!epochMillis) return '';
      const date = new Date(epochMillis);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    toEpochMillis(dateTimeLocalStr) {
      if (!dateTimeLocalStr) return null;
      const date = new Date(dateTimeLocalStr);
      return date.getTime();
    },
    onDropdownHide() {
      if (!this.hasFilter) {
        this.tmpFrom = '';
        this.tmpTo = '';
      }
    },
    applyFilter() {
      if (!this.tmpFrom && !this.tmpTo) {
        return;
      }

      this.$emit('input', {
        from: this.tmpFrom ? this.toEpochMillis(this.tmpFrom) : null,
        to: this.tmpTo ? this.toEpochMillis(this.tmpTo) : null,
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
