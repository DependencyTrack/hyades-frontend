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
    <template #value>= {{ displayValue }}</template>

    <div class="mb-2 d-flex justify-content-between">
      <b-link size="sm" @click="selectAll">{{
        $t('message.select_all')
      }}</b-link>
      <b-link size="sm" @click="deselectAll">{{
        $t('message.clear_all')
      }}</b-link>
    </div>
    <b-form-checkbox-group
      v-model="tmpValue"
      :options="options"
      stacked
      class="mb-2"
    ></b-form-checkbox-group>
    <div class="d-flex justify-content-end">
      <b-button
        variant="primary"
        size="sm"
        @click="applyFilter"
        :disabled="tmpValue.length === 0"
        >{{ $t('message.apply') }}
      </b-button>
    </div>
  </filter-pill-dropdown>
</template>

<script>
import FilterPillDropdown from '@/views/components/FilterPillDropdown.vue';

export default {
  name: 'MultiSelectFilterPill',
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
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tmpValue: [],
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.tmpValue = val && val.length > 0 ? [...val] : [];
      },
    },
  },
  computed: {
    hasFilter() {
      return this.value && this.value.length > 0;
    },
    displayValue() {
      if (!this.value || this.value.length === 0) return '';
      return this.value
        .map((v) => {
          const option = this.options.find(
            (opt) => (typeof opt === 'object' ? opt.value : opt) === v,
          );
          return option && typeof option === 'object' ? option.text : v;
        })
        .join(', ');
    },
  },
  methods: {
    selectAll() {
      this.tmpValue = this.options.map((opt) =>
        typeof opt === 'object' ? opt.value : opt,
      );
    },
    deselectAll() {
      this.tmpValue = [];
    },
    open() {
      this.$refs.pill.open();
    },
    onDropdownHide() {
      if (this.hasFilter) {
        this.tmpValue = [...this.value];
      } else {
        this.tmpValue = [];
      }
    },
    applyFilter() {
      if (this.tmpValue.length === 0) {
        return;
      }
      this.$emit('input', [...this.tmpValue]);
      this.$refs.pill.hide();
    },
    clearFilter() {
      this.tmpValue = [];
      this.$refs.pill.hide();
      this.$emit('input', null);
    },
  },
};
</script>
