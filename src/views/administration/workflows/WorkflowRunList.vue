<template>
  <b-card no-body :header="$t('admin.workflow_runs')">
    <b-card-body>
      <div class="filter-pills">
        <b-button
          v-if="hasActiveFilters"
          size="sm"
          variant="outline-danger"
          class="btn-clear-all-filters"
          @click="clearAllFilters"
        >
          {{ $t('message.clear_all') }} <span class="fa fa-remove"></span>
        </b-button>
        <text-filter-pill
          :field-label="$t('admin.workflow_name')"
          field-name="workflow_name"
          :operators="['equals']"
          v-model="workflowNameFilter"
        />
        <enum-filter-pill
          :field-label="$t('message.status')"
          field-name="status"
          :options="statusOptions"
          v-model="statusFilter"
        />
        <date-time-range-filter-pill
          :field-label="$t('message.created')"
          field-name="created_at"
          v-model="createdFilter"
        />
        <date-time-range-filter-pill
          :field-label="$t('message.completed')"
          field-name="completed_at"
          v-model="completedFilter"
        />
      </div>
      <token-paginated-table
        ref="table"
        :base-url="tableDataBaseUrl"
        :columns="tableColumns"
        :options="tableOptions"
      />
    </b-card-body>
  </b-card>
</template>
<script>
import DateTimeRangeFilterPill from '@/views/components/DateTimeRangeFilterPill.vue';
import EnumFilterPill from '@/views/components/EnumFilterPill.vue';
import TextFilterPill from '@/views/components/TextFilterPill.vue';
import TokenPaginatedTable from '@/views/components/TokenPaginatedTable.vue';
import common from '@/shared/common';

export default {
  components: {
    DateTimeRangeFilterPill,
    EnumFilterPill,
    TextFilterPill,
    TokenPaginatedTable,
  },
  data() {
    return {
      workflowNameFilter: null,
      statusFilter: null,
      createdFilter: null,
      completedFilter: null,
      sortBy: null,
      sortDirection: null,
      statusOptions: [
        { value: 'CANCELED', text: this.$t(`message.status_canceled`) },
        { value: 'COMPLETED', text: this.$t(`message.status_completed`) },
        { value: 'CREATED', text: this.$t(`message.status_created`) },
        { value: 'FAILED', text: this.$t(`message.status_failed`) },
        { value: 'RUNNING', text: this.$t(`message.status_running`) },
        { value: 'SUSPENDED', text: this.$t(`message.status_suspended`) },
      ],
      tableOptions: {
        sortName: 'id',
        sortOrder: 'desc',
        // Suppress client-side sorting.
        customSort: () => {},
        onSort: (name, order) => {
          this.sortBy = name;
          this.sortDirection = order;
        },
      },
      tableColumns: [
        {
          title: this.$t('message.id'),
          field: 'id',
          sortable: true,
          formatter: (value) => {
            const href = this.$router.resolve({
              name: 'WorkflowRunDetail',
              params: { id: value },
            }).href;
            return `<a href="${href}">${value}</a>`;
          },
        },
        {
          title: this.$t('admin.workflow_name'),
          field: 'workflow_name',
        },
        {
          title: this.$t('message.status'),
          field: 'status',
          formatter: (value) => {
            let iconName = 'fa-question';
            let textVariant = 'primary';
            if (value === 'CANCELED') {
              iconName = 'fa-ban';
              textVariant = 'warning';
            } else if (value === 'FAILED') {
              iconName = 'fa-fire';
              textVariant = 'danger';
            } else if (value === 'SUSPENDED') {
              iconName = 'fa-pause';
            } else if (value === 'RUNNING') {
              iconName = 'fa-play';
              textVariant = 'secondary';
            } else if (value === 'CREATED') {
              iconName = 'fa-hourglass-start';
            } else if (value === 'COMPLETED') {
              iconName = 'fa-check';
              textVariant = 'success';
            }
            const i18nValue = this.$t(`message.status_${value.toLowerCase()}`);
            return `<span class="fa ${iconName} text-${textVariant}">&nbsp;</span> ${i18nValue}`;
          },
        },
        {
          title: this.$t('message.created'),
          field: 'created_at',
          sortable: true,
          formatter(value) {
            return value ? common.formatTimestamp(value, true) : '-';
          },
        },
        {
          title: this.$t('message.updated'),
          field: 'updated_at',
          visible: false,
          formatter(value) {
            return value ? common.formatTimestamp(value, true) : '-';
          },
        },
        {
          title: this.$t('message.started'),
          field: 'started_at',
          visible: false,
          formatter(value) {
            return value ? common.formatTimestamp(value, true) : '-';
          },
        },
        {
          title: this.$t('message.completed'),
          field: 'completed_at',
          sortable: true,
          formatter(value) {
            return value ? common.formatTimestamp(value, true) : '-';
          },
        },
      ],
    };
  },
  computed: {
    hasActiveFilters() {
      return (
        this.workflowNameFilter ||
        this.statusFilter ||
        this.createdFilter ||
        this.completedFilter
      );
    },
    tableDataBaseUrl() {
      const url = `${this.$api.BASE_URL}/api/v2/workflow-runs`;
      const queryParams = {};
      if (
        this.workflowNameFilter &&
        this.workflowNameFilter.value &&
        this.workflowNameFilter.operator === 'equals'
      ) {
        queryParams.workflow_name = this.workflowNameFilter.value;
      }
      if (this.statusFilter) {
        queryParams.status = this.statusFilter;
      }
      if (this.createdFilter) {
        if (this.createdFilter.from) {
          queryParams.created_at_from = this.createdFilter.from;
        }
        if (this.createdFilter.to) {
          queryParams.created_at_to = this.createdFilter.to;
        }
      }
      if (this.completedFilter) {
        if (this.completedFilter.from) {
          queryParams.completed_at_from = this.completedFilter.from;
        }
        if (this.completedFilter.to) {
          queryParams.completed_at_to = this.completedFilter.to;
        }
      }
      if (this.sortBy) {
        queryParams.sort_by = this.sortBy;
      }
      if (this.sortDirection) {
        queryParams.sort_direction = this.sortDirection.toUpperCase();
      }
      return common.setQueryParams(url, queryParams);
    },
  },
  methods: {
    clearAllFilters() {
      this.workflowNameFilter = null;
      this.statusFilter = null;
      this.createdFilter = null;
      this.completedFilter = null;
    },
  },
};
</script>

<style scoped>
.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-clear-all-filters {
  border-radius: 20px;
}
</style>
