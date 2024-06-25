<template>
  <div class="animated fadeIn" v-permission="PERMISSIONS.VIEW_PORTFOLIO">
    <portfolio-widget-row :fetch="true" />
    <bootstrap-table
      ref="table"
      :columns="columns"
      :data="data"
      :options="options"
      @on-load-success="onLoadSuccess"
    >
    </bootstrap-table>
  </div>
</template>

<script>
import common from '../../../shared/common';
import PortfolioWidgetRow from '../../dashboard/PortfolioWidgetRow';
import xssFilters from 'xss-filters';
import permissionsMixin from '../../../mixins/permissionsMixin';
import routerMixin from '../../../mixins/routerMixin';

export default {
  mixins: [permissionsMixin, routerMixin],
  components: {
    PortfolioWidgetRow,
  },
  methods: {
    refreshTable: function () {
      this.$refs.table.refresh({
        url: `${this.$api.BASE_URL}/${this.$api.URL_TAG}`,
        silent: true,
      });
    },
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('message.name'),
          field: 'name',
          sortable: true,
          formatter(value) {
            return xssFilters.inHTMLData(common.valueWithDefault(value, ''));
          },
        },
        {
          title: 'Projects',
          field: 'projectCount',
          sortable: true,
        },
        {
          title: 'Policies',
          field: 'policyCount',
          sortable: true,
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
        queryParamsType: 'pageSize',
        pageList: '[10, 25, 50, 100]',
        pageSize: 10,
        sortName: undefined,
        sortOrder: undefined,
        searchText: '',
        icons: {
          refresh: 'fa-refresh',
        },
        responseHandler: function (res, xhr) {
          res.total = xhr.getResponseHeader('X-Total-Count');
          return res;
        },
        url: `${this.$api.BASE_URL}/${this.$api.URL_TAG}`,
      },
    };
  },
};
</script>
