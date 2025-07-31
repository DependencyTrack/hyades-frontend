<template>
  <div>
    <!--
    For some reason, this has to be here. If the bootstrap-table is the only element in the template and the
    dropdown for version is changes, the table will not update. For whatever reason, adding the toolbar fixes it.
    -->
    <div id="violationsToolbar" class="bs-table-custom-toolbar">
      <c-switch
        style="margin-left: 1rem; margin-right: 0.5rem"
        id="showSuppressedViolations"
        color="primary"
        v-model="showSuppressedViolations"
        label
        v-bind="labelIcon"
      /><span class="text-muted">{{
        $t('message.show_suppressed_violations')
      }}</span>
    </div>

    <bootstrap-table
      ref="table"
      :columns="columns"
      :data="data"
      :options="options"
      @on-load-success="tableLoaded"
    >
    </bootstrap-table>
  </div>
</template>

<script>
import { Switch as cSwitch } from '@coreui/vue';
import common from '../../../shared/common';
import bootstrapTableMixin from '../../../mixins/bootstrapTableMixin';
import xssFilters from 'xss-filters';
import $ from 'jquery';
import { loadUserPreferencesForBootstrapTable } from '@/shared/utils';
import ProjectPolicyViolationDetails from '../../components/detail-formatters/ProjectPolicyViolationDetails.vue';

export default {
  props: {
    uuid: String,
  },
  mixins: [bootstrapTableMixin],
  components: { cSwitch },
  beforeCreate() {
    this.showSuppressedViolations =
      localStorage &&
      localStorage.getItem(
        'ProjectPolicyViolationsShowSuppressedViolations',
      ) !== null
        ? localStorage.getItem(
            'ProjectPolicyViolationsShowSuppressedViolations',
          ) === 'true'
        : false;
  },
  data() {
    return {
      showSuppressedViolations: this.showSuppressedViolations,
      labelIcon: {
        dataOn: '\u2713',
        dataOff: '\u2715',
      },
      columns: [
        {
          title: this.$t('message.state'),
          field: 'policyCondition.policy.violationState',
          sortable: true,
          class: 'tight',
          formatter(value, row, index) {
            if (typeof value !== 'undefined') {
              return common.formatViolationStateLabel(value);
            }
          },
        },
        {
          title: this.$t('message.risk_type'),
          field: 'type',
          sortable: true,
          class: 'tight',
          formatter(value, row, index) {
            return xssFilters.inHTMLData(
              common.capitalize(common.valueWithDefault(value, '')),
            );
          },
        },
        {
          title: this.$t('message.policy_name'),
          field: 'policyCondition.policy.name',
          sortable: true,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: this.$t('message.component'),
          field: 'component.name',
          sortable: true,
          formatter: (value, row, index) => {
            if (row.component) {
              let url = xssFilters.uriInUnQuotedAttr(
                '../../../components/' + row.component.uuid,
              );
              let name = common.concatenateComponentName(
                null,
                row.component.name,
                row.component.version,
              );
              let dependencyGraphUrl = xssFilters.uriInUnQuotedAttr(
                '../../../projects/' +
                  this.uuid +
                  '/dependencyGraph/' +
                  row.component.uuid,
              );
              return (
                `<a href="${dependencyGraphUrl}"<i class="fa fa-sitemap" aria-hidden="true" style="float:right; padding-top: 4px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Show in dependency graph"></i></a> ` +
                `<a href="${url}">${xssFilters.inHTMLData(name)}</a>`
              );
            } else {
              return '';
            }
          },
        },
        {
          title: this.$t('message.occurred_on'),
          field: 'timestamp',
          sortable: true,
          formatter(value, row, index) {
            return xssFilters.inHTMLData(common.formatTimestamp(value));
          },
        },
        {
          title: this.$t('message.analysis'),
          field: 'analysis.analysisState',
          sortable: false,
          formatter: common.makeAnalysisStateLabelFormatter(this),
        },
        {
          title: this.$t('message.suppressed'),
          field: 'analysis.isSuppressed',
          sortable: false,
          class: 'tight',
          formatter(value, row, index) {
            return value === true ? '<i class="fa fa-check-square-o" />' : '';
          },
        },
      ],
      data: [],
      options: {
        search: true,
        showColumns: true,
        showRefresh: true,
        pagination: true,
        silentSort: false,
        sidePagination: 'server',
        toolbar: '#violationsToolbar',
        queryParamsType: 'pageSize',
        pageList: '[10, 25, 50, 100]',
        pageSize:
          localStorage &&
          localStorage.getItem('ProjectPolicyViolationsPageSize') !== null
            ? Number(localStorage.getItem('ProjectPolicyViolationsPageSize'))
            : 10,
        sortName:
          localStorage &&
          localStorage.getItem('ProjectPolicyViolationsSortName') !== null
            ? localStorage.getItem('ProjectPolicyViolationsSortName')
            : undefined,
        sortOrder:
          localStorage &&
          localStorage.getItem('ProjectPolicyViolationsSortOrder') !== null
            ? localStorage.getItem('ProjectPolicyViolationsSortOrder')
            : undefined,
        icons: {
          detailOpen: 'fa-fw fa-angle-right',
          detailClose: 'fa-fw fa-angle-down',
          refresh: 'fa-refresh',
        },
        detailView: true,
        detailViewIcon: true,
        detailViewByClick: false,
        detailFormatter: (index, row) => {
          const props = { row, index, uuid: this.uuid };
          return this.vueFormatter({
            render: (h) => h(ProjectPolicyViolationDetails, { props }),
          });
        },
        onExpandRow: this.vueFormatterInit,
        responseHandler: function (res, xhr) {
          res.total = xhr.getResponseHeader('X-Total-Count');
          return res;
        },
        url: this.apiUrl(),
        onPostBody: this.initializeTooltips,
        onPageChange: (number, size) => {
          if (localStorage) {
            localStorage.setItem(
              'ProjectPolicyViolationsPageSize',
              size.toString(),
            );
          }
        },
        onColumnSwitch: (field, checked) => {
          if (localStorage) {
            localStorage.setItem(
              'ProjectPolicyViolationsShow' + common.capitalize(field),
              checked.toString(),
            );
          }
        },
        onSort: (name, order) => {
          if (localStorage) {
            localStorage.setItem('ProjectPolicyViolationsSortName', name);
            localStorage.setItem('ProjectPolicyViolationsSortOrder', order);
          }
        },
      },
    };
  },
  methods: {
    apiUrl: function () {
      let url = `${this.$api.BASE_URL}/${this.$api.URL_POLICY_VIOLATION}/project/${this.uuid}`;
      if (this.showSuppressedViolations === undefined) {
        url += '?suppressed=false';
      } else {
        url += '?suppressed=' + this.showSuppressedViolations;
      }
      return url;
    },
    refreshTable: function () {
      this.$refs.table.refresh({
        url: this.apiUrl(),
        silent: true,
      });
    },
    tableLoaded: function (data) {
      loadUserPreferencesForBootstrapTable(
        this,
        'ProjectPolicyViolations',
        this.$refs.table.columns,
      );
      this.$emit('total', data.total);
    },
    initializeTooltips: function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    },
  },
  watch: {
    showSuppressedViolations() {
      if (localStorage) {
        localStorage.setItem(
          'ProjectPolicyViolationsShowSuppressedViolations',
          this.showSuppressedViolations.toString(),
        );
      }
      this.refreshTable();
    },
  },
};
</script>
