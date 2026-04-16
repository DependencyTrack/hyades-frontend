<template>
  <div class="filter-pill-wrapper">
    <b-dropdown
      :id="`text-search-filter-pill-${fieldName}`"
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
            <span class="fa fa-search"></span>
          </span>
          <span v-else>
            {{ fieldLabel }} <em>~</em>&nbsp;<code>"{{ value.value }}"</code>
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
          <b-form-input
            :id="`text-search-filter-pill-value-${fieldName}`"
            ref="valueInput"
            v-model="tmpValue"
            :placeholder="$t('message.search') + '...'"
            size="sm"
            @keyup.enter="applyFilter"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :label="$t('message.search_in')"
          label-size="sm"
          class="mb-2"
        >
          <b-form-checkbox-group
            v-model="tmpFields"
            :options="fields"
            stacked
            size="sm"
          ></b-form-checkbox-group>
        </b-form-group>
        <div class="d-flex justify-content-end">
          <b-button
            variant="primary"
            size="sm"
            @click="applyFilter"
            :disabled="!tmpValue || tmpFields.length === 0"
            >{{ $t('message.apply') }}
          </b-button>
        </div>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: 'TextSearchFilterPill',
  props: {
    fieldName: {
      type: String,
      required: true,
    },
    fieldLabel: {
      type: String,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      tmpFields: this.allFieldValues(),
      tmpValue: '',
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val && val.fields && val.value) {
          this.tmpFields = [...val.fields];
          this.tmpValue = val.value;
        } else {
          this.tmpFields = this.allFieldValues();
          this.tmpValue = '';
        }
      },
    },
  },
  computed: {
    hasFilter() {
      return (
        this.value &&
        this.value.fields &&
        this.value.fields.length > 0 &&
        this.value.value
      );
    },
  },
  methods: {
    allFieldValues() {
      return this.fields.map((f) => (typeof f === 'object' ? f.value : f));
    },
    onDropdownShow() {
      this.$nextTick(() => {
        if (this.$refs.valueInput) {
          this.$refs.valueInput.focus();
        }
      });
    },
    onDropdownHide() {
      if (this.hasFilter) {
        this.tmpFields = [...this.value.fields];
        this.tmpValue = this.value.value;
      } else {
        this.tmpFields = this.allFieldValues();
        this.tmpValue = '';
      }
    },
    applyFilter() {
      const trimmed = this.tmpValue ? this.tmpValue.trim() : '';
      if (!trimmed || this.tmpFields.length === 0) return;
      this.$emit('input', {
        fields: [...this.tmpFields],
        value: trimmed,
      });
      this.$refs.dropdown.hide();
    },
    clearFilter() {
      this.tmpFields = this.allFieldValues();
      this.tmpValue = '';
      this.$emit('input', null);
    },
  },
};
</script>

<style scoped src="./filter-pill.css"></style>
