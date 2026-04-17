export default {
  data: () => ({
    pendingFilters: {},
  }),
  computed: {
    hasActiveFilters() {
      return this.allFilterDefs.some((f) => this.hasFilterValue(f.name));
    },
    addFilterOptions() {
      return this.allFilterDefs.filter((f) => !this.isFilterVisible(f.name));
    },
  },
  created() {
    this.allFilterDefs.forEach((def) => {
      const name = def.name;
      const isBoolean =
        this.booleanFilters && this.booleanFilters.includes(name);
      const dataKey = isBoolean ? name : name + 'Filter';

      this.$watch(dataKey, (val) => {
        if (!isBoolean) {
          const hasValue = Array.isArray(val) ? val.length > 0 : !!val;
          if (hasValue) this.$set(this.pendingFilters, name, false);
        }
        if (!this._clearing && typeof this.refreshTable === 'function') {
          this.refreshTable();
        }
      });
    });
  },
  methods: {
    hasFilterValue(name) {
      if (this.booleanFilters && this.booleanFilters.includes(name)) {
        return !!this[name];
      }
      const val = this[name + 'Filter'];
      return Array.isArray(val) ? val.length > 0 : !!val;
    },
    isFilterVisible(name) {
      return this.pendingFilters[name] || this.hasFilterValue(name);
    },
    showFilter(name) {
      if (this.booleanFilters && this.booleanFilters.includes(name)) {
        this[name] = true;
        return;
      }
      this.$set(this.pendingFilters, name, true);
      this.$nextTick(() => {
        this.$nextTick(() => {
          const ref = this.$refs['filter_' + name];
          if (ref && ref.open) {
            ref.open();
          }
        });
      });
    },
    onFilterDismiss(name) {
      this.$set(this.pendingFilters, name, false);
    },
    clearPendingFilters() {
      Object.keys(this.pendingFilters).forEach((k) => {
        this.pendingFilters[k] = false;
      });
    },
  },
};
