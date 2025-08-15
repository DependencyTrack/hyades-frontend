<template>
  <b-card no-body header="Workflow Runs">
    <b-card-body>
      <!--
        TODO: Filter pills for:
          - Name
          - Version
          - Status
          - Created
          - Completed
      -->
      <token-paginated-table
        ref="table"
        :base-url="tableDataBaseUrl"
        :columns="tableColumns"
        :options="{}"
      />
    </b-card-body>
  </b-card>
</template>
<script>
import TokenPaginatedTable from '@/views/components/TokenPaginatedTable.vue';
import common from '@/shared/common';

export default {
  components: { TokenPaginatedTable },
  data() {
    return {
      tableColumns: [
        {
          title: 'ID', // TODO: i18n
          field: 'id',
        },
        {
          title: 'Workflow', // TODO: i18n
          field: 'workflow_name',
        },
        {
          title: 'Workflow Version', // TODO: i18n
          field: 'workflow_version',
          visible: false,
        },
        {
          title: 'Status', // TODO: i18n
          field: 'status',
          formatter(value) {
            // TODO: i18n for status text.
            let iconName = 'fa-question';
            if (value === 'CANCELED') {
              iconName = 'fa-ban';
            } else if (value === 'FAILED') {
              iconName = 'fa-fire';
            } else if (value === 'SUSPENDED') {
              iconName = 'fa-pause';
            } else if (value === 'RUNNING') {
              iconName = 'fa-play';
            } else if (value === 'PENDING') {
              iconName = 'fa-hourglass-start';
            } else if (value === 'COMPLETED') {
              iconName = 'fa-check';
            }
            return `<span class="fa ${iconName} text-primary">&nbsp;</span> ${value}`;
          },
        },
        {
          title: 'Created', // TODO: i18n
          field: 'created_at',
          formatter(value) {
            return value ? common.formatTimestamp(value, true) : '-';
          },
        },
        {
          title: 'Updated', // TODO: i18n
          field: 'updated_at',
          visible: false,
          formatter(value) {
            return value ? common.formatTimestamp(value, true) : '-';
          },
        },
        {
          title: 'Started', // TODO: i18n
          field: 'started_at',
          visible: false,
          formatter(value) {
            return value ? common.formatTimestamp(value, true) : '-';
          },
        },
        {
          title: 'Completed', // TODO: i18n
          field: 'completed_at',
          formatter(value) {
            return value ? common.formatTimestamp(value, true) : '-';
          },
        },
      ],
    };
  },
  computed: {
    tableDataBaseUrl() {
      return `${this.$api.BASE_URL}/api/v2/workflow-runs`;
    },
  },
};
</script>
