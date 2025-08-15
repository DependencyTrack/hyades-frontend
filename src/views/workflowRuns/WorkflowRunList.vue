<template>
  <b-card no-body header="Workflow Runs">
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
          field-label="Workflow Name"
          field-name="workflow_name"
          :operators="['equals']"
          v-model="workflowNameFilter"
        />
        <enum-filter-pill
          field-label="Status"
          field-name="status"
          :options="statusOptions"
          v-model="statusFilter"
        />
        <date-time-range-filter-pill
          field-label="Created"
          field-name="created_at"
          v-model="createdFilter"
        />
        <date-time-range-filter-pill
          field-label="Completed"
          field-name="completed_at"
          v-model="completedFilter"
        />
      </div>
      <token-paginated-table
        ref="table"
        :base-url="tableDataBaseUrl"
        response-data-field="workflow_runs"
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
        'CANCELED',
        'COMPLETED',
        'CREATED',
        'FAILED',
        'RUNNING',
        'SUSPENDED',
      ].map((status) => {
        return {
          value: status,
          text: this.$t(`message.status_${status.toLowerCase()}`),
        };
      }),
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
            return `<a href="/workflowRuns/${value}">${value}</a>`;
          },
        },
        {
          title: this.$t('admin.workflow_name'),
          field: 'workflow_name',
          formatter: (_, row) => {
            return `${row.workflow_name} v${row.workflow_version}`;
          },
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
        {
          title: this.$t('message.actions'),
          align: 'center',
          sortable: false,
          searchable: false,
          formatter: (_, row) => {
            const canPause = row.status === 'RUNNING';
            const canResume = row.status === 'SUSPENDED';
            const canCancel =
              row.status === 'RUNNING' || row.status === 'SUSPENDED';
            const canDelete =
              row.status === 'CANCELED' ||
              row.status === 'COMPLETED' ||
              row.status === 'FAILED';

            return `
              <button class="btn btn-sm btn-outline-primary action-btn" data-action="pause" title="" ${!canPause ? 'hidden' : ''}>
                <i class="fa fa-pause"></i>
              </button>
              <button class="btn btn-sm btn-outline-primary action-btn" data-action="resume" title="" ${!canResume ? 'hidden' : ''}>
                <i class="fa fa-play"></i>
              </button>
              <button class="btn btn-sm btn-outline-warning action-btn" data-action="cancel" title="" ${!canCancel ? 'hidden' : ''}>
                <i class="fa fa-ban"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger action-btn" data-action="delete" title="" ${!canDelete ? 'disabled' : ''}>
                <i class="fa fa-trash"></i>
              </button>
            `;
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
      const url = new URL('http://localhost:8080/api/v2/workflow-runs');
      if (
        this.workflowNameFilter &&
        this.workflowNameFilter.value &&
        this.workflowNameFilter.operator === 'equals'
      ) {
        url.searchParams.set('workflow_name', this.workflowNameFilter.value);
      }
      if (this.statusFilter) {
        url.searchParams.set('status', this.statusFilter);
      }
      if (this.createdFilter) {
        if (this.createdFilter.from) {
          url.searchParams.set('created_at_from', this.createdFilter.from);
        }
        if (this.createdFilter.to) {
          url.searchParams.set('created_at_to', this.createdFilter.to);
        }
      }
      if (this.completedFilter) {
        if (this.completedFilter.from) {
          url.searchParams.set('completed_at_from', this.completedFilter.from);
        }
        if (this.completedFilter.to) {
          url.searchParams.set('completed_at_to', this.completedFilter.to);
        }
      }
      if (this.sortBy) {
        url.searchParams.set('sort_by', this.sortBy);
      }
      if (this.sortDirection) {
        url.searchParams.set(
          'sort_direction',
          this.sortDirection.toUpperCase(),
        );
      }
      return url.toString();
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
