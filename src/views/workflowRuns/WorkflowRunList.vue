<template>
  <b-card no-body :header="header">
    <b-card-body>
      <bootstrap-table
        ref="table"
        :columns="columns"
        :data="data"
        :options="options"
      >
      </bootstrap-table>
    </b-card-body>
  </b-card>
</template>

<script>
import xssFilters from 'xss-filters';
import common from '../../shared/common';
import bootstrapTableMixin from '../../mixins/bootstrapTableMixin';

export default {
  props: {
    header: String,
  },
  mixins: [bootstrapTableMixin],
  data() {
    return {
      columns: [
        {
          field: 'state',
          checkbox: true,
          align: 'center',
        },
        {
          title: 'ID',
          field: 'id',
          sortable: true,
          formatter: (value) => {
            const detailsUrl = this.$router.resolve({
              name: 'Workflow Run Details',
              params: { runId: value },
            }).href;
            return `<a href="${detailsUrl}"><span class="d-inline-block text-truncate" style="max-width: 150px">${value}</span></a>`;
          },
        },
        {
          title: 'Workflow',
          field: 'workflowName',
          sortable: false,
          formatter(value, row) {
            return `${value} v${row.workflowVersion}`;
          },
        },
        {
          title: 'Status',
          field: 'status',
          sortable: false,
          formatter(value, row) {
            // TODO: i18n for status text.
            let iconName = 'fa-question';
            if (row.runtimeStatus === 'CANCELLED') {
              iconName = 'fa-ban';
            } else if (row.runtimeStatus === 'FAILED') {
              iconName = 'fa-fire';
            } else if (row.runtimeStatus === 'SUSPENDED') {
              iconName = 'fa-pause';
            } else if (row.runtimeStatus === 'RUNNING') {
              iconName = 'fa-play';
            } else if (row.runtimeStatus === 'PENDING') {
              iconName = 'fa-hourglass-start';
            } else if (row.runtimeStatus === 'COMPLETED') {
              iconName = 'fa-check';
            }
            return `<span class="fa ${iconName} text-primary">&nbsp;</span> ${value || row.runtimeStatus}`;
          },
        },
        {
          title: 'Created',
          field: 'createdAt',
          visible: false,
          sortable: true,
          formatter(value) {
            return common.formatTimestamp(value, true);
          },
        },
        {
          title: 'Started',
          field: 'startedAt',
          visible: false,
          sortable: true,
          formatter(value) {
            return common.formatTimestamp(value, true);
          },
        },
        {
          title: 'Updated',
          field: 'updatedAt',
          sortable: true,
          formatter(value) {
            return value ? common.formatTimestamp(value, true) : '-';
          },
        },
        {
          title: 'Completed',
          field: 'completedAt',
          sortable: true,
          formatter(value) {
            return value ? common.formatTimestamp(value, true) : '-';
          },
        },
      ],
      data: [],
      options: {
        buttons: {
          btnSuspendSelected: {
            icon: 'fa fa-pause',
            attributes: {
              title: 'Pause selected',
            },
            event: () => {
              let selected = this.$refs.table.getSelections();
              if (
                !selected ||
                (Array.isArray(selected) && selected.length === 0)
              ) {
                this.$toastr.w(this.$t('message.empty_selection'));
                return;
              }
              this.suspendRuns(selected.map((row) => row.id)).then(() => {
                this.$toastr.s(this.$t('message.updated'));
                this.refreshTable();
              });
            },
          },
          btnResumeSelected: {
            icon: 'fa fa-play',
            attributes: {
              title: 'Resume selected',
            },
            event: () => {
              let selected = this.$refs.table.getSelections();
              if (
                !selected ||
                (Array.isArray(selected) && selected.length === 0)
              ) {
                this.$toastr.w(this.$t('message.empty_selection'));
                return;
              }
              this.resumeRuns(selected.map((row) => row.id)).then(() => {
                this.$toastr.s(this.$t('message.updated'));
                this.refreshTable();
              });
            },
          },
          btnCancelSelected: {
            icon: 'fa fa-ban',
            attributes: {
              title: 'Cancel selected',
            },
            event: () => {
              let selected = this.$refs.table.getSelections();
              if (
                !selected ||
                (Array.isArray(selected) && selected.length === 0)
              ) {
                this.$toastr.w(this.$t('message.empty_selection'));
                return;
              }
              this.cancelRuns(selected.map((row) => row.id)).then(() => {
                this.$toastr.s(this.$t('message.updated'));
                this.refreshTable();
              });
            },
          },
        },
        buttonsOrder: [
          'btnSuspendSelected',
          'btnResumeSelected',
          'btnCancelSelected',
          'refresh',
          'columns',
        ],
        clickToSelect: true,
        uniqueId: 'id',
        search: true,
        showColumns: true,
        showRefresh: true,
        pagination: true,
        silentSort: false,
        sortName: 'updatedAt',
        sortOrder: 'desc',
        sidePagination: 'server',
        queryParamsType: 'pageSize',
        pageList: '[10, 25, 50, 100]',
        pageSize: 10,
        icons: {
          refresh: 'fa-refresh',
        },
        toolbar: '#customToolbar',
        responseHandler: function (res, xhr) {
          res.total = xhr.getResponseHeader('X-Total-Count');
          return res;
        },
        url: `${this.$api.BASE_URL}/${this.$api.URL_WORKFLOW}/run`,
      },
    };
  },
  methods: {
    suspendRuns: function (runIds) {
      console.log(runIds);
      return Promise.all(
        runIds.map((runId) =>
          this.axios.post(
            `${this.$api.BASE_URL}/${this.$api.URL_WORKFLOW}/run/${runId}/suspend`,
          ),
        ),
      );
    },
    resumeRuns: function (runIds) {
      return Promise.all(
        runIds.map((runId) =>
          this.axios.post(
            `${this.$api.BASE_URL}/${this.$api.URL_WORKFLOW}/run/${runId}/resume`,
          ),
        ),
      );
    },
    cancelRuns: function (runIds) {
      console.log(runIds);
      return Promise.all(
        runIds.map((runId) =>
          this.axios.post(
            `${this.$api.BASE_URL}/${this.$api.URL_WORKFLOW}/run/${runId}/cancel?reason=foo`,
          ),
        ),
      );
    },
    refreshTable: function () {
      this.$refs.table.refresh({
        silent: true,
      });
    },
  },
};
</script>
